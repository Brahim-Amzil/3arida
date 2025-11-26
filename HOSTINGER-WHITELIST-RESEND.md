# Fix: Hostinger Blocking Resend Emails

## Problem

Emails from Resend are showing `delivery_delayed` or `bounced` status because Hostinger's spam filter is blocking them.

## Solution: Whitelist Resend in Hostinger

### Option 1: Add Resend to SPF Record (Recommended)

1. Log in to Hostinger
2. Go to **Domains** → **DNS/Name Servers** → **DNS Zone Editor**
3. Find your SPF record (TXT record starting with `v=spf1`)
4. Add Resend's servers to it:

**Current SPF might look like:**

```
v=spf1 mx a include:_spf.hostinger.com ~all
```

**Update it to:**

```
v=spf1 mx a include:_spf.hostinger.com include:amazonses.com ~all
```

5. Save the changes
6. Wait 5-10 minutes for DNS propagation

### Option 2: Whitelist Resend IPs in Hostinger Email Settings

1. Log in to Hostinger
2. Go to **Email** → **Email Accounts**
3. Click on `contact@3arida.ma`
4. Look for **Spam Filter** or **Whitelist** settings
5. Add these domains to whitelist:
   - `amazonses.com`
   - `resend.com`
   - `*.resend.dev`

### Option 3: Check Spam/Junk Folder and Mark as "Not Spam"

1. Log in to your email at contact@3arida.ma
2. Check **Spam** or **Junk** folder
3. Find emails from `noreply@3arida.ma`
4. Mark them as **Not Spam** / **Not Junk**
5. This trains Hostinger's spam filter

### Option 4: Temporary Workaround - Use Different Email Service

If Hostinger continues blocking, you can:

1. Use Gmail or another email service for receiving
2. Set up email forwarding from contact@3arida.ma to your Gmail
3. Or change CONTACT_EMAIL to a Gmail address temporarily

## Verify the Fix

After making changes, test with:

```bash
node test-direct-send.js
```

Then check the delivery status:

```bash
node check-email-delivery.js
```

Look for `Status: delivered` instead of `delivery_delayed` or `bounced`.

## Why This Happens

Hostinger's spam filters are aggressive and may block emails from:

- New sending domains
- Transactional email services (like Resend, SendGrid, Mailgun)
- Emails with certain content patterns

The SPF record tells Hostinger "it's okay to receive emails from Resend on behalf of 3arida.ma"
