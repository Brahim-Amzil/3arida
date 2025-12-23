// WhatsApp Cloud API Webhook
import { NextRequest, NextResponse } from 'next/server';
import { verifyWhatsAppCode } from '@/lib/whatsapp-verification';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Webhook verification (required by Meta)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN?.trim();

  console.log('Webhook verification attempt:', {
    mode,
    receivedToken: token,
    receivedLength: token?.length,
    expectedToken: VERIFY_TOKEN,
    expectedLength: VERIFY_TOKEN?.length,
    tokensMatch: token === VERIFY_TOKEN,
    challenge,
  });

  if (mode === 'subscribe' && token && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.log('❌ Webhook verification failed');
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// Handle incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract message data from WhatsApp webhook payload
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: 'no_message' }, { status: 200 });
    }

    const userPhone = message.from; // e.g., "212600000000"
    const textBody = message.text?.body; // e.g., "Verify my 3arida account with code: 1234"

    if (!textBody) {
      return NextResponse.json({ status: 'no_text' }, { status: 200 });
    }

    // Extract verification code from message
    const codeMatch = textBody.match(/code:\s*(\d{4})/i);
    if (!codeMatch) {
      // Send error message back to user
      await sendWhatsAppMessage(
        userPhone,
        '❌ Invalid format. Please send the verification code as shown in the app.'
      );
      return NextResponse.json({ status: 'invalid_format' }, { status: 200 });
    }

    const code = codeMatch[1];

    // Verify the code
    const result = await verifyWhatsAppCode(userPhone, code);

    if (result.success && result.userId) {
      // Update user's phone verification status
      await updateDoc(doc(db, 'users', result.userId), {
        phoneVerified: true,
        phoneNumber: userPhone,
        phoneVerifiedAt: new Date(),
      });

      // Send success message
      await sendWhatsAppMessage(
        userPhone,
        '✅ Phone verified successfully! You can now return to the app.'
      );

      return NextResponse.json({ status: 'verified' }, { status: 200 });
    } else {
      // Send error message
      await sendWhatsAppMessage(
        userPhone,
        `❌ Verification failed: ${result.error || 'Unknown error'}`
      );

      return NextResponse.json(
        { status: 'verification_failed' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Send WhatsApp message (optional - for sending replies)
async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.warn('WhatsApp credentials not configured, skipping message send');
    return;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send WhatsApp message:', await response.text());
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}
