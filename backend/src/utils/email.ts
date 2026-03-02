import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER, SMTP_FROM } from '../config';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP not fully configured. Using mock transporter.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log(`[MOCK EMAIL] Password reset email to ${to}`);
    console.log(`Reset link: ${resetLink}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: 'Reset your Tridivya Wellness password',
      text: `Reset your password using the link below:\n\n${resetLink}\n\nIf you did not request this, you can ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;">
          <h2 style="color:#6c4ab6;">Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your Tridivya Wellness account. Click the button below to create a new password.</p>
          <p style="margin-bottom:24px;">
            <a href="${resetLink}" style="display:inline-block;background:#6c4ab6;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
          </p>
          <p style="color:#666;font-size:14px;">If you did not request this password reset, you can safely ignore this email. Your password will not be changed unless you click the button above.</p>
          <p style="color:#999;font-size:12px;margin-top:32px;">This link will expire in 1 hour.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Tridivya Wellness Team</p>
        </div>
      `,
    });
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log(`[MOCK EMAIL] Welcome email to ${to} for ${name}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: 'Welcome to Tridivya Wellness!',
      text: `Welcome to Tridivya Wellness, ${name}!\n\nYour account has been created successfully. Start exploring our guided meditations, yoga classes, and mantras today.`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;">
          <h2 style="color:#6c4ab6;">Welcome to Tridivya Wellness, ${name}!</h2>
          <p>Your account has been created successfully.</p>
          <p>Start your journey towards inner peace with our comprehensive library of:</p>
          <ul>
            <li>Guided Meditations</li>
            <li>Yoga Classes</li>
            <li>Ancient Mantras</li>
            <li>Wisdom Library</li>
          </ul>
          <p style="margin-bottom:24px;">
            <a href="http://localhost:3000/dashboard" style="display:inline-block;background:#6c4ab6;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Get Started</a>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Tridivya Wellness Team</p>
        </div>
      `,
    });
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendAnnouncementEmail(to: string, title: string, message: string) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log(`[MOCK EMAIL] Announcement email to ${to}: ${title}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: `📢 ${title}`,
      text: `${title}\n\n${message}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:0 auto;">
          <h2 style="color:#6c4ab6;">📢 ${title}</h2>
          <p>${message}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Tridivya Wellness Team</p>
        </div>
      `,
    });
    console.log(`Announcement email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send announcement email:', error);
    throw error;
  }
}

export async function sendBookingConfirmationEmail(payload: {
  to: string;
  fullName: string;
  bookingId: string;
  sessionType: string;
  sessionMode: string;
  bookingDate: Date | string;
  timeSlot: string;
  instructor?: string;
  durationMinutes: number;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
  status: string;
  phone: string;
  specialRequest?: string;
}) {
  const transporter = getTransporter();
  const bookingDate = new Date(payload.bookingDate);
  const formattedDate = Number.isNaN(bookingDate.getTime())
    ? String(payload.bookingDate)
    : bookingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  if (!transporter) {
    console.log(`[MOCK EMAIL] Booking confirmation email to ${payload.to}`);
    console.log(`Booking #${payload.bookingId} | ${payload.sessionType} on ${formattedDate} at ${payload.timeSlot}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: payload.to,
      subject: `✅ Booking Confirmed: ${payload.sessionType} (${payload.bookingId})`,
      text: `Hello ${payload.fullName},

Your booking has been confirmed.

Booking ID: ${payload.bookingId}
Session: ${payload.sessionType}
Mode: ${payload.sessionMode}
Date: ${formattedDate}
Time Slot: ${payload.timeSlot}
Instructor: ${payload.instructor || 'Assigned soon'}
Duration: ${payload.durationMinutes} minutes
Status: ${payload.status}

Payment Method: ${payload.paymentMethod}
Payment Status: ${payload.paymentStatus}
Amount: ${payload.amount}

Contact Number: ${payload.phone}
Special Request: ${payload.specialRequest || 'N/A'}

Thank you for booking with Tridivya Wellness.
`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:620px;margin:0 auto;">
          <h2 style="color:#6c4ab6;">✅ Your Booking is Confirmed</h2>
          <p>Hello ${payload.fullName},</p>
          <p>Thank you for your booking. Here are your complete session details:</p>

          <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #eee;margin:16px 0;">
            <tr><td style="font-weight:bold;border:1px solid #eee;">Booking ID</td><td style="border:1px solid #eee;">${payload.bookingId}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Session</td><td style="border:1px solid #eee;">${payload.sessionType}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Mode</td><td style="border:1px solid #eee;">${payload.sessionMode}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Date</td><td style="border:1px solid #eee;">${formattedDate}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Time Slot</td><td style="border:1px solid #eee;">${payload.timeSlot}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Instructor</td><td style="border:1px solid #eee;">${payload.instructor || 'Assigned soon'}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Duration</td><td style="border:1px solid #eee;">${payload.durationMinutes} minutes</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Status</td><td style="border:1px solid #eee;">${payload.status}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Payment Method</td><td style="border:1px solid #eee;">${payload.paymentMethod}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Payment Status</td><td style="border:1px solid #eee;">${payload.paymentStatus}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Amount</td><td style="border:1px solid #eee;">${payload.amount}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Phone</td><td style="border:1px solid #eee;">${payload.phone}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Special Request</td><td style="border:1px solid #eee;">${payload.specialRequest || 'N/A'}</td></tr>
          </table>

          <p>We look forward to supporting your wellness journey.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Tridivya Wellness Team</p>
        </div>
      `,
    });
    console.log(`Booking confirmation email sent to ${payload.to}`);
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
}

export async function sendBookingCancelledEmail(payload: {
  to: string;
  fullName: string;
  bookingId: string;
  sessionType: string;
  bookingDate: Date | string;
  timeSlot: string;
  sessionMode: string;
  instructor?: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
}) {
  const transporter = getTransporter();
  const bookingDate = new Date(payload.bookingDate);
  const formattedDate = Number.isNaN(bookingDate.getTime())
    ? String(payload.bookingDate)
    : bookingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  if (!transporter) {
    console.log(`[MOCK EMAIL] Booking cancellation email to ${payload.to}`);
    console.log(`Booking #${payload.bookingId} cancelled`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: payload.to,
      subject: `❌ Booking Cancelled: ${payload.sessionType} (${payload.bookingId})`,
      text: `Hello ${payload.fullName},

Your booking has been cancelled.

Booking ID: ${payload.bookingId}
Session: ${payload.sessionType}
Mode: ${payload.sessionMode}
Date: ${formattedDate}
Time Slot: ${payload.timeSlot}
Instructor: ${payload.instructor || 'Assigned soon'}

Payment Method: ${payload.paymentMethod}
Payment Status: ${payload.paymentStatus}
Amount: ${payload.amount}

If this cancellation was not made by you, please contact support.
`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:620px;margin:0 auto;">
          <h2 style="color:#b42318;">❌ Your Booking Has Been Cancelled</h2>
          <p>Hello ${payload.fullName},</p>
          <p>Your booking has been cancelled. Details are shown below:</p>
          <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #eee;margin:16px 0;">
            <tr><td style="font-weight:bold;border:1px solid #eee;">Booking ID</td><td style="border:1px solid #eee;">${payload.bookingId}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Session</td><td style="border:1px solid #eee;">${payload.sessionType}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Mode</td><td style="border:1px solid #eee;">${payload.sessionMode}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Date</td><td style="border:1px solid #eee;">${formattedDate}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Time Slot</td><td style="border:1px solid #eee;">${payload.timeSlot}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Instructor</td><td style="border:1px solid #eee;">${payload.instructor || 'Assigned soon'}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Payment Method</td><td style="border:1px solid #eee;">${payload.paymentMethod}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Payment Status</td><td style="border:1px solid #eee;">${payload.paymentStatus}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Amount</td><td style="border:1px solid #eee;">${payload.amount}</td></tr>
          </table>
          <p>If this cancellation was not made by you, please contact support immediately.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Tridivya Wellness Team</p>
        </div>
      `,
    });
    console.log(`Booking cancellation email sent to ${payload.to}`);
  } catch (error) {
    console.error('Failed to send booking cancellation email:', error);
    throw error;
  }
}

export async function sendBookingRescheduledEmail(payload: {
  to: string;
  fullName: string;
  bookingId: string;
  sessionType: string;
  sessionMode: string;
  previousBookingDate: Date | string;
  previousTimeSlot: string;
  newBookingDate: Date | string;
  newTimeSlot: string;
  instructor?: string;
  durationMinutes: number;
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
}) {
  const transporter = getTransporter();

  const prevDate = new Date(payload.previousBookingDate);
  const newDate = new Date(payload.newBookingDate);

  const formattedPrevDate = Number.isNaN(prevDate.getTime())
    ? String(payload.previousBookingDate)
    : prevDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const formattedNewDate = Number.isNaN(newDate.getTime())
    ? String(payload.newBookingDate)
    : newDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  if (!transporter) {
    console.log(`[MOCK EMAIL] Booking reschedule email to ${payload.to}`);
    console.log(`Booking #${payload.bookingId} moved to ${formattedNewDate} at ${payload.newTimeSlot}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: payload.to,
      subject: `🔁 Booking Rescheduled: ${payload.sessionType} (${payload.bookingId})`,
      text: `Hello ${payload.fullName},

Your booking schedule has been updated.

Booking ID: ${payload.bookingId}
Session: ${payload.sessionType}
Mode: ${payload.sessionMode}

Previous Date & Time: ${formattedPrevDate} at ${payload.previousTimeSlot}
New Date & Time: ${formattedNewDate} at ${payload.newTimeSlot}

Instructor: ${payload.instructor || 'Assigned soon'}
Duration: ${payload.durationMinutes} minutes
Payment Method: ${payload.paymentMethod}
Payment Status: ${payload.paymentStatus}
Amount: ${payload.amount}

Thank you for staying with Tridivya Wellness.
`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:620px;margin:0 auto;">
          <h2 style="color:#6c4ab6;">🔁 Your Booking Has Been Rescheduled</h2>
          <p>Hello ${payload.fullName},</p>
          <p>Your booking schedule has been updated. Please review the full details below:</p>
          <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #eee;margin:16px 0;">
            <tr><td style="font-weight:bold;border:1px solid #eee;">Booking ID</td><td style="border:1px solid #eee;">${payload.bookingId}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Session</td><td style="border:1px solid #eee;">${payload.sessionType}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Mode</td><td style="border:1px solid #eee;">${payload.sessionMode}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Previous Date</td><td style="border:1px solid #eee;">${formattedPrevDate}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Previous Time</td><td style="border:1px solid #eee;">${payload.previousTimeSlot}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">New Date</td><td style="border:1px solid #eee;">${formattedNewDate}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">New Time</td><td style="border:1px solid #eee;">${payload.newTimeSlot}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Instructor</td><td style="border:1px solid #eee;">${payload.instructor || 'Assigned soon'}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Duration</td><td style="border:1px solid #eee;">${payload.durationMinutes} minutes</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Payment Method</td><td style="border:1px solid #eee;">${payload.paymentMethod}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Payment Status</td><td style="border:1px solid #eee;">${payload.paymentStatus}</td></tr>
            <tr><td style="font-weight:bold;border:1px solid #eee;">Amount</td><td style="border:1px solid #eee;">${payload.amount}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#999;font-size:12px;">Tridivya Wellness Team</p>
        </div>
      `,
    });
    console.log(`Booking reschedule email sent to ${payload.to}`);
  } catch (error) {
    console.error('Failed to send booking reschedule email:', error);
    throw error;
  }
}
