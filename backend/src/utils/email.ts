import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER, SMTP_FROM } from '../config';

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('SMTP not configured. Reset link:', resetLink);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject: 'Reset your Tridivya Wellness password',
    text: `Reset your password using the link below:\n\n${resetLink}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;">
        <h2>Reset your password</h2>
        <p>Click the button below to reset your password.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Reset Password</a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
