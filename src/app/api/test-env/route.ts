import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasWhatsAppVerifyToken: !!process.env.WHATSAPP_VERIFY_TOKEN,
    tokenLength: process.env.WHATSAPP_VERIFY_TOKEN?.length || 0,
    allEnvKeys: Object.keys(process.env).filter((k) => k.includes('WHATSAPP')),
  });
}
