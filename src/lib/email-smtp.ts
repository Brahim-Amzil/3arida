// Simple SMTP email sending using Hostinger
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  // Create transporter using Hostinger SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // use SSL
    auth: {
      user: process.env.SMTP_USER, // your email: contact@3arida.ma
      pass: process.env.SMTP_PASSWORD, // your email password
    },
  });

  // Send email
  const info = await transporter.sendMail({
    from: `"3arida Platform" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    replyTo,
  });

  return info;
}
