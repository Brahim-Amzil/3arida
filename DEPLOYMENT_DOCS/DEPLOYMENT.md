# 3arida Petition Platform - Production Deployment Guide

## 🚀 **Overview**

This guide covers the complete production deployment process for the 3arida petition platform using Firebase Hosting, Firestore, and Stripe payments.

## 📋 **Prerequisites**

### Required Accounts & Services

- [x] Firebase project with Blaze plan (for production usage)
- [x] Stripe account with live API keys
- [x] Domain name (3arida.ma) configured
- [x] Node.js 18+ installed locally
- [x] Firebase CLI installed (`npm install -g firebase-tools`)

### Required Environment Variables

Create `.env.production.local` with your production values:

```bash
# Copy from .env.production and update with real values
cp .env.production .env.production.local
```

## 🔧 **Pre-Deployment Setup**

### 1. Firebase Project Configuration

```bash
# Login to Firebase
firebase login

# Initialize project (if not done)
firebase init

# Select:
# - Hosting
# - Firestore
# - Storage
# - Functions (optional)
```

### 2. Firestore Security Rules

Deploy production-ready Firestore rules:

```bash
firebase deploy --only firestore:rules
```

### 3. Storage Rules

Deploy Firebase Storage rules:

```bash
firebase deploy --only storage
```

### 4. Firestore Indexes

Deploy required indexes for optimal query performance:

```bash
firebase deploy --only firestore:indexes
```

## 🏗️ **Build Process**

### 1. Pre-deployment Checks

```bash
# Run all tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint

# Build analysis (optional)
npm run build:analyze
```

### 2. Production Build

```bash
# Build for production with static export
npm run build:export
```

This creates an optimized static build in the `out/` directory.

## 🚀 **Deployment Steps**

### Option 1: Full Deployment

```bash
# Deploy everything (hosting + backend services)
npm run deploy:all
```

### Option 2: Staged Deployment

```bash
# 1. Deploy backend services first
npm run deploy:firestore
npm run deploy:storage

# 2. Deploy frontend
npm run deploy:production
```

### Option 3: Staging Deployment

```bash
# Deploy to staging environment first
npm run deploy:staging
```

## 🔐 **Security Configuration**

### 1. Firestore Security Rules

Ensure production rules are restrictive:

```javascript
// Example: Petition creation requires verified email
allow create: if request.auth != null
  && request.auth.token.email_verified == true
  && isValidPetition(request.resource.data);
```

### 2. Storage Security Rules

Configure file upload restrictions:

```javascript
// 10MB limit for petition media
allow write: if request.auth != null
  && resource.size < 10 * 1024 * 1024;
```

### 3. CORS Configuration

Update Firebase Storage CORS if needed:

```json
[
  {
    "origin": ["https://3arida.ma"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## 💳 **Stripe Configuration**

### 1. Production API Keys

Update environment variables with live Stripe keys:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### 2. Webhook Configuration

Set up Stripe webhooks for production:

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://3arida.ma/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`

### 3. Product Configuration

Create Stripe products for petition tiers:

```bash
# Basic Tier (2.5K-5K signatures) - 49 MAD
# Premium Tier (5K-10K signatures) - 79 MAD
# Enterprise Tier (10K+ signatures) - Custom pricing
```

## 🌐 **Domain Configuration**

### 1. Firebase Hosting Domain

```bash
# Add custom domain
firebase hosting:channel:deploy production --expires 30d

# Configure domain in Firebase Console:
# Hosting → Add custom domain → 3arida.ma
```

### 2. DNS Configuration

Add these DNS records:

```
Type: A
Name: @
Value: 151.101.1.195, 151.101.65.195

Type: CNAME
Name: www
Value: 3arida.ma
```

### 3. SSL Certificate

Firebase automatically provisions SSL certificates for custom domains.

## 📊 **Monitoring & Analytics**

### 1. Firebase Analytics

Enable Google Analytics in Firebase Console:

```javascript
// Analytics is automatically initialized in production
// with NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### 2. Performance Monitoring

Enable Firebase Performance Monitoring:

```bash
# Install Firebase Performance
npm install firebase/performance
```

### 3. Error Monitoring (Optional)

Set up Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

## 🔄 **CI/CD Pipeline (Optional)**

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build
        run: npm run build:export

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 🧪 **Post-Deployment Testing**

### 1. Smoke Tests

```bash
# Test critical paths
curl -f https://3arida.ma/
curl -f https://3arida.ma/petitions
curl -f https://3arida.ma/auth/login
```

### 2. Performance Audit

```bash
# Run Lighthouse audit
npm run performance:audit
```

### 3. End-to-End Tests

```bash
# Run E2E tests against production
PLAYWRIGHT_BASE_URL=https://3arida.ma npm run test:e2e
```

## 🚨 **Rollback Procedure**

If deployment issues occur:

```bash
# Rollback to previous version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live

# Or deploy previous build
git checkout previous-commit
npm run deploy:production
```

## 📈 **Scaling Considerations**

### 1. Firestore Scaling

- Monitor read/write operations
- Optimize queries with proper indexing
- Consider Firestore pricing tiers

### 2. Storage Scaling

- Monitor storage usage and bandwidth
- Implement CDN for static assets
- Consider image optimization service

### 3. Hosting Scaling

Firebase Hosting automatically scales, but monitor:

- Bandwidth usage
- Request volume
- Geographic distribution

## 🔧 **Maintenance**

### Regular Tasks

1. **Weekly**: Review Firebase usage and costs
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Performance audit and optimization
4. **Annually**: Review and update security rules

### Monitoring Dashboards

Set up monitoring for:

- Application errors (Firebase Crashlytics)
- Performance metrics (Firebase Performance)
- User analytics (Google Analytics)
- Payment processing (Stripe Dashboard)

## 📞 **Support & Troubleshooting**

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **Deployment Errors**: Verify Firebase CLI authentication
3. **Domain Issues**: Check DNS propagation (24-48 hours)
4. **Payment Issues**: Verify Stripe webhook configuration

### Debug Commands

```bash
# Check Firebase project status
firebase projects:list

# View deployment history
firebase hosting:channel:list

# Check Firestore indexes
firebase firestore:indexes

# View logs
firebase functions:log
```

## 🎉 **Go Live Checklist**

- [ ] All tests passing
- [ ] Production environment variables configured
- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] Stripe webhooks configured and tested
- [ ] Custom domain configured with SSL
- [ ] Analytics and monitoring enabled
- [ ] Performance audit completed
- [ ] Backup and rollback procedures tested
- [ ] Team notified of go-live

---

**🚀 Ready for Production!**

Your 3arida petition platform is now ready to serve users in Morocco and beyond!
