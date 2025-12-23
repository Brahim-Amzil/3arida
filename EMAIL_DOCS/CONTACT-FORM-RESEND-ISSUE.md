# Contact Form Email Issue - Resend Configuration

## Problem

The contact form is returning 500 errors when trying to send emails.

## Root Cause

Resend is in **test mode** and has the following restrictions:

- Can only send emails FROM: `onboarding@resend.dev`
- Can only send emails TO: `3aridapp@gmail.com` (the account owner's email)
- Cannot send to other email addresses until a domain is verified

## Current Error

```
validation_error: You can only send testing emails to your own email address (3aridapp@gmail.com).
To send emails to other recipients, please verify a domain at resend.com/domains, and change the
`from` address to an email using this domain.
```

## Solution Options

### Option 1: Verify Domain with Resend (Recommended for Production)

1. Go to https://resend.com/domains
2. Add and verify the domain `3arida.ma`
3. Add DNS records as instructed by Resend
4. Once verified, update environment variables:
   - `RESEND_FROM_EMAIL=noreply@3arida.ma`
   - `CONTACT_EMAIL=contact@3arida.ma`
5. Redeploy the application

### Option 2: Use Current Test Mode (Temporary)

The code is already configured to work in test mode:

- Emails will be sent to `3aridapp@gmail.com`
- This works for testing but not for production

### Option 3: Switch to SMTP (Alternative)

Use Hostinger SMTP instead of Resend:

1. Uncomment the SMTP code in `src/lib/email-smtp.ts`
2. Update `src/app/api/contact/route.ts` to use SMTP
3. Ensure SMTP environment variables are set on Vercel:
   - `SMTP_HOST=smtp.hostinger.com`
   - `SMTP_PORT=465`
   - `SMTP_USER=contact@3arida.ma`
   - `SMTP_PASSWORD=your-password`

## Current Configuration

- **From Email**: `onboarding@resend.dev` (Resend test email)
- **To Email**: `3aridapp@gmail.com` (test mode restriction)
- **Status**: Working in test mode, but needs domain verification for production

## Next Steps

1. Verify the domain `3arida.ma` with Resend
2. Update environment variables with verified domain email
3. Test the contact form again
4. Monitor email delivery

## Testing

To test locally:

```bash
cd 3arida-app
node test-resend-simple.js
```

To test production:

```bash
cd 3arida-app
node test-contact-form-prod.js
```

## Environment Variables Needed

```
RESEND_API_KEY=re_xxx (already set)
RESEND_FROM_EMAIL=noreply@3arida.ma (after domain verification)
CONTACT_EMAIL=contact@3arida.ma (after domain verification)
```

## Date

November 25, 2025
