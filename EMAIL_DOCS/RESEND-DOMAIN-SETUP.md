# Resend Domain Verification Setup

## Current Situation

- Emails are being sent to: `3aridapp@gmail.com` (API key owner)
- You want emails at: `contact@3arida.ma`
- Using test domain: `onboarding@resend.dev` (limited to API key owner only)

## Steps to Verify Your Domain

### 1. Add Domain to Resend

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain: `3arida.ma`
4. Click "Add"

### 2. Add DNS Records

Resend will provide you with DNS records to add. You'll need to add these to your domain registrar (where you bought 3arida.ma):

**Typical records you'll need to add:**

```
Type: TXT
Name: @ (or leave blank)
Value: resend-verification=xxxxx (Resend will provide this)

Type: MX
Name: @ (or leave blank)
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; (Resend will provide exact value)

Type: TXT
Name: resend._domainkey
Value: (Long DKIM key - Resend will provide this)
```

### 3. Wait for Verification

- DNS propagation can take 24-48 hours
- Resend will automatically verify once DNS is updated
- You can check status at https://resend.com/domains

### 4. Update Code

Once domain is verified, update the contact API route:

```typescript
// In src/app/api/contact/route.ts
const { data, error } = await resend.emails.send({
  from: 'contact@3arida.ma', // Your verified domain
  to: 'contact@3arida.ma', // Can now send to any email
  replyTo: email,
  subject: `[3arida Contact Form] [${reasonLabel}] ${subject}`,
  // ... rest of email config
});
```

## Quick Fix (Temporary)

If you want to receive emails immediately at `contact@3arida.ma` while waiting for domain verification:

### Option 1: Forward from Gmail

Set up email forwarding from `3aridapp@gmail.com` to `contact@3arida.ma`

1. Go to Gmail settings
2. Click "Forwarding and POP/IMAP"
3. Add forwarding address: `contact@3arida.ma`
4. Confirm the forwarding

### Option 2: Check 3aridapp@gmail.com

Simply check the `3aridapp@gmail.com` inbox for contact form submissions until domain is verified.

## After Domain Verification

Once your domain is verified, you'll be able to:

- ✅ Send from `contact@3arida.ma`
- ✅ Send to any email address (not just API key owner)
- ✅ Better email deliverability
- ✅ Professional sender address
- ✅ No "via resend.dev" in headers

## Need Help?

If you need help with DNS setup, let me know:

- Who is your domain registrar? (GoDaddy, Namecheap, etc.)
- Do you have access to DNS settings?
- Can you share the DNS records Resend provides?

---

**Current Status:** Using test domain, emails go to 3aridapp@gmail.com
**Target:** Verify 3arida.ma domain, emails go to contact@3arida.ma
