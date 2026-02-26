import { z } from 'zod';

export const SessionTypeSchema = z.enum([
  'Yoga Practice',
  'Guided Meditation',
  'Breathwork Session',
  'Mantra Chanting',
  'Stress Relief Session',
  'Mindfulness Coaching',
  'Sleep & Relaxation',
  'Energy Balancing',
]);

export const SessionModeSchema = z.enum(['private', 'group']);
export const PaymentMethodSchema = z.enum(['esewa', 'khalti', 'cash']);
export const BookingStatusSchema = z.enum(['upcoming', 'completed', 'cancelled']);

export const CreateBookingSchema = z.object({
  session_type: SessionTypeSchema,
  session_mode: SessionModeSchema,
  booking_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  time_slot: z.string().min(1, 'Time slot is required'),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  special_request: z.string().optional(),
  payment_method: PaymentMethodSchema,
  amount: z.number().min(0, 'Amount must be positive'),
  duration_minutes: z.number().min(30, 'Duration must be at least 30 minutes').optional(),
});

export const UpdateBookingStatusSchema = z.object({
  status: BookingStatusSchema,
});

export const UpdateBookingSchema = z.object({
  session_type: SessionTypeSchema.optional(),
  session_mode: SessionModeSchema.optional(),
  booking_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }).optional(),
  time_slot: z.string().min(1, 'Time slot is required').optional(),
  full_name: z.string().min(1, 'Full name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(1, 'Phone number is required').optional(),
  special_request: z.string().optional(),
  payment_method: PaymentMethodSchema.optional(),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  duration_minutes: z.number().min(30, 'Duration must be at least 30 minutes').optional(),
});

export type SessionTypeEnum = z.infer<typeof SessionTypeSchema>;
export type SessionModeEnum = z.infer<typeof SessionModeSchema>;
export type PaymentMethodEnum = z.infer<typeof PaymentMethodSchema>;
export type BookingStatusEnum = z.infer<typeof BookingStatusSchema>;
export type CreateBookingDTO = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusDTO = z.infer<typeof UpdateBookingStatusSchema>;
export type UpdateBookingDTO = z.infer<typeof UpdateBookingSchema>;

export class BookingResponseDTO {
  id!: string;
  user_id!: string;
  session_type!: SessionTypeEnum;
  session_mode!: SessionModeEnum;
  booking_date!: string;
  time_slot!: string;
  full_name!: string;
  email!: string;
  phone!: string;
  special_request?: string;
  payment_method!: PaymentMethodEnum;
  payment_status!: string;
  amount!: number;
  status!: BookingStatusEnum;
  instructor?: string;
  duration_minutes!: number;
  created_at!: string;
  updated_at!: string;

  constructor(booking: any) {
    this.id = booking.id;
    this.user_id = booking.user_id?.toString() || booking.user_id;
    this.session_type = booking.session_type;
    this.session_mode = booking.session_mode;
    this.booking_date = booking.booking_date;
    this.time_slot = booking.time_slot;
    this.full_name = booking.full_name;
    this.email = booking.email;
    this.phone = booking.phone;
    this.special_request = booking.special_request;
    this.payment_method = booking.payment_method;
    this.payment_status = booking.payment_status;
    this.amount = booking.amount;
    this.status = booking.status;
    this.instructor = booking.instructor;
    this.duration_minutes = booking.duration_minutes;
    this.created_at = booking.created_at;
    this.updated_at = booking.updated_at;
  }
}
