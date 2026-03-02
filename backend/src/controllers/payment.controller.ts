import crypto from 'crypto';
import { Request, Response } from 'express';
import axios from 'axios';
import { bookingService } from '../services/booking.service';
import { sendBookingConfirmationEmail } from '../utils/email';

const ESEWA_V2_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const ESEWA_VERIFY_URL = 'https://rc.esewa.com.np/api/epay/transaction/status/';
const MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
const SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const SUCCESS_URL = process.env.ESEWA_SUCCESS_URL || 'http://localhost:3000/esewa/success';
const FAILURE_URL = process.env.ESEWA_FAILURE_URL || 'http://localhost:3000/esewa/failure';

export const initiateEsewaV2Payment = async (req: Request, res: Response) => {
  try {
    const { amount, bookingId } = req.body;
    if (!amount || !bookingId) {
      return res.status(400).json({ message: 'Amount and bookingId are required.' });
    }
    const total_amount = String(amount);
    const transaction_uuid = `booking-${bookingId}-${Date.now()}`;
    // Save transaction_uuid to booking for later lookup
    await bookingService.setTransactionUUID(bookingId, transaction_uuid);
    const product_code = MERCHANT_CODE;
    const tax_amount = '0';
    const product_service_charge = '0';
    const product_delivery_charge = '0';
    const signedFields = ['total_amount', 'transaction_uuid', 'product_code'];
    const message = signedFields.map(f => `${f}=${eval(f)}`).join(',');
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(message).digest('base64');
    const signed_field_names = signedFields.join(',');
    const formData = {
      amount: total_amount,
      tax_amount,
      total_amount,
      transaction_uuid,
      product_code,
      product_service_charge,
      product_delivery_charge,
      success_url: SUCCESS_URL,
      failure_url: FAILURE_URL,
      signed_field_names,
      signature,
    };
    return res.json({ esewaUrl: ESEWA_V2_URL, formData });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to initiate payment', error });
  }
};

export const esewaV2Success = async (req: Request, res: Response) => {
  try {
    let product_code, total_amount, transaction_uuid;
    if (req.query.data) {
      try {
        const decoded = JSON.parse(Buffer.from(req.query.data as string, 'base64').toString());
        product_code = decoded.product_code || MERCHANT_CODE;
        total_amount = decoded.total_amount;
        transaction_uuid = decoded.transaction_uuid;
      } catch (err) {
        return res.status(400).json({ message: 'Invalid data parameter.' });
      }
    } else {
      product_code = req.query.product_code || MERCHANT_CODE;
      total_amount = req.query.total_amount;
      transaction_uuid = req.query.transaction_uuid;
    }
    if (!product_code || !total_amount || !transaction_uuid) {
      return res.status(400).json({ message: 'Missing required query parameters.' });
    }
    // Call eSewa v2 status API
    const verifyUrl = ESEWA_VERIFY_URL;
    const response = await axios.get(verifyUrl, {
      params: {
        product_code,
        total_amount,
        transaction_uuid,
      },
    });
    if (response.data.status === 'COMPLETE') {
      // Update booking/payment status
      const booking = await bookingService.markPaidByTransactionUUID(transaction_uuid);
      if (booking) {
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
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/esewa/success?pid=${booking.id}`);
      } else {
        return res.status(200).json({ status: 'PAID', message: 'Payment verified, but booking not found for update.' });
      }
    } else {
      return res.status(400).json({ status: 'FAILED', message: 'Payment not complete or failed.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying payment', error });
  }
};

export const esewaV2Failure = (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Payment failed or cancelled.' });
};
