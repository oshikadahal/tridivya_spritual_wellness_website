import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { authorizedMiddleware } from '../middlewares/authorization.middleware';

const router = Router();

// All booking routes require authentication
router.use(authorizedMiddleware);

// Create a new booking
router.post('/', bookingController.createBooking.bind(bookingController));

// Get all bookings for the authenticated user
// Query params: ?status=upcoming|completed|cancelled&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
router.get('/', bookingController.getBookings.bind(bookingController));

// Get a specific booking by ID
router.get('/:id', bookingController.getBookingById.bind(bookingController));

// Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus.bind(bookingController));

// Update booking details
router.put('/:id', bookingController.updateBooking.bind(bookingController));

// Cancel a booking
router.post('/:id/cancel', bookingController.cancelBooking.bind(bookingController));

// Delete a booking
router.delete('/:id', bookingController.deleteBooking.bind(bookingController));

export default router;
