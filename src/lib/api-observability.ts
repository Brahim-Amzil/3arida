import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

type LogLevel = 'info' | 'warn' | 'error';

type ApiContext = {
  route: string;
  requestId: string;
  method: string;
  path: string;
  ip: string;
};

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown';
  return request.ip || 'unknown';
}

function toErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return typeof error === 'string' ? error : 'Unknown error';
}

function log(level: LogLevel, context: ApiContext, message: string, details?: unknown) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    route: context.route,
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    ip: context.ip,
    message,
    details,
  };

  const serialized = JSON.stringify(payload);
  if (level === 'error') {
    console.error(serialized);
    return;
  }
  if (level === 'warn') {
    console.warn(serialized);
    return;
  }
  console.log(serialized);
}

export function initApiRequestContext(request: NextRequest, route: string): ApiContext {
  const headerId = request.headers.get('x-request-id')?.trim();
  return {
    route,
    requestId: headerId || randomUUID(),
    method: request.method,
    path: request.nextUrl.pathname,
    ip: getClientIp(request),
  };
}

export function logApiInfo(context: ApiContext, message: string, details?: unknown) {
  log('info', context, message, details);
}

export function logApiWarn(context: ApiContext, message: string, details?: unknown) {
  log('warn', context, message, details);
}

export function logApiError(context: ApiContext, message: string, error?: unknown) {
  log('error', context, message, {
    error: toErrorMessage(error),
  });
}

export function withRequestId(response: NextResponse, requestId: string) {
  response.headers.set('x-request-id', requestId);
  return response;
}
