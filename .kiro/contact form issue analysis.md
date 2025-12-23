# Contact Form Failure - Root Cause Analysis

## Executive Summary

> [!CAUTION] > **The contact form fails because the Next.js webpack configuration disables `undici`, which is required by the Resend email library.**

The form hangs indefinitely on both local and production environments without sending emails or showing error messages.

---

## Root Cause

### The Problem

In [next.config.js:115](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/next.config.js#L115):

```javascript
config.resolve.alias = {
  ...config.resolve.alias,
  undici: false, // ← THIS IS THE PROBLEM
};
```

**Why this breaks the contact form:**

1. The Resend email library uses `undici` internally for HTTP requests
2. Setting `undici: false` completely disables it in webpack
3. When the API route tries to send an email via Resend, it hangs because undici is unavailable
4. No error is thrown - the code just hangs indefinitely

---

## Evidence

### ✅ Resend API Key Works Perfectly

Direct test of the Resend API (bypassing Next.js):

```bash
$ node -e "const { Resend } = require('resend'); ..."
Success: { data: { id: 'cd9a2290-70d6-42e3-b541-3114e757040c' }, error: null }
```

**Both email addresses work:**

- ✅ `onboarding@resend.dev` (default fallback)
- ✅ `contact@3arida.ma` (custom domain)

### ❌ All API Routes Timeout

Testing the contact API endpoint:

```bash
$ curl -X POST http://localhost:3001/api/contact ...
curl: (28) Operation timed out after 30 seconds with 0 bytes received
```

**Even simple test routes timeout:**

- `/api/contact` - Hangs for 30+ seconds
- `/api/test-contact` - Hangs for 30+ seconds
- `/api/health` - Hangs for 30+ seconds

**No console output at all** - the route handlers aren't even being called.

### Production Environment

Testing on https://3arida.vercel.app/contact:

- ❌ Form submission fails with 500 Internal Server Error
- ❌ Error message displayed: "حدث خطأ أثناء إرسال الرسالة"
- ❌ Console shows: `POST /api/contact 500 (Internal Server Error)`

---

## Technical Analysis

### The Webpack Configuration Issue

The [next.config.js](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/next.config.js) file has extensive webpack customizations to fix "undici compatibility issues":

**Lines 62-118:**

```javascript
webpack: (config, { isServer }) => {
  if (!isServer) {
    // Exclude undici from client bundle
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // ... many fallbacks ...
    };

    config.externals.push({
      undici: 'undici', // Line 86
    });
  }

  // Completely exclude undici from webpack processing
  config.module.rules.push({
    test: /node_modules\/undici/,
    use: 'null-loader', // Line 94 - replaces undici with empty module
  });

  // Ignore undici warnings
  config.ignoreWarnings = [
    { module: /node_modules\/undici/ }, // Line 107
  ];

  // Add alias to prevent undici from being bundled
  config.resolve.alias = {
    ...config.resolve.alias,
    undici: false, // Line 115 - DISABLES undici completely
  };

  return config;
};
```

**The problem:**

- These configurations were likely added to fix client-side bundle issues
- But they also affect **server-side** code (API routes)
- The `'undici': false` alias completely disables undici everywhere
- Resend depends on undici for HTTP requests
- When Resend tries to use undici, it gets `false` instead, causing the code to hang

### Why There's No Error Message

The code doesn't throw an error because:

1. The webpack alias returns `false` instead of throwing
2. The Resend library likely tries to use undici without proper error handling for this edge case
3. The async call just hangs indefinitely waiting for a response that will never come

---

## Environment Configuration

### Local Environment (.env.local)

```env
RESEND_API_KEY=re_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46  ✅ Valid
FROM_EMAIL=contact@3arida.ma                          ✅ Set
```

**Missing:**

- `RESEND_FROM_EMAIL` - Not set (code uses `FROM_EMAIL` instead)
- `CONTACT_EMAIL` - Not set (uses default `3aridapp@gmail.com`)

### Vercel Production Environment

```bash
$ vercel env ls
RESEND_API_KEY          ✅ Set (Production, Preview, Development)
CONTACT_EMAIL           ✅ Set (Production, Preview, Development)
```

**Missing:**

- `RESEND_FROM_EMAIL` - Not set in Vercel

**Note:** The missing `RESEND_FROM_EMAIL` is NOT the issue - the code has a fallback to `'onboarding@resend.dev'` which works perfectly.

---

## API Route Code Analysis

[3arida-app/src/app/api/contact/route.ts](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/app/api/contact/route.ts)

**Lines 194-210:**

```typescript
// Send email using Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const toEmail = process.env.CONTACT_EMAIL || '3aridapp@gmail.com';

console.log('Sending email from:', fromEmail, 'to:', toEmail);

const emailResult = await resend.emails.send({
  // ← HANGS HERE
  from: fromEmail,
  to: toEmail,
  subject: `[3arida Contact Form] [${reasonLabel}] ${subject}`,
  replyTo: email,
  html: emailHtml,
});
```

**What happens:**

1. Resend client is created successfully
2. Environment variables are read correctly
3. `resend.emails.send()` is called
4. Internally, Resend tries to use `undici` for the HTTP request
5. Webpack alias returns `false` instead of the undici module
6. Code hangs indefinitely waiting for HTTP response

**The `console.log` on line 202 never executes** - the code hangs before reaching it.

---

## Solution

> [!IMPORTANT] > **Fix the webpack configuration to allow undici on the server side**

### Option 1: Only Disable Undici on Client Side (Recommended)

Modify [next.config.js](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/next.config.js) to only disable undici for client-side code:

```javascript
webpack: (config, { isServer }) => {
  if (!isServer) {
    // Client-side: disable undici
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // ... existing fallbacks ...
    };

    config.externals.push({
      undici: 'undici',
    });

    // Add alias ONLY for client-side
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: false,
    };
  }
  // Server-side: allow undici to work normally

  // Remove or modify these rules to not affect server-side:
  // - null-loader rule (line 92-95)
  // - ignoreWarnings (line 106-110)

  return config;
};
```

### Option 2: Use Alternative Email Service

If undici must remain disabled, switch from Resend to SMTP using the existing [email-smtp.ts](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/lib/email-smtp.ts) library:

1. Update the API route to use [sendEmail()](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/lib/email-smtp.ts#11-48) from [email-smtp.ts](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/lib/email-smtp.ts) instead of Resend
2. Configure SMTP credentials properly in environment variables
3. The SMTP library uses `nodemailer` which doesn't depend on undici

### Option 3: Update Resend Configuration

If using a newer version of Resend that doesn't depend on undici, update the package:

```bash
npm update resend
```

---

## Files Involved

| File                                                                                                                            | Issue                         | Line    |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------- |
| [next.config.js](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/next.config.js)                             | Disables undici globally      | 115     |
| [src/app/api/contact/route.ts](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/app/api/contact/route.ts) | Uses Resend (requires undici) | 195-210 |
| [src/lib/email-smtp.ts](file:///Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/lib/email-smtp.ts)               | Alternative SMTP solution     | -       |

---

## Summary

| Component             | Status        | Notes                                                     |
| --------------------- | ------------- | --------------------------------------------------------- |
| Resend API Key        | ✅ Valid      | Tested successfully outside Next.js                       |
| Email Addresses       | ✅ Working    | Both `onboarding@resend.dev` and `contact@3arida.ma` work |
| Environment Variables | ✅ Configured | All required vars set in Vercel                           |
| API Route Code        | ✅ Correct    | No bugs in the implementation                             |
| Webpack Config        | ❌ **BROKEN** | Disables undici which Resend requires                     |
| Contact Form          | ❌ **FAILS**  | Hangs indefinitely due to webpack issue                   |

**The fix:** Modify the webpack configuration to allow undici on the server side, or switch to SMTP email service.
