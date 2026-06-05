import { getPublicAppUrl } from '@/lib/app-url';

/**
 * Firebase Admin generates links on *.firebaseapp.com/__/auth/action which require
 * Firebase Hosting init.json. Our app handles verification via applyActionCode on
 * /auth/verify-email instead (avoids CORS errors with custom domains).
 */
export function rewriteFirebaseActionLinkToApp(
  firebaseLink: string,
  appPath?: string,
): string {
  try {
    const parsed = new URL(firebaseLink);
    const oobCode = parsed.searchParams.get('oobCode');
    if (!oobCode) {
      return firebaseLink;
    }

    const mode = parsed.searchParams.get('mode') || 'verifyEmail';
    const resolvedPath =
      appPath ||
      (mode === 'resetPassword' ? '/auth/reset-password' : '/auth/verify-email');
    const appLink = new URL(`${getPublicAppUrl()}${resolvedPath}`);
    appLink.searchParams.set('mode', mode);
    appLink.searchParams.set('oobCode', oobCode);

    const lang = parsed.searchParams.get('lang');
    if (lang) {
      appLink.searchParams.set('lang', lang);
    }

    return appLink.toString();
  } catch {
    return firebaseLink;
  }
}
