import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    console.log('=== TEST CONTACT API CALLED ===');

    try {
        console.log('1. Starting to parse body...');
        const body = await request.json();
        console.log('2. Body parsed:', body);

        console.log('3. Checking env vars...');
        console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
        console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
        console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
        console.log('CONTACT_EMAIL:', process.env.CONTACT_EMAIL);

        return NextResponse.json({
            success: true,
            message: 'Test successful',
            env: {
                hasResendKey: !!process.env.RESEND_API_KEY,
                resendFromEmail: process.env.RESEND_FROM_EMAIL || 'NOT SET',
                fromEmail: process.env.FROM_EMAIL || 'NOT SET',
                contactEmail: process.env.CONTACT_EMAIL || 'NOT SET',
            }
        });
    } catch (error) {
        console.error('ERROR in test-contact:', error);
        return NextResponse.json(
            { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
