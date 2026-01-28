import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

const PAYPAL_API_BASE =
  PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// Get PayPal access token
async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Verify webhook signature
async function verifyWebhookSignature(
  webhookId: string,
  headers: any,
  body: any,
): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();

    const verifyResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          transmission_id: headers['paypal-transmission-id'],
          transmission_time: headers['paypal-transmission-time'],
          cert_url: headers['paypal-cert-url'],
          auth_algo: headers['paypal-auth-algo'],
          transmission_sig: headers['paypal-transmission-sig'],
          webhook_id: webhookId,
          webhook_event: body,
        }),
      },
    );

    if (!verifyResponse.ok) {
      console.error(
        'Webhook verification failed:',
        await verifyResponse.text(),
      );
      return false;
    }

    const verifyData = await verifyResponse.json();
    return verifyData.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = Object.fromEntries(request.headers.entries());

    console.log('📥 PayPal webhook received:', body.event_type);

    // Verify webhook signature if webhook ID is configured
    if (PAYPAL_WEBHOOK_ID) {
      const isValid = await verifyWebhookSignature(
        PAYPAL_WEBHOOK_ID,
        headers,
        body,
      );

      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 },
        );
      }
    } else {
      console.warn('⚠️ Webhook signature verification skipped (no WEBHOOK_ID)');
    }

    const eventType = body.event_type;
    const resource = body.resource;

    // Handle different webhook events
    switch (eventType) {
      case 'CHECKOUT.ORDER.APPROVED':
        console.log('✅ Order approved:', resource.id);
        // Order approved but not yet captured
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('💰 Payment captured:', resource.id);
        await handlePaymentCaptured(resource);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        console.log('❌ Payment denied:', resource.id);
        await handlePaymentFailed(resource, 'denied');
        break;

      case 'PAYMENT.CAPTURE.REFUNDED':
        console.log('💸 Payment refunded:', resource.id);
        await handlePaymentRefunded(resource);
        break;

      default:
        console.log('ℹ️ Unhandled event type:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 },
    );
  }
}

// Handle successful payment capture
async function handlePaymentCaptured(resource: any) {
  try {
    // Extract petition ID from custom_id or reference_id
    const customId = resource.supplementary_data?.related_ids?.order_id;

    // Get the order details to extract petition info
    if (!customId) {
      console.error('No order ID found in payment capture');
      return;
    }

    // In a real implementation, you would:
    // 1. Fetch the order details using the order ID
    // 2. Extract the petition ID from the order's custom_id
    // 3. Update the petition status in Firestore

    console.log('✅ Payment captured successfully for order:', customId);

    // TODO: Update petition status to 'pending' (awaiting moderation)
    // This requires fetching the order details first to get the petition ID
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(resource: any, reason: string) {
  try {
    console.log(`❌ Payment failed (${reason}):`, resource.id);

    // TODO: Update petition status or notify user
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle payment refund
async function handlePaymentRefunded(resource: any) {
  try {
    console.log('💸 Payment refunded:', resource.id);

    // TODO: Update petition status or handle refund logic
  } catch (error) {
    console.error('Error handling payment refunded:', error);
  }
}
