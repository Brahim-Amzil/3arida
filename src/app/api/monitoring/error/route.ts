import { NextRequest, NextResponse } from 'next/server';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  withRequestId,
} from '@/lib/api-observability';

type MonitoringPayload = {
  message?: string;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp?: number;
  userId?: string;
  url?: string;
  source?: string;
};

function sanitizePayload(payload: MonitoringPayload) {
  return {
    message: payload.message?.slice(0, 500) || 'Unknown client error',
    stack: payload.stack?.slice(0, 2000),
    context: payload.context || {},
    timestamp: payload.timestamp || Date.now(),
    userId: payload.userId || null,
    url: payload.url || null,
    source: payload.source || 'client',
  };
}

export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(request, 'api/monitoring/error');

  try {
    const payload = (await request.json()) as MonitoringPayload;
    const sanitized = sanitizePayload(payload);

    logApiError(apiContext, 'Client error reported', sanitized);

    return withRequestId(
      NextResponse.json({ ok: true, requestId: apiContext.requestId }),
      apiContext.requestId,
    );
  } catch (error) {
    logApiError(apiContext, 'Monitoring ingest failed', error);
    return withRequestId(
      NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 }),
      apiContext.requestId,
    );
  }
}

export async function GET(request: NextRequest) {
  const apiContext = initApiRequestContext(request, 'api/monitoring/error');
  logApiInfo(apiContext, 'Monitoring ingest health check');

  return withRequestId(
    NextResponse.json({ ok: true, route: 'monitoring-error-ingest' }),
    apiContext.requestId,
  );
}
