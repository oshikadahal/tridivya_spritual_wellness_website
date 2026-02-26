// Booking API functions

import axios from "./axios";
import { API } from "./endpoints";
import { getAuthHeaders } from "./content";

export type SessionTypeEnum = 
  | 'Yoga Practice'
  | 'Guided Meditation'
  | 'Breathwork Session'
  | 'Mantra Chanting'
  | 'Stress Relief Session'
  | 'Mindfulness Coaching'
  | 'Sleep & Relaxation'
  | 'Energy Balancing';

export type SessionModeEnum = 'private' | 'group';
export type BookingStatusEnum = 'upcoming' | 'completed' | 'cancelled';
export type PaymentMethodEnum = 'esewa' | 'khalti' | 'cash';

export interface CreateBookingData {
  session_type: SessionTypeEnum;
  session_mode: SessionModeEnum;
  booking_date: string; // ISO string YYYY-MM-DD
  time_slot: string;
  full_name: string;
  email: string;
  phone: string;
  special_request?: string;
  payment_method: PaymentMethodEnum;
  amount: number;
  duration_minutes?: number;
}

export interface UpdateBookingData {
  session_type?: SessionTypeEnum;
  session_mode?: SessionModeEnum;
  booking_date?: string;
  time_slot?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  special_request?: string;
  payment_method?: PaymentMethodEnum;
  amount?: number;
  duration_minutes?: number;
}

export interface BookingResponse {
  id: string;
  user_id: string;
  session_type: SessionTypeEnum;
  session_mode: SessionModeEnum;
  booking_date: string;
  time_slot: string;
  full_name: string;
  email: string;
  phone: string;
  special_request?: string;
  payment_method: PaymentMethodEnum;
  payment_status: string;
  amount: number;
  status: BookingStatusEnum;
  instructor?: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface BookingsListParams {
  status?: BookingStatusEnum;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
}

// Create a new booking
export const createBooking = async (data: CreateBookingData): Promise<BookingResponse> => {
  try {
    const response = await axios.post(
      API.BOOKINGS.CREATE,
      data,
      { headers: { ...getAuthHeaders() } }
    );
    return response.data.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to create booking"
    );
  }
};

// Get all bookings for the authenticated user
export const getBookings = async (params?: BookingsListParams): Promise<BookingResponse[]> => {
  try {
    const response = await axios.get(API.BOOKINGS.LIST, {
      headers: { ...getAuthHeaders() },
      params,
    });
    return response.data.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch bookings"
    );
  }
};

// Get a specific booking by ID
export const getBookingById = async (id: string): Promise<BookingResponse> => {
  try {
    const response = await axios.get(API.BOOKINGS.BY_ID(id), {
      headers: { ...getAuthHeaders() },
    });
    return response.data.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch booking"
    );
  }
};

// Update booking status
export const updateBookingStatus = async (
  id: string,
  status: BookingStatusEnum
): Promise<BookingResponse> => {
  try {
    const response = await axios.patch(
      API.BOOKINGS.UPDATE_STATUS(id),
      { status },
      { headers: { ...getAuthHeaders() } }
    );
    return response.data.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to update booking status"
    );
  }
};

export const updateBooking = async (
  id: string,
  data: UpdateBookingData
): Promise<BookingResponse> => {
  try {
    const response = await axios.put(
      API.BOOKINGS.UPDATE(id),
      data,
      { headers: { ...getAuthHeaders() } }
    );
    return response.data.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to update booking"
    );
  }
};

// Cancel a booking
export const cancelBooking = async (id: string): Promise<BookingResponse> => {
  try {
    const response = await axios.post(
      API.BOOKINGS.CANCEL(id),
      {},
      { headers: { ...getAuthHeaders() } }
    );
    return response.data.data;
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to cancel booking"
    );
  }
};

// Delete a booking
export const deleteBooking = async (id: string): Promise<void> => {
  try {
    await axios.delete(API.BOOKINGS.DELETE(id), {
      headers: { ...getAuthHeaders() },
    });
  } catch (err: Error | any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to delete booking"
    );
  }
};
