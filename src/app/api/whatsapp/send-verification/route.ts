import { NextRequest, NextResponse } from 'next/server';

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map<
  string,
  { code: string; expiresAt: number }
>();

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with 10-minute expiration
    verificationCodes.set(phoneNumber, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    console.log(`📱 Generated code ${code} for ${phoneNumber}`);

    // Send via WhatsApp Business API
    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber.replace('+', ''),
          type: 'template',
          template: {
            name: 'verification_code',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: code }],
              },
            ],
          },
        }),
      }
    );

    if (!whatsappResponse.ok) {
      const error = await whatsappResponse.json();
      console.error('WhatsApp API error:', error);

      // Fallback: send as text message if template fails
      const fallbackResponse = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phoneNumber.replace('+', ''),
            type: 'text',
            text: {
              body: `Your 3arida verification code is: ${code}\n\nThis code expires in 10 minutes.`,
            },
          }),
        }
      );

      if (!fallbackResponse.ok) {
        throw new Error('Failed to send WhatsApp message');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent via WhatsApp',
    });
  } catch (error: any) {
    console.error('Error sending WhatsApp verification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
