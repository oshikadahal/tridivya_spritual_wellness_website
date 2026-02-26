import mongoose from 'mongoose';
import { Booking, IBooking, BookingStatusEnum } from '../models/booking.model';

export class BookingRepository {
  async create(bookingData: Partial<IBooking>): Promise<IBooking> {
    const booking = new Booking(bookingData);
    return await booking.save();
  }

  async findById(id: string): Promise<IBooking | null> {
    return await Booking.findOne({ id }).exec();
  }

  async findByUserId(userId: mongoose.Types.ObjectId, status?: BookingStatusEnum): Promise<IBooking[]> {
    const query: any = { user_id: userId };
    if (status) {
      query.status = status;
    }
    return await Booking.find(query).sort({ booking_date: 1 }).exec();
  }

  async findByUserIdAndDateRange(
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    status?: BookingStatusEnum
  ): Promise<IBooking[]> {
    const query: any = {
      user_id: userId,
      booking_date: { $gte: startDate, $lte: endDate },
    };
    if (status) {
      query.status = status;
    }
    return await Booking.find(query).sort({ booking_date: 1 }).exec();
  }

  async updateStatus(id: string, status: BookingStatusEnum): Promise<IBooking | null> {
    return await Booking.findOneAndUpdate(
      { id },
      { status, updated_at: new Date() },
      { new: true }
    ).exec();
  }

  async updateById(id: string, data: Partial<IBooking>): Promise<IBooking | null> {
    return await Booking.findOneAndUpdate(
      { id },
      { ...data, updated_at: new Date() },
      { new: true }
    ).exec();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await Booking.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  async findAll(filters?: any): Promise<IBooking[]> {
    return await Booking.find(filters || {}).sort({ booking_date: -1 }).exec();
  }

  async countByUserIdAndStatus(userId: mongoose.Types.ObjectId, status: BookingStatusEnum): Promise<number> {
    return await Booking.countDocuments({ user_id: userId, status }).exec();
  }
}

export const bookingRepository = new BookingRepository();
