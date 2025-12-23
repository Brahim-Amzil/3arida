import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No reCAPTCHA token provided' },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA not configured' },
        { status: 500 }
      );
    }

    // Verify token with Google
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verifyUrl, {
      method: 'POST',
    });

    const data = await response.json();

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 0.0 = very likely a bot, 1.0 = very likely a human
    if (data.success && data.score >= 0.5) {
      return NextResponse.json({
        success: true,
        score: data.score,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'reCAPTCHA verification failed',
        score: data.score,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
