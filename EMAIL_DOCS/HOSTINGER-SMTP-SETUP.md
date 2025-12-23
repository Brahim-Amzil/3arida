# Hostinger SMTP Setup for Contact Form

## What Changed

Switched from Resend to **Hostinger SMTP** for sending contact form emails - just like your other forms.

## Why This Works Better

- ✅ Uses your existing Hostinger email infrastructure
- ✅ No DNS conflicts or authentication issues
- ✅ Emails go directly to `contact@3arida.ma`
- ✅ Same setup as your other working forms
- ✅ Simple and reliable

## Setup Steps

### 1. Get Your Email Password

You need the password for `contact@3arida.ma`. If you don't have it:

1. Log into Hostinger control panel
2. Go to **Emails** section
3. Find `contact@3arida.ma`
4. Click **Manage** → **Change Password** (if needed)
5. Copy the password

### 2. Update Environment Variables

**Local (.env.local):**

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@3arida.ma
SMTP_PASSWORD=your_actual_password_here
```

**Vercel (Production):**

```bash
# Add these environment variables in Vercel dashboard
vercel env add SMTP_HOST
# Enter: smtp.hostinger.com

vercel env add SMTP_PORT
# Enter: 465

vercel env add SMTP_USER
# Enter: contact@3arida.ma

vercel env add SMTP_PASSWORD
# Enter: your_actual_password_here
```

Or use the Vercel dashboard:

1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add each variable for Production, Preview, and Development

### 3. Test Locally

```bash
cd 3arida-app
npm run dev
```

Then submit the contact form at http://localhost:3000/contact

### 4. Deploy

```bash
git add -A
git commit -m "Switch to Hostinger SMTP for contact form"
git push
```

Vercel will auto-deploy.

## How It Works

```
User submits form
    ↓
Next.js API route (/api/contact)
    ↓
Nodemailer connects to smtp.hostinger.com
    ↓
Sends email from contact@3arida.ma
    ↓
Email arrives in contact@3arida.ma inbox
```

## Troubleshooting

### "Authentication failed"

- Check SMTP_USER is exactly: `contact@3arida.ma`
- Check SMTP_PASSWORD is correct
- Make sure email account exists in Hostinger

### "Connection timeout"

- Check SMTP_HOST is: `smtp.hostinger.com`
- Check SMTP_PORT is: `465`
- Check firewall isn't blocking port 465

### "Email not received"

- Check spam folder in Hostinger webmail
- Log into Hostinger webmail to verify email exists
- Check email filters/rules

## Hostinger SMTP Settings

```
Host: smtp.hostinger.com
Port: 465 (SSL) or 587 (TLS)
Security: SSL/TLS
Username: contact@3arida.ma
Password: your_email_password
```

## Benefits Over Resend

1. **No DNS conflicts** - Uses your existing Hostinger setup
2. **Direct delivery** - Emails go straight to your inbox
3. **Familiar setup** - Same as your other forms
4. **No extra services** - One less thing to manage
5. **Works immediately** - No domain verification needed

---

**Status:** Ready to deploy once SMTP_PASSWORD is set
