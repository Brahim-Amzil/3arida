import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    smtpConfigured: {
      host: !!process.env.SMTP_HOST,
      port: !!process.env.SMTP_PORT,
      user: !!process.env.SMTP_USER,
      password: !!process.env.SMTP_PASSWORD,
    },
    hostValue: process.env.SMTP_HOST || 'not set',
    portValue: process.env.SMTP_PORT || 'not set',
  });
}
