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
