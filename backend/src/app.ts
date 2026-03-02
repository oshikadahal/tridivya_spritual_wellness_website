import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth.route';
import adminRoutes from './routes/admin.route';
import homeRoutes from './routes/home.route';
import meditationRoutes from './routes/meditation.route';
import yogaRoutes from './routes/yoga.route';
import mantraRoutes from './routes/mantra.route';
import libraryItemRoutes from './routes/library-item.route';
import meRoutes from './routes/me.route';
import announcementRoutes from './routes/announcement.route';
import dashboardRoutes from './routes/dashboard.route';
import searchRoutes from './routes/search.route';
import userSettingsRoutes from './routes/user-settings.route';
import bookingRoutes from './routes/booking.routes';

import esewaRoute from './routes/esewa.route';
import paymentRoute from './routes/payment.route';

import sessionRoutes from './routes/session.route';

const app = express();

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowedPatterns = [
      /^http:\/\/localhost(?::\d+)?$/i,
      /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(?::\d+)?$/i,
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?$/i,
      /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}(?::\d+)?$/i,
    ];

    const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
    callback(null, isAllowed);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Parse JSON and URL-encoded data FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1/home', homeRoutes);
app.use('/api/v1/meditations', meditationRoutes);
app.use('/api/v1/yogas', yogaRoutes);
app.use('/api/v1/mantras', mantraRoutes);
app.use('/api/v1/library-items', libraryItemRoutes);
app.use('/api/v1/me', meRoutes);
app.use('/api/admin/announcements', announcementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/me/settings', userSettingsRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/esewa', esewaRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/v1/sessions', sessionRoutes);

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Uploaded file is too large',
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || 'Invalid upload request',
    });
  }

  if (typeof err.message === 'string' && err.message.length > 0) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

export default app;
