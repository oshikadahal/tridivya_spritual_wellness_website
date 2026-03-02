import mongoose from 'mongoose';
import { bookingRepository } from '../repositories/booking.repository';
import { CreateBookingDTO, UpdateBookingDTO, UpdateBookingStatusDTO, BookingResponseDTO } from '../dtos/booking.dto';
import { IBooking, BookingStatusEnum } from '../models/booking.model';
import { HttpError } from '../errors/http-error';
import {
  sendBookingCancelledEmail,
  sendBookingConfirmationEmail,
  sendBookingRescheduledEmail,
} from '../utils/email';

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
        async setTransactionUUID(bookingId: string, transaction_uuid: string): Promise<void> {
          await bookingRepository.updateById(bookingId, { transaction_uuid });
        }

        async markPaidByTransactionUUID(transaction_uuid: string): Promise<IBooking | null> {
          const booking = await bookingRepository.findByTransactionUUID(transaction_uuid);
          if (booking && booking.payment_status !== 'paid') {
            return await bookingRepository.updateById(booking.id, { payment_status: 'paid' });
          }
          return booking;
        }
      async getBookingByIdForAdmin(bookingId: string): Promise<IBooking | null> {
        return bookingRepository.findById(bookingId);
      }
    async markBookingPaid(bookingId: string): Promise<void> {
      const booking = await bookingRepository.findById(bookingId);
      if (!booking) {
        throw new HttpError(404, 'Booking not found');
      }
      if (booking.payment_status !== 'paid') {
        await bookingRepository.updateById(bookingId, { payment_status: 'paid' });
      }
    }
  async getAllBookings(status?: BookingStatusEnum): Promise<BookingResponseDTO[]> {
    const filters: any = {};
    if (status) {
      filters.status = status;
    }
    const bookings = await bookingRepository.findAll(filters);
    return bookings.map((booking) => new BookingResponseDTO(booking));
  }

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

    try {
      await sendBookingConfirmationEmail({
        to: booking.email,
        fullName: booking.full_name,
        bookingId: booking.id,
        sessionType: booking.session_type,
        sessionMode: booking.session_mode,
        bookingDate: booking.booking_date,
        timeSlot: booking.time_slot,
        instructor: booking.instructor,
        durationMinutes: booking.duration_minutes,
        paymentMethod: booking.payment_method,
        paymentStatus: booking.payment_status,
        amount: booking.amount,
        status: booking.status,
        phone: booking.phone,
        specialRequest: booking.special_request,
      });
    } catch (error) {
      console.error('Booking created but confirmation email failed:', error);
    }

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

    if (dto.status === 'cancelled' && booking.status !== 'cancelled') {
      try {
        await sendBookingCancelledEmail({
          to: updatedBooking.email,
          fullName: updatedBooking.full_name,
          bookingId: updatedBooking.id,
          sessionType: updatedBooking.session_type,
          bookingDate: updatedBooking.booking_date,
          timeSlot: updatedBooking.time_slot,
          sessionMode: updatedBooking.session_mode,
          instructor: updatedBooking.instructor,
          amount: updatedBooking.amount,
          paymentMethod: updatedBooking.payment_method,
          paymentStatus: updatedBooking.payment_status,
        });
      } catch (error) {
        console.error('Booking status changed to cancelled but cancellation email failed:', error);
      }
    }

    return new BookingResponseDTO(updatedBooking);
  }

  async updateBooking(
    userId: mongoose.Types.ObjectId,
    bookingId: string,
    dto: UpdateBookingDTO
  ): Promise<BookingResponseDTO> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    if (booking.user_id.toString() !== userId.toString()) {
      throw new HttpError(403, 'Access denied');
    }

    if (booking.status !== 'upcoming') {
      throw new HttpError(400, 'Only upcoming bookings can be edited');
    }

    const { booking_date, ...rest } = dto;
    const updateData: any = { ...rest };
    if (booking_date) {
      const bookingDate = new Date(booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        throw new HttpError(400, 'Booking date cannot be in the past');
      }
      updateData.booking_date = bookingDate;
    }

    const updatedBooking = await bookingRepository.updateById(bookingId, updateData);
    if (!updatedBooking) {
      throw new HttpError(500, 'Failed to update booking');
    }

    const hasScheduleChanged =
      booking.time_slot !== updatedBooking.time_slot ||
      new Date(booking.booking_date).getTime() !== new Date(updatedBooking.booking_date).getTime();

    if (hasScheduleChanged) {
      try {
        await sendBookingRescheduledEmail({
          to: updatedBooking.email,
          fullName: updatedBooking.full_name,
          bookingId: updatedBooking.id,
          sessionType: updatedBooking.session_type,
          sessionMode: updatedBooking.session_mode,
          previousBookingDate: booking.booking_date,
          previousTimeSlot: booking.time_slot,
          newBookingDate: updatedBooking.booking_date,
          newTimeSlot: updatedBooking.time_slot,
          instructor: updatedBooking.instructor,
          durationMinutes: updatedBooking.duration_minutes,
          paymentMethod: updatedBooking.payment_method,
          paymentStatus: updatedBooking.payment_status,
          amount: updatedBooking.amount,
        });
      } catch (error) {
        console.error('Booking updated but reschedule email failed:', error);
      }
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

    try {
      await sendBookingCancelledEmail({
        to: updatedBooking.email,
        fullName: updatedBooking.full_name,
        bookingId: updatedBooking.id,
        sessionType: updatedBooking.session_type,
        bookingDate: updatedBooking.booking_date,
        timeSlot: updatedBooking.time_slot,
        sessionMode: updatedBooking.session_mode,
        instructor: updatedBooking.instructor,
        amount: updatedBooking.amount,
        paymentMethod: updatedBooking.payment_method,
        paymentStatus: updatedBooking.payment_status,
      });
    } catch (error) {
      console.error('Booking cancelled but cancellation email failed:', error);
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

  async adminUpdateBookingStatus(bookingId: string, dto: UpdateBookingStatusDTO): Promise<BookingResponseDTO> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    const updatedBooking = await bookingRepository.updateStatus(bookingId, dto.status);

    if (!updatedBooking) {
      throw new HttpError(500, 'Failed to update booking');
    }

    if (dto.status === 'cancelled' && booking.status !== 'cancelled') {
      try {
        await sendBookingCancelledEmail({
          to: updatedBooking.email,
          fullName: updatedBooking.full_name,
          bookingId: updatedBooking.id,
          sessionType: updatedBooking.session_type,
          bookingDate: updatedBooking.booking_date,
          timeSlot: updatedBooking.time_slot,
          sessionMode: updatedBooking.session_mode,
          instructor: updatedBooking.instructor,
          amount: updatedBooking.amount,
          paymentMethod: updatedBooking.payment_method,
          paymentStatus: updatedBooking.payment_status,
        });
      } catch (error) {
        console.error('Admin changed booking to cancelled but cancellation email failed:', error);
      }
    }

    return new BookingResponseDTO(updatedBooking);
  }

  async adminCreateBooking(userId: mongoose.Types.ObjectId, dto: CreateBookingDTO): Promise<BookingResponseDTO> {
    const bookingDate = new Date(dto.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      throw new HttpError(400, 'Booking date cannot be in the past');
    }

    const existingBookingsCount = await bookingRepository.countByUserIdAndStatus(userId, 'upcoming');

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

    try {
      await sendBookingConfirmationEmail({
        to: booking.email,
        fullName: booking.full_name,
        bookingId: booking.id,
        sessionType: booking.session_type,
        sessionMode: booking.session_mode,
        bookingDate: booking.booking_date,
        timeSlot: booking.time_slot,
        instructor: booking.instructor,
        durationMinutes: booking.duration_minutes,
        paymentMethod: booking.payment_method,
        paymentStatus: booking.payment_status,
        amount: booking.amount,
        status: booking.status,
        phone: booking.phone,
        specialRequest: booking.special_request,
      });
    } catch (error) {
      console.error('Admin booking created but confirmation email failed:', error);
    }

    return new BookingResponseDTO(booking);
  }

  async adminUpdateBooking(bookingId: string, dto: UpdateBookingDTO): Promise<BookingResponseDTO> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    const { booking_date, ...rest } = dto;
    const updateData: any = { ...rest };

    if (booking_date) {
      const bookingDate = new Date(booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (bookingDate < today) {
        throw new HttpError(400, 'Booking date cannot be in the past');
      }

      updateData.booking_date = bookingDate;
    }

    const updatedBooking = await bookingRepository.updateById(bookingId, updateData);
    if (!updatedBooking) {
      throw new HttpError(500, 'Failed to update booking');
    }

    const hasScheduleChanged =
      booking.time_slot !== updatedBooking.time_slot ||
      new Date(booking.booking_date).getTime() !== new Date(updatedBooking.booking_date).getTime();

    if (hasScheduleChanged) {
      try {
        await sendBookingRescheduledEmail({
          to: updatedBooking.email,
          fullName: updatedBooking.full_name,
          bookingId: updatedBooking.id,
          sessionType: updatedBooking.session_type,
          sessionMode: updatedBooking.session_mode,
          previousBookingDate: booking.booking_date,
          previousTimeSlot: booking.time_slot,
          newBookingDate: updatedBooking.booking_date,
          newTimeSlot: updatedBooking.time_slot,
          instructor: updatedBooking.instructor,
          durationMinutes: updatedBooking.duration_minutes,
          paymentMethod: updatedBooking.payment_method,
          paymentStatus: updatedBooking.payment_status,
          amount: updatedBooking.amount,
        });
      } catch (error) {
        console.error('Admin updated booking but reschedule email failed:', error);
      }
    }

    return new BookingResponseDTO(updatedBooking);
  }

  async adminDeleteBooking(bookingId: string): Promise<void> {
    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }

    const deleted = await bookingRepository.deleteById(bookingId);
    if (!deleted) {
      throw new HttpError(500, 'Failed to delete booking');
    }
  }
}

export const bookingService = new BookingService();
