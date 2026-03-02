import { Router, Request, Response, NextFunction } from 'express';
import { EsewaService } from '../utils/esewa';
import { bookingService } from '../services/booking.service';

const router = Router();

// eSewa success callback
router.get('/success', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amt, rid, pid, scd } = req.query;
    if (!amt || !rid || !pid || !scd) {
      return res.status(400).send('Missing parameters');
    }
    // Verify payment with eSewa
    const verified = await EsewaService.verifyPayment({
      amt: Number(amt),
      rid: String(rid),
      pid: String(pid),
      scd: String(scd),
    });
    if (verified) {
      // Mark booking as paid
      await bookingService.markBookingPaid(String(pid));
      // Send booking confirmation email after payment
      try {
        const booking = await bookingService.getBookingByIdForAdmin(String(pid));
        if (booking && booking.email) {
          const { sendBookingConfirmationEmail } = await import('../utils/email');
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
        }
      } catch (err) {
        console.error('Failed to send booking confirmation email after payment:', err);
      }
      // Redirect or show success
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking/success?pid=${pid}`);
    } else {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking/failure?pid=${pid}`);
    }
  } catch (error) {
    next(error);
  }
});

// eSewa failure callback
router.get('/failure', (req: Request, res: Response) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/booking/failure?pid=${req.query.pid}`);
});

export default router;
