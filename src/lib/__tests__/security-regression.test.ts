/**
 * @jest-environment node
 */
// Regression: CSRF, URL allowlist, XSS-safe rich text, rate limit, JSON validation, reCAPTCHA guards.
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { assertTrustedExternalUrl } from '../external-url-validation';
import { formatAndSanitizeRichText } from '../rich-text-sanitizer';
import { enforceSameOriginMutation } from '../csrf-protection';
import { enforceRateLimit } from '../api-rate-limit';
import { parseAndValidateJson } from '../api-validation';
import { verifyRecaptchaServerToken } from '../server-recaptcha';

describe('security regressions — external URL allowlist (SSRF)', () => {
  it('rejects non-HTTPS URLs', () => {
    expect(() =>
      assertTrustedExternalUrl('http://www.google.com/foo', ['www.google.com']),
    ).toThrow(/HTTPS/);
  });

  it('rejects hosts not in allowlist', () => {
    expect(() =>
      assertTrustedExternalUrl('https://evil.example/phish', ['www.google.com']),
    ).toThrow(/not allowed/);
  });

  it('rejects URLs with embedded credentials', () => {
    expect(() =>
      assertTrustedExternalUrl(
        'https://user:pass@www.google.com/',
        ['www.google.com'],
      ),
    ).toThrow(/credentials/);
  });

  it('allows exact HTTPS host match', () => {
    const u = assertTrustedExternalUrl(
      'https://www.google.com/recaptcha/api/siteverify',
      ['www.google.com'],
    );
    expect(u.hostname).toBe('www.google.com');
  });

  it('allows subdomains when option is set', () => {
    const u = assertTrustedExternalUrl('https://api.stripe.com/v1/foo', ['stripe.com'], {
      allowSubdomains: true,
    });
    expect(u.hostname).toBe('api.stripe.com');
  });
});

describe('security regressions — rich text XSS patterns', () => {
  it('escapes angle brackets before emitting limited HTML tags', () => {
    const out = formatAndSanitizeRichText('<script>alert(1)</script>**bold**');
    expect(out).not.toMatch(/<script/i);
    expect(out).toContain('&lt;script');
    expect(out).toContain('<strong>bold</strong>');
  });

  it('strips event-handler patterns from normalized markup', () => {
    const out = formatAndSanitizeRichText('<img onerror=alert(1) src=x>');
    expect(out.toLowerCase()).not.toContain('onerror');
    expect(out).not.toContain('javascript:');
  });

  it('neutralizes javascript: and data:text/html payloads in content', () => {
    const out = formatAndSanitizeRichText('javascript:alert(1) data:text/html,<x>');
    expect(out.toLowerCase()).not.toContain('javascript:');
    expect(out.toLowerCase()).not.toContain('data:text/html');
  });
});

describe('security regressions — CSRF same-origin mutation', () => {
  function post(origin: string | undefined) {
    return new NextRequest('https://3arida.ma/api/contact', {
      method: 'POST',
      headers: origin ? { origin } : {},
    });
  }

  it('allows POST when Origin matches request host', () => {
    expect(enforceSameOriginMutation(post('https://3arida.ma'))).toBeNull();
  });

  it('allows POST when Origin header is absent', () => {
    expect(enforceSameOriginMutation(post(undefined))).toBeNull();
  });

  it('blocks POST when Origin does not match', () => {
    const res = enforceSameOriginMutation(post('https://evil.example'));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(403);
  });

  it('does not enforce Origin on GET', () => {
    const req = new NextRequest('https://3arida.ma/api/contact', {
      method: 'GET',
      headers: { origin: 'https://evil.example' },
    });
    expect(enforceSameOriginMutation(req)).toBeNull();
  });
});

describe('security regressions — rate limit', () => {
  it('returns 429 with Retry-After after burst exceeds limit', () => {
    const opts = {
      keyPrefix: `rl-regression-${Date.now()}`,
      limit: 2,
      windowMs: 60_000,
    };
    const headers = { 'x-forwarded-for': '203.0.113.50' };
    const r = () =>
      new NextRequest('http://localhost/api/x', { method: 'POST', headers });

    expect(enforceRateLimit(r(), opts)).toBeNull();
    expect(enforceRateLimit(r(), opts)).toBeNull();
    const blocked = enforceRateLimit(r(), opts);
    expect(blocked?.status).toBe(429);
    expect(blocked?.headers.get('Retry-After')).toMatch(/^\d+$/);
  });
});

describe('security regressions — strict JSON body validation', () => {
  it('returns 400 for invalid JSON', async () => {
    const request = new NextRequest('http://localhost/api/x', {
      method: 'POST',
      body: 'not-json',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await parseAndValidateJson(request, z.object({ a: z.string() }));
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error.status).toBe(400);
  });

  it('returns 400 when schema validation fails', async () => {
    const request = new NextRequest('http://localhost/api/x', {
      method: 'POST',
      body: JSON.stringify({ a: 123 }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await parseAndValidateJson(request, z.object({ a: z.string() }));
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error.status).toBe(400);
  });

  it('returns parsed data when payload is valid', async () => {
    const request = new NextRequest('http://localhost/api/x', {
      method: 'POST',
      body: JSON.stringify({ a: 'ok' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await parseAndValidateJson(request, z.object({ a: z.string() }));
    expect('data' in result).toBe(true);
    if ('data' in result) expect(result.data).toEqual({ a: 'ok' });
  });
});

describe('security regressions — server reCAPTCHA guardrails', () => {
  afterEach(() => {
    delete process.env.RECAPTCHA_SECRET_KEY;
  });

  it('fails closed when secret is not configured', async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    const result = await verifyRecaptchaServerToken('any-token');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not configured/i);
  });

  it('rejects missing or whitespace-only token when secret exists', async () => {
    process.env.RECAPTCHA_SECRET_KEY = process.env.NODE_ENV;
    expect((await verifyRecaptchaServerToken('')).success).toBe(false);
    expect((await verifyRecaptchaServerToken('   ')).success).toBe(false);
  });
});
