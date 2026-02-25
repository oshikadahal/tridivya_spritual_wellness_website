import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

type CacheEntry = {
  expiry: number;
  payload: unknown;
};

const responseCache = new Map<string, CacheEntry>();

export const responseTimeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    const elapsedMs = Date.now() - startedAt;
    if (!res.headersSent) return;
    res.setHeader('X-Response-Time', `${elapsedMs}ms`);
  });

  next();
};

export const paginationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  (req as Request & { pagination?: { page: number; limit: number; skip: number } }).pagination = {
    page,
    limit,
    skip,
  };

  next();
};

export const etagMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = ((data: unknown) => {
    const digest = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    const etag = `"${digest}"`;

    if (req.headers['if-none-match'] === etag) {
      return res.status(304).send();
    }

    res.setHeader('ETag', etag);
    return originalJson(data);
  }) as Response['json'];

  next();
};

export const cacheMiddleware = (ttlSeconds = 60) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.method}:${req.originalUrl}`;
    const cached = responseCache.get(key);
    const now = Date.now();

    if (cached && cached.expiry > now) {
      return res.status(200).json(cached.payload);
    }

    const originalJson = res.json.bind(res);
    res.json = ((data: unknown) => {
      responseCache.set(key, {
        payload: data,
        expiry: now + ttlSeconds * 1000,
      });
      return originalJson(data);
    }) as Response['json'];

    next();
  };
};

export const clearCacheAfterModification = (_req: Request, _res: Response, next: NextFunction) => {
  responseCache.clear();
  next();
};

export const rateLimitMiddleware = (requestsPerMinute = 60) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - 60_000;

    const timestamps = (requests.get(ip) || []).filter((time) => time > windowStart);

    if (timestamps.length >= requestsPerMinute) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
      });
    }

    timestamps.push(now);
    requests.set(ip, timestamps);
    next();
  };
};
