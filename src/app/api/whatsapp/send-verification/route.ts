import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaServerToken } from '@/lib/server-recaptcha';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  withRequestId,
} from '@/lib/api-observability';

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map<
  string,
  { code: string; expiresAt: number }
>();

export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(
    request,
    'api/whatsapp/send-verification',
  );

  try {
    const { phoneNumber, recaptchaToken } = await request.json();

    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      return withRequestId(
        NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
        ),
        apiContext.requestId,
      );
    }

    const recaptchaResult = await verifyRecaptchaServerToken(recaptchaToken, {
      minScore: 0.5,
      expectedAction: 'whatsapp_send_verification',
    });

    if (!recaptchaResult.success) {
      return withRequestId(
        NextResponse.json(
        { error: 'Security verification failed' },
        { status: 400 },
        ),
        apiContext.requestId,
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with 10-minute expiration
    verificationCodes.set(phoneNumber, {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    logApiInfo(apiContext, 'Generated WhatsApp verification code', {
      phoneNumber,
    });

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
      logApiError(apiContext, 'WhatsApp API template send failed', error);

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

    return withRequestId(
      NextResponse.json({
        success: true,
        message: 'Verification code sent via WhatsApp',
      }),
      apiContext.requestId,
    );
  } catch (error: any) {
    logApiError(apiContext, 'Error sending WhatsApp verification', error);
    return withRequestId(
      NextResponse.json(
      { error: error.message || 'Failed to send verification code' },
      { status: 500 }
      ),
      apiContext.requestId,
    );
  }
}
