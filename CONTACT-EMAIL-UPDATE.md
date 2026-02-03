# Contact Email Updated

## Change Made ✅

Updated the contact form recipient email from `3aridapp@gmail.com` to `contact@3arida.ma`

---

## What Was Changed

### 1. Environment Variable Added

**File**: `.env.local`

```bash
CONTACT_EMAIL=contact@3arida.ma
```

### 2. API Route Default Updated

**File**: `src/app/api/contact/route.ts`

- Changed default from `3aridapp@gmail.com` to `contact@3arida.ma`
- Now uses: `process.env.CONTACT_EMAIL || 'contact@3arida.ma'`

---

## How It Works

When someone submits the contact form (including influencer coupon requests), the email is sent to:

1. **Primary**: `CONTACT_EMAIL` environment variable (`contact@3arida.ma`)
2. **Fallback**: If not set, defaults to `contact@3arida.ma`

---

## Email Service

The system uses **Resend** to send emails:

- **From**: `contact@3arida.ma` (verified domain)
- **To**: `contact@3arida.ma` (your inbox)
- **Reply-To**: User's email address (so you can reply directly)

---

## Testing

Test the contact form:

```bash
./test-contact-email.sh
```

Or manually:

1. Go to: `http://localhost:3004/contact`
2. Fill out the form
3. Submit
4. Check inbox at `contact@3arida.ma`

---

## Influencer Coupon Requests

When an influencer requests a coupon via the contact form:

- Email includes highlighted section with:
  - Platform (Instagram, TikTok, etc.)
  - Account URL
  - Follower count
  - Requested discount tier (10%, 15%, 20%, 30%)
- Action required section tells you to:
  1. Verify the account
  2. Generate coupon in admin dashboard
  3. Send code to influencer's email

---

## Important Notes

### Resend Configuration

Make sure these are set in `.env.local`:

```bash
RESEND_API_KEY=re_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46
RESEND_FROM_EMAIL=contact@3arida.ma
CONTACT_EMAIL=contact@3arida.ma
```

### Domain Verification

The domain `3arida.ma` must be verified in Resend dashboard:

- Go to: https://resend.com/domains
- Verify `3arida.ma` is listed and verified
- If not, add DNS records provided by Resend

### Email Delivery

If emails aren't arriving:

1. Check spam/junk folder
2. Verify Resend domain is verified
3. Check Resend dashboard for delivery logs
4. Ensure `contact@3arida.ma` mailbox exists and is accessible

---

## Where Emails Are Sent

All these forms now send to `contact@3arida.ma`:

- ✅ General contact form
- ✅ Technical support requests
- ✅ Petition inquiries
- ✅ Account issues
- ✅ Content reports
- ✅ Partnership requests
- ✅ Press inquiries
- ✅ **Influencer coupon requests** 🌟

---

## Next Steps

1. ✅ Environment variable added
2. ✅ API route updated
3. ✅ Dev server reloaded
4. ⏳ Test by submitting contact form
5. ⏳ Check `contact@3arida.ma` inbox
6. ⏳ Verify Resend domain if emails not arriving

---

**Status**: Complete and ready to use
**Recipient Email**: contact@3arida.ma
**Email Service**: Resend
