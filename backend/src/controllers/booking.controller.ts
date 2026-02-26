import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { CreateBookingSchema, UpdateBookingSchema, UpdateBookingStatusSchema } from '../dtos/booking.dto';
import { HttpError } from '../errors/http-error';
import mongoose from 'mongoose';

export class BookingController {
  async getAllBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.query;
      const bookings = await bookingService.getAllBookings(status as any);

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const validationResult = CreateBookingSchema.safeParse(req.body);

      if (!validationResult.success) {
        const messages = validationResult.error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new HttpError(400, `Validation failed: ${messages}`);
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const booking = await bookingService.createBooking(userObjectId, validationResult.data);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const { status, start_date, end_date } = req.query;
      const userObjectId = new mongoose.Types.ObjectId(userId);

      let bookings;

      if (start_date && end_date) {
        const startDate = new Date(start_date as string);
        const endDate = new Date(end_date as string);
        bookings = await bookingService.getUserBookingsByDateRange(
          userObjectId,
          startDate,
          endDate,
          status as any
        );
      } else {
        bookings = await bookingService.getUserBookings(userObjectId, status as any);
      }

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const booking = await bookingService.getBookingById(userObjectId, id);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const validationResult = UpdateBookingStatusSchema.safeParse(req.body);

      if (!validationResult.success) {
        const messages = validationResult.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new HttpError(400, `Validation failed: ${messages}`);
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const booking = await bookingService.updateBookingStatus(userObjectId, id, validationResult.data);

      res.status(200).json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const validationResult = UpdateBookingSchema.safeParse(req.body);
      if (!validationResult.success) {
        const messages = validationResult.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new HttpError(400, `Validation failed: ${messages}`);
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const booking = await bookingService.updateBooking(userObjectId, id, validationResult.data);

      res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const booking = await bookingService.cancelBooking(userObjectId, id);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      await bookingService.deleteBooking(userObjectId, id);

      res.status(200).json({
        success: true,
        message: 'Booking deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async adminUpdateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validationResult = UpdateBookingStatusSchema.safeParse(req.body);

      if (!validationResult.success) {
        const messages = validationResult.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new HttpError(400, `Validation failed: ${messages}`);
      }

      const booking = await bookingService.adminUpdateBookingStatus(id, validationResult.data);

      res.status(200).json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminCreateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminUserId = (req as any).user?.id;
      const requestUserId = req.body?.user_id;
      const userId = requestUserId || adminUserId;

      if (!userId) {
        throw new HttpError(400, 'User id is required');
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new HttpError(400, 'Invalid user id');
      }

      const validationResult = CreateBookingSchema.safeParse(req.body);

      if (!validationResult.success) {
        const messages = validationResult.error.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new HttpError(400, `Validation failed: ${messages}`);
      }

      const booking = await bookingService.adminCreateBooking(
        new mongoose.Types.ObjectId(userId),
        validationResult.data
      );

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminUpdateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const validationResult = UpdateBookingSchema.safeParse(req.body);
      if (!validationResult.success) {
        const messages = validationResult.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
        throw new HttpError(400, `Validation failed: ${messages}`);
      }

      const booking = await bookingService.adminUpdateBooking(id, validationResult.data);

      res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async adminDeleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await bookingService.adminDeleteBooking(id);

      res.status(200).json({
        success: true,
        message: 'Booking deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
