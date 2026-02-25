import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

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
export type PaymentStatusEnum = 'pending' | 'paid' | 'refunded';

export interface IBooking extends Document {
  id: string;
  user_id: mongoose.Types.ObjectId;
  session_type: SessionTypeEnum;
  session_mode: SessionModeEnum;
  booking_date: Date;
  time_slot: string;
  full_name: string;
  email: string;
  phone: string;
  special_request?: string;
  payment_method: PaymentMethodEnum;
  payment_status: PaymentStatusEnum;
  amount: number;
  status: BookingStatusEnum;
  instructor?: string;
  duration_minutes: number;
  created_at: Date;
  updated_at: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    id: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    session_type: {
      type: String,
      enum: [
        'Yoga Practice',
        'Guided Meditation',
        'Breathwork Session',
        'Mantra Chanting',
        'Stress Relief Session',
        'Mindfulness Coaching',
        'Sleep & Relaxation',
        'Energy Balancing',
      ],
      required: true,
    },
    session_mode: { type: String, enum: ['private', 'group'], required: true },
    booking_date: { type: Date, required: true, index: true },
    time_slot: { type: String, required: true },
    full_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    special_request: { type: String, trim: true },
    payment_method: { type: String, enum: ['esewa', 'khalti', 'cash'], required: true },
    payment_status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming', index: true },
    instructor: { type: String, trim: true },
    duration_minutes: { type: Number, default: 60, min: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'bookings',
  }
);

// Indexes for efficient queries
BookingSchema.index({ user_id: 1, status: 1 });
BookingSchema.index({ user_id: 1, booking_date: 1 });
BookingSchema.index({ booking_date: 1, status: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
