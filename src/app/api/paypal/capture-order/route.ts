import { NextRequest, NextResponse } from 'next/server';

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';

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

export async function POST(request: NextRequest) {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      {
        error:
          'PayPal is not configured. Please set PAYPAL credentials in environment variables.',
      },
      { status: 503 },
    );
  }

  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
        { status: 400 },
      );
    }

    // Get access token
    const accessToken = await getPayPalAccessToken();

    // Capture the order
    const captureResponse = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal capture error:', errorData);
      throw new Error('Failed to capture PayPal payment');
    }

    const captureData = await captureResponse.json();

    // Extract payment details
    const purchaseUnit = captureData.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];

    if (!capture || capture.status !== 'COMPLETED') {
      throw new Error('Payment capture was not completed');
    }

    // Parse custom data
    let customData = null;
    try {
      customData = JSON.parse(purchaseUnit.custom_id || '{}');
    } catch (e) {
      console.warn('Failed to parse custom data:', e);
    }

    return NextResponse.json({
      success: true,
      orderId: captureData.id,
      captureId: capture.id,
      status: capture.status,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      petitionId: customData?.petitionId || purchaseUnit.reference_id,
      pricingTier: customData?.pricingTier,
      payerEmail: captureData.payer?.email_address,
      payerName: captureData.payer?.name?.given_name,
    });
  } catch (error: any) {
    console.error('PayPal capture error:', error);

    return NextResponse.json(
      {
        error: 'Failed to capture PayPal payment',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
