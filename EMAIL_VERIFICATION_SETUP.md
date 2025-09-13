# Email Verification System Setup Guide

This guide explains how to set up and configure the comprehensive email verification system for the 3arida platform.

## 🏗️ System Overview

The email verification system consists of:

1. **Email Verification Library** (`/lib/email-verification.ts`) - Core token management
2. **Email Service** (`/lib/email-service.ts`) - Resend integration with professional templates
3. **API Routes** - Email sending and verification endpoints
4. **Frontend Components** - Verification UI and user flows
5. **Firestore Security Rules** - Database access control
6. **Registration Integration** - Automatic verification during signup

## 📧 Email Service Setup (Resend)

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain or use a subdomain
3. Generate an API key from the dashboard

### 2. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Resend Email Service (for email verification)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=3arida Platform
NEXTAUTH_URL=https://yourdomain.com
```

### 3. Domain Configuration

- **Production**: Add and verify your domain in Resend dashboard
- **Development**: Use Resend's test domain or add your local domain

## 🔥 Firestore Setup

### 1. Security Rules

The system automatically includes Firestore security rules for:

```javascript
// Email verification tokens collection
match /emailVerificationTokens/{tokenId} {
  allow read, create, update, delete: if isAuthenticated();
}

// User email verification updates
match /users/{userId} {
  allow update: if isOwner(userId) && 
    request.resource.data.diff(resource.data)
    .affectedKeys().hasOnly(['emailVerified', 'verifiedAt', 'updatedAt']);
}
```

### 2. Database Collections

The system creates these collections automatically:

- `emailVerificationTokens` - Stores verification tokens
- `users` - Updated with verification status

## 🚀 Installation & Dependencies

### 1. Install Required Packages

```bash
npm install resend
```

### 2. File Structure

The system includes these files:

```
lib/
├── email-verification.ts      # Core verification logic
└── email-service.ts          # Resend integration

pages/
├── api/
│   ├── send-verification-email.ts  # Email sending API
│   └── auth/
│       └── firebase-join.ts        # Registration with verification
└── auth/
    └── verify-email.tsx            # Verification page

components/
└── EmailVerificationBanner.tsx    # Verification banner

firestore.rules                     # Updated security rules
```

## 🎯 Usage Examples

### 1. User Registration Flow

```typescript
// In your registration component
const handleRegister = async (userData) => {
  const response = await fetch('/api/auth/firebase-join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  
  if (result.success && result.confirmEmail) {
    // Show success message and prompt to check email
    router.push('/auth/verify-email');
  }
};
```

### 2. Manual Email Verification

```typescript
import { resendVerificationEmail } from '@/lib/email-verification';

const handleResendEmail = async () => {
  const result = await resendVerificationEmail(userId, userEmail);
  
  if (result.success) {
    toast.success('Verification email sent!');
  } else {
    toast.error(result.message);
  }
};
```

### 3. Check Verification Status

```typescript
import { getUserVerificationStatus } from '@/lib/email-verification';

const checkStatus = async () => {
  const status = await getUserVerificationStatus(userId);
  
  if (status.isVerified) {
    // User is verified
  } else {
    // Show verification banner
  }
};
```

### 4. Add Verification Banner

```tsx
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

function Layout({ children }) {
  return (
    <div>
      <EmailVerificationBanner />
      {children}
    </div>
  );
}
```

## 🔒 Security Features

### 1. Token Security

- **24-hour expiration** - Tokens automatically expire
- **Single-use tokens** - Marked as used after verification
- **Unique generation** - Random strings + timestamps
- **Secure storage** - Firestore with proper access rules

### 2. Email Security

- **Domain verification** - Resend requires domain ownership
- **Rate limiting** - Built-in cooldowns for resending
- **Professional templates** - Branded, responsive emails
- **Fallback URLs** - Manual copy-paste option

### 3. User Security

- **Authentication required** - All operations require login
- **Owner-only updates** - Users can only update their own data
- **Audit trail** - Comprehensive logging

## 🎨 Email Template Features

### 1. Professional Design

- **Responsive layout** - Works on all devices
- **Gradient backgrounds** - Modern, attractive design
- **Brand consistency** - 3arida platform styling
- **Clear CTAs** - Prominent verification buttons

### 2. User Experience

- **Expiration warnings** - Clear 24-hour time limits
- **Fallback options** - Manual URL copying
- **Email confirmation** - Shows recipient address
- **Support information** - Contact details included

### 3. Technical Features

- **HTML + Text versions** - Maximum compatibility
- **Email tracking** - Resend analytics integration
- **Error handling** - Graceful failure management

## 🔧 Configuration Options

### 1. Email Templates

Customize email appearance in `/lib/email-service.ts`:

```typescript
// Update colors, fonts, and styling
const emailStyles = {
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  fontFamily: 'Segoe UI, sans-serif'
};
```

### 2. Token Expiration

Modify token lifetime in `/lib/email-verification.ts`:

```typescript
// Change from 24 hours to custom duration
const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
```

### 3. Resend Cooldown

Adjust resend timing in components:

```typescript
// Change from 60 seconds to custom duration
setResendCooldown(30); // 30 seconds
```

## 🐛 Troubleshooting

### 1. Email Not Sending

**Check:**
- Resend API key is correct
- Domain is verified in Resend
- FROM_EMAIL matches verified domain
- Environment variables are loaded

**Debug:**
```bash
# Check environment variables
echo $RESEND_API_KEY
echo $FROM_EMAIL

# Check API logs
tail -f logs/api.log
```

### 2. Verification Not Working

**Check:**
- Token exists in Firestore
- Token hasn't expired
- Token hasn't been used
- User is authenticated

**Debug:**
```typescript
// Add logging to verification process
console.log('Token data:', tokenData);
console.log('Current time:', new Date());
console.log('Token expires:', tokenData.expiresAt);
```

### 3. Firestore Permission Errors

**Check:**
- Security rules are deployed
- User is authenticated
- User owns the document being updated

**Fix:**
```bash
# Deploy security rules
firebase deploy --only firestore:rules
```

## 📊 Monitoring & Analytics

### 1. Email Metrics

- **Resend Dashboard** - Delivery rates, opens, clicks
- **Console Logs** - Detailed verification attempts
- **Error Tracking** - Failed verifications and reasons

### 2. User Metrics

- **Verification Rates** - Track completion percentages
- **Time to Verify** - Monitor user engagement
- **Resend Frequency** - Identify UX issues

### 3. System Health

- **API Response Times** - Monitor performance
- **Error Rates** - Track system reliability
- **Token Cleanup** - Expired token removal

## 🚀 Deployment Checklist

### 1. Environment Setup

- [ ] Resend account created and verified
- [ ] Domain added and verified in Resend
- [ ] API key generated and added to environment
- [ ] FROM_EMAIL and FROM_NAME configured
- [ ] NEXTAUTH_URL set to production domain

### 2. Firebase Configuration

- [ ] Firestore security rules deployed
- [ ] Collections properly indexed
- [ ] Authentication enabled
- [ ] Admin SDK configured

### 3. Application Deployment

- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] API routes accessible
- [ ] Frontend components integrated
- [ ] Email templates tested

### 4. Testing

- [ ] Registration flow tested
- [ ] Email delivery confirmed
- [ ] Verification process working
- [ ] Error handling validated
- [ ] Mobile responsiveness checked

## 📞 Support

For issues or questions:

1. **Check logs** - Console and Resend dashboard
2. **Review documentation** - This guide and code comments
3. **Test components** - Use browser dev tools
4. **Contact support** - Resend or Firebase support if needed

---

**Note:** This system is designed to be production-ready with comprehensive error handling, security measures, and user experience optimizations.