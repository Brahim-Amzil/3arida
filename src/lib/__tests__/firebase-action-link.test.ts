import { rewriteFirebaseActionLinkToApp } from '../firebase-action-link';

describe('rewriteFirebaseActionLinkToApp', () => {
  it('rewrites firebaseapp.com action links to app verify page', () => {
    const firebaseLink =
      'https://arida-c5faf.firebaseapp.com/__/auth/action?mode=verifyEmail&oobCode=abc123&apiKey=key&lang=en';

    const result = rewriteFirebaseActionLinkToApp(firebaseLink);

    expect(result).toContain('https://3arida.org/auth/verify-email');
    expect(result).toContain('mode=verifyEmail');
    expect(result).toContain('oobCode=abc123');
    expect(result).not.toContain('firebaseapp.com');
  });

  it('returns original link when oobCode is missing', () => {
    const bad = 'https://example.com/no-code';
    expect(rewriteFirebaseActionLinkToApp(bad)).toBe(bad);
  });
});
