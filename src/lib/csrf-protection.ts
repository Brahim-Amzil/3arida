import { NextRequest, NextResponse } from 'next/server';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function normalizeOrigin(origin: string): string {
  try {
    return new URL(origin).origin;
  } catch {
    return origin;
  }
}

export function enforceSameOriginMutation(request: NextRequest): NextResponse | null {
  if (!MUTATION_METHODS.has(request.method.toUpperCase())) return null;

  const originHeader = request.headers.get('origin');
  if (!originHeader) return null;

  const requestOrigin = normalizeOrigin(request.nextUrl.origin);
  const origin = normalizeOrigin(originHeader);
  if (origin === requestOrigin) return null;

  return NextResponse.json(
    { error: 'CSRF protection: invalid request origin' },
    { status: 403 },
  );
}
