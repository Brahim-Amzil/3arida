import { NextRequest, NextResponse } from 'next/server';

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitBucket>();

type RateLimitOptions = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
};

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return 'unknown-client';
}

export function enforceRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
): NextResponse | null {
  const identifier = getClientIdentifier(request);
  const now = Date.now();
  const storageKey = `${options.keyPrefix}:${identifier}`;
  const current = rateLimitStore.get(storageKey);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(storageKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return null;
  }

  if (current.count >= options.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000),
    );
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSeconds),
        },
      },
    );
  }

  current.count += 1;
  rateLimitStore.set(storageKey, current);
  return null;
}
