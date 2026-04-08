import nodemailer from 'nodemailer';
import { getCurrentUserId } from './auth';
import { getUserById } from '@/controllers/userController';

// Create a reusable transporter using default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmailToCurrentUser(subject: string, html: string) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('User not logged in');
  }

  const user = await getUserById(userId);
  if (!user || !user.email) {
    throw new Error('User email not found');
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'Nuraacademy',
    to: user.email,
    subject: subject,
    html: html,
  });

  return info;
}

export { transporter };
