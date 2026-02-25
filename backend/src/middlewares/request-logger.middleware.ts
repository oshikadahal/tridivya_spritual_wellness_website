import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Log incoming request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Track response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;

    // Log response
    logger.info('Response sent', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    // Log errors
    if (res.statusCode >= 400) {
      logger.warn('HTTP error', {
        requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        body: typeof data === 'string' ? data : JSON.stringify(data),
      });
    }

    return originalSend.call(this, data);
  };

  next();
};

export const errorLoggerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error', {
    method: req.method,
    path: req.path,
    message: err.message,
    stack: err.stack,
  });

  next(err);
};
