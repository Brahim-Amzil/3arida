import { NextRequest, NextResponse } from 'next/server';

// Simple health check endpoint for production monitoring
export async function GET(request: NextRequest) {
  try {
    // Basic system information
    const systemInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
    };

    // Basic service checks
    const services = [];

    // Check if Firebase config is present
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      services.push({
        name: 'firebase',
        status: 'configured',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    // Check if email service is configured
    if (process.env.RESEND_API_KEY) {
      services.push({
        name: 'email',
        status: 'configured',
      });
    }

    // Check if WhatsApp is configured
    if (process.env.WHATSAPP_ACCESS_TOKEN) {
      services.push({
        name: 'whatsapp',
        status: 'configured',
      });
    }

    const response = {
      ...systemInfo,
      services,
      message: '3arida Platform is running',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Simple ping endpoint for basic availability checks
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}
