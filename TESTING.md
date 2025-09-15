# Testing Guide for 3arida Platform

This guide covers how to test the 3arida petition platform locally and in different environments.

## Prerequisites

Before testing, make sure you have:

1. **Node.js 18+** installed
2. **Firebase CLI** installed (`npm install -g firebase-tools`)
3. **Dependencies** installed (`npm install`)

## Environment Setup

### 1. Install Dependencies

```bash
cd 3arida-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=3arida

# Testing Configuration
NODE_ENV=test
```

### 3. Firebase Emulators (Recommended for Testing)

Start Firebase emulators for local testing:

```bash
# Start emulators
npm run firebase:emulators

# Or manually
firebase emulators:start --only auth,firestore,storage
```

This will start:

- **Authentication Emulator** on http://localhost:9099
- **Firestore Emulator** on http://localhost:8080
- **Storage Emulator** on http://localhost:9199

## Testing Types

### 1. Unit Tests

Test individual functions and components:

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 2. Integration Tests

Test Firebase operations and API integrations:

```bash
# Run integration tests
npm run test:integration
```

### 3. End-to-End Tests

Test complete user workflows:

```bash
# Run e2e tests
npm run test:e2e
```

### 4. Type Checking

Ensure TypeScript types are correct:

```bash
npm run type-check
```

## Manual Testing Scenarios

### Authentication Flow

1. **Registration**

   - Go to `/auth/register`
   - Fill in name, email, password
   - Check email verification flow
   - Test Google OAuth registration

2. **Login**

   - Go to `/auth/login`
   - Test email/password login
   - Test Google OAuth login
   - Test "forgot password" flow

3. **Phone Verification**
   - Try signing a petition
   - Test Moroccan phone number validation
   - Test OTP verification flow

### Petition Management

1. **Create Petition**

   - Go to `/petitions/create`
   - Fill in all required fields
   - Test image upload
   - Test different pricing tiers
   - Verify petition appears in dashboard

2. **View Petitions**

   - Go to `/petitions`
   - Test filtering by category
   - Test search functionality
   - Test pagination

3. **Sign Petition**
   - Open any approved petition
   - Test phone verification
   - Verify signature count updates
   - Test duplicate signature prevention

### QR Code System

1. **QR Code Generation**
   - Go to any petition you own
   - Navigate to `/petitions/[id]/qr`
   - Test QR code preview
   - Test upgrade flow (10 MAD payment)
   - Test download functionality

### Admin Dashboard

1. **Admin Access**

   - Login as admin user
   - Go to `/admin`
   - Verify statistics display
   - Test petition moderation

2. **User Management**
   - Go to `/admin/users`
   - Test user activation/deactivation
   - Test role promotion/demotion

## Testing Checklist

### ✅ Core Features

- [ ] User registration with email verification
- [ ] User login (email/password and Google OAuth)
- [ ] Password reset functionality
- [ ] Phone verification for petition signing
- [ ] Petition creation with media upload
- [ ] Petition listing and filtering
- [ ] Petition signing with duplicate prevention
- [ ] QR code generation and upgrade
- [ ] Admin dashboard and moderation
- [ ] User role management

### ✅ Security Features

- [ ] Input validation and sanitization
- [ ] Rate limiting on sensitive operations
- [ ] Content moderation for profanity/spam
- [ ] CAPTCHA protection
- [ ] IP tracking and duplicate prevention
- [ ] Role-based access control

### ✅ Real-time Features

- [ ] Live signature count updates
- [ ] Real-time notifications
- [ ] Dashboard updates
- [ ] Petition status changes

### ✅ UI/UX

- [ ] Responsive design on mobile/tablet/desktop
- [ ] Loading states and error handling
- [ ] Form validation feedback
- [ ] Accessibility compliance
- [ ] Morocco-specific localization

## Common Issues and Solutions

### Firebase Connection Issues

If you get Firebase connection errors:

1. Check your `.env.local` file has correct values
2. Ensure Firebase project is properly configured
3. Try using Firebase emulators for local testing

### Authentication Issues

If authentication doesn't work:

1. Check Firebase Auth is enabled in console
2. Verify OAuth providers are configured
3. Check domain is added to authorized domains

### Phone Verification Issues

If phone verification fails:

1. Ensure reCAPTCHA is properly configured
2. Check phone number format (Moroccan numbers)
3. Verify Firebase Auth phone provider is enabled

### Build Issues

If the build fails:

1. Run `npm run type-check` to find TypeScript errors
2. Check all imports are correct
3. Ensure all required environment variables are set

## Performance Testing

### Load Testing

Test the platform under load:

1. **Concurrent Users**: Test with multiple users signing petitions simultaneously
2. **Database Load**: Test with large numbers of petitions and signatures
3. **File Uploads**: Test multiple image uploads at once
4. **Real-time Updates**: Test with many concurrent signature updates

### Monitoring

Monitor key metrics:

- **Response Times**: API calls should be < 500ms
- **Database Queries**: Optimize slow queries
- **Storage Usage**: Monitor file upload sizes
- **Error Rates**: Keep error rates < 1%

## Deployment Testing

### Staging Environment

Before production deployment:

1. Deploy to staging environment
2. Run full test suite against staging
3. Test with real Firebase project (not emulators)
4. Verify all environment variables are correct
5. Test payment flows with Stripe test mode

### Production Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Firebase security rules deployed
- [ ] Stripe webhooks configured
- [ ] Domain configured in Firebase Auth
- [ ] SSL certificate active
- [ ] Monitoring and logging set up

## Automated Testing in CI/CD

The platform includes GitHub Actions workflows for:

- **Unit Tests**: Run on every pull request
- **Integration Tests**: Run with Firebase emulators
- **Type Checking**: Ensure TypeScript compliance
- **Build Testing**: Verify production builds work
- **Security Scanning**: Check for vulnerabilities

## Getting Help

If you encounter issues:

1. Check the console for error messages
2. Review Firebase console for authentication/database issues
3. Check network tab for failed API calls
4. Review the logs in Firebase Functions (if using)
5. Consult the Firebase documentation for specific features

## Test Data

For testing purposes, you can use:

- **Test Email**: test@3arida.ma
- **Test Phone**: +212612345678
- **Test Categories**: Environment, Education, Health, Social Justice
- **Test Locations**: Casablanca, Rabat, Marrakech, Fez

Remember to clean up test data regularly to keep the database organized.
