import { NextRequest, NextResponse } from 'next/server';

// PayPal API configuration
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'

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
  // Check if PayPal is configured
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
    const {
      amount,
      currency = 'MAD',
      petitionId,
      pricingTier,
    } = await request.json();

    // Validate required fields
    if (!amount || !petitionId || !pricingTier) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, petitionId, pricingTier' },
        { status: 400 },
      );
    }

    // PayPal doesn't support MAD currency
    // Convert MAD to USD (approximate rate: 1 USD = 10 MAD)
    const madAmount = parseFloat(amount);
    const usdAmount = currency === 'MAD' ? madAmount / 10 : madAmount;

    console.log(
      `💱 Currency conversion: ${madAmount} MAD → $${usdAmount.toFixed(2)} USD`,
    );

    // Get access token
    const accessToken = await getPayPalAccessToken();

    // Create order
    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: petitionId,
            description: `3arida Petition - ${pricingTier} Plan (${madAmount} MAD)`,
            custom_id: JSON.stringify({
              petitionId,
              pricingTier,
              platform: '3arida',
              originalAmount: madAmount,
              originalCurrency: 'MAD',
            }),
            amount: {
              currency_code: 'USD',
              value: usdAmount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: '3arida',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/petitions/create/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/petitions/create`,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('PayPal order creation error:', errorData);
      throw new Error('Failed to create PayPal order');
    }

    const orderData = await orderResponse.json();

    return NextResponse.json({
      orderId: orderData.id,
      status: orderData.status,
    });
  } catch (error: any) {
    console.error('PayPal order creation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create PayPal order',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
