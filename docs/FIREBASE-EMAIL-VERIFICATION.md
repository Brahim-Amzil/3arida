# Email verification (production)

## What users see

- **Registration (email/password):** Arabic verification email from **contact@3arida.org** (Resend), not `noreply@…firebaseapp.com`. User is signed out until they click the link.
- **Login:** Blocked until Firebase Auth `emailVerified` is true.
- **Google sign-in:** No extra step (Google accounts are already verified).
- **Create / sign petitions:** Blocked in UI, in `createPetition` / `signPetition`, and in **Firestore rules** (`request.auth.token.email_verified`).

## Deploy checklist

1. **Vercel env** (already used elsewhere): `RESEND_API_KEY`, `RESEND_FROM_EMAIL=contact@3arida.org`, `CONTACT_EMAIL=contact@3arida.org`, `NEXT_PUBLIC_APP_URL=https://www.3arida.org`, Firebase Admin credentials.
2. **Deploy app** (API route `/api/auth/send-verification-email`).
3. **Deploy Firestore rules** (required for bot/fake-email protection):
   ```bash
   firebase deploy --only firestore:rules
   ```
4. **Firebase Console → Authentication → Templates (optional):** Disable or stop using default “Email address verification” for email/password if you only want Resend emails. Our app sends verification via Admin SDK + Resend; the default Firebase mail may still fire if something calls `sendEmailVerification` on the client (we removed that from registration).

## Resend / deliverability (Gmail spam)

- Verify domain **3arida.org** in Resend (SPF, DKIM, DMARC).
- Sending from `contact@3arida.org` with Arabic branded HTML improves inbox placement vs `firebaseapp.com`.
- Ask users to check spam once; mark as “Not spam” if needed.

## Fake / unverified accounts

- **New registrations:** Cannot log in or write petitions/signatures after rules deploy.
- **Old sessions:** `AuthProvider` redirects unverified password users to `/auth/verify-email`.
- **Firestore:** Users cannot set `verifiedEmail: true` on their own profile unless the Auth token already has `email_verified`.

## Manual test (G-03)

1. Register with a real inbox → Arabic email from 3arida.org → click link → login → create/sign works.
2. Register with fake domain → no login until verify (link never arrives) → create/sign fails in UI and Firestore.
3. Try login before verify → Arabic error, redirect to verify page.
4. Google login → works without verify email step.
