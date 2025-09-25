import { NextRequest, NextResponse } from 'next/server';
import { productionMonitor } from '@/lib/monitoring';

// Health check endpoint for production monitoring
export async function GET(request: NextRequest) {
  try {
    // Run comprehensive health checks
    const healthStatus = await productionMonitor.runHealthChecks();

    // Determine HTTP status code based on health
    const statusCode =
      healthStatus.overall === 'healthy'
        ? 200
        : healthStatus.overall === 'degraded'
        ? 200
        : 503;

    // Add additional system information
    const systemInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };

    const response = {
      status: healthStatus.overall,
      uptime: Math.round(healthStatus.uptime / 1000), // Convert to seconds
      services: healthStatus.services.map((service) => ({
        name: service.service,
        status: service.status,
        responseTime: Math.round(service.responseTime),
        ...(service.error && { error: service.error }),
      })),
      system: systemInfo,
    };

    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check system failure',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

// Simple ping endpoint for basic availability checks
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}
