import mongoose from 'mongoose';
import { bookingRepository } from '../repositories/booking.repository';
import { CreateBookingDTO, UpdateBookingStatusDTO, BookingResponseDTO } from '../dtos/booking.dto';
import { IBooking, BookingStatusEnum } from '../models/booking.model';
import { HttpError } from '../errors/http-error';

// Instructor assignment logic (simple round-robin for demo)
const instructors = [
  'Dr. Sarah Mitchell',
  'Master Kenji',
  'Ravi Sharma',
  'Maya Karki',
  'Priya Gurung',
  'Ananda Shrestha',
];

function assignInstructor(index: number): string {
  return instructors[index % instructors.length];
}

export class BookingService {
  async createBooking(userId: mongoose.Types.ObjectId, dto: CreateBookingDTO): Promise<BookingResponseDTO> {
    // Validate that the booking date is not in the past
    const bookingDate = new Date(dto.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      throw new HttpError(400, 'Booking date cannot be in the past');
    }

    // Count existing bookings to assign instructor
    const existingBookingsCount = await bookingRepository.countByUserIdAndStatus(
      userId,
      'upcoming'
    );

    const bookingData: Partial<IBooking> = {
      user_id: userId,
      session_type: dto.session_type,
      session_mode: dto.session_mode,
      booking_date: bookingDate,
      time_slot: dto.time_slot,
      full_name: dto.full_name,
      email: dto.email,
      phone: dto.phone,
      special_request: dto.special_request,
      payment_method: dto.payment_method,
      payment_status: 'pending',
      amount: dto.amount,
      status: 'upcoming',
      instructor: assignInstructor(existingBookingsCount),
      duration_minutes: dto.duration_minutes || 60,
    };

    const booking = await bookingRepository.create(bookingData);
    return new BookingResponseDTO(booking);
  }

  async getBookingById(userId: mongoose.Types.ObjectId, bookingId: string): Promise<BookingResponseDTO> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Ensure user can only access their own bookings
    if (booking.user_id.toString() !== userId.toString()) {
      throw new HttpError(403, 'Access denied');
    }

    return new BookingResponseDTO(booking);
  }

  async getUserBookings(userId: mongoose.Types.ObjectId, status?: BookingStatusEnum): Promise<BookingResponseDTO[]> {
    const bookings = await bookingRepository.findByUserId(userId, status);
    return bookings.map((booking) => new BookingResponseDTO(booking));
  }

  async getUserBookingsByDateRange(
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    status?: BookingStatusEnum
  ): Promise<BookingResponseDTO[]> {
    const bookings = await bookingRepository.findByUserIdAndDateRange(
      userId,
      startDate,
      endDate,
      status
    );
    return bookings.map((booking) => new BookingResponseDTO(booking));
  }

  async updateBookingStatus(
    userId: mongoose.Types.ObjectId,
    bookingId: string,
    dto: UpdateBookingStatusDTO
  ): Promise<BookingResponseDTO> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Ensure user can only update their own bookings
    if (booking.user_id.toString() !== userId.toString()) {
      throw new HttpError(403, 'Access denied');
    }

    // Prevent certain status transitions
    if (booking.status === 'completed' && dto.status !== 'completed') {
      throw new HttpError(400, 'Cannot change status of completed booking');
    }

    const updatedBooking = await bookingRepository.updateStatus(bookingId, dto.status);

    if (!updatedBooking) {
      throw new HttpError(500, 'Failed to update booking');
    }

    return new BookingResponseDTO(updatedBooking);
  }

  async cancelBooking(userId: mongoose.Types.ObjectId, bookingId: string): Promise<BookingResponseDTO> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Ensure user can only cancel their own bookings
    if (booking.user_id.toString() !== userId.toString()) {
      throw new HttpError(403, 'Access denied');
    }

    if (booking.status === 'completed') {
      throw new HttpError(400, 'Cannot cancel completed booking');
    }

    if (booking.status === 'cancelled') {
      throw new HttpError(400, 'Booking already cancelled');
    }

    const updatedBooking = await bookingRepository.updateStatus(bookingId, 'cancelled');

    if (!updatedBooking) {
      throw new HttpError(500, 'Failed to cancel booking');
    }

    return new BookingResponseDTO(updatedBooking);
  }

  async deleteBooking(userId: mongoose.Types.ObjectId, bookingId: string): Promise<void> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    // Ensure user can only delete their own bookings
    if (booking.user_id.toString() !== userId.toString()) {
      throw new HttpError(403, 'Access denied');
    }

    const deleted = await bookingRepository.deleteById(bookingId);

    if (!deleted) {
      throw new HttpError(500, 'Failed to delete booking');
    }
  }
}

export const bookingService = new BookingService();
