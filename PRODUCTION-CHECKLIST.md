# 🚀 Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Configuration

- [ ] `.env.production.local` created with all required values
- [ ] Firebase project configured for production
- [ ] Stripe live API keys configured
- [ ] Domain name purchased and configured (3arida.ma)
- [ ] SSL certificate ready (handled by Firebase Hosting)

### ✅ Code Quality & Testing

- [ ] All tests passing (`npm run test`)
- [ ] Type checking passed (`npm run type-check`)
- [ ] Linting passed (`npm run lint`)
- [ ] End-to-end tests passed (`npm run test:e2e`)
- [ ] Performance audit completed (`npm run performance:audit`)

### ✅ Security Configuration

- [ ] Firestore security rules reviewed and deployed
- [ ] Firebase Storage rules configured
- [ ] Content Security Policy headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] XSS protection enabled

### ✅ Firebase Setup

- [ ] Firebase project upgraded to Blaze plan
- [ ] Firestore indexes deployed
- [ ] Storage CORS configured
- [ ] Authentication providers enabled
- [ ] Analytics configured (optional)

### ✅ Stripe Configuration

- [ ] Stripe account verified
- [ ] Live API keys obtained
- [ ] Webhooks configured for production domain
- [ ] Products created for petition tiers
- [ ] Payment methods tested

## Deployment Process

### 1. Final Pre-Deployment Checks

```bash
# Run comprehensive checks
npm run predeploy

# Build and analyze bundle
npm run build:analyze

# Test production build locally
npm run build && npm run start
```

### 2. Deploy Backend Services

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```

### 3. Deploy Frontend

```bash
# Deploy to production
npm run deploy:production

# Or use the deployment script
./deploy.sh
```

### 4. Post-Deployment Verification

```bash
# Check health endpoint
curl https://3arida.ma/api/health

# Run smoke tests
curl -f https://3arida.ma/
curl -f https://3arida.ma/petitions
curl -f https://3arida.ma/auth/login
```

## Post-Deployment Checklist

### ✅ Functionality Testing

- [ ] User registration works
- [ ] Email verification works
- [ ] Google OAuth works
- [ ] Petition creation works
- [ ] File upload works
- [ ] Petition signing works
- [ ] Phone verification works
- [ ] QR code generation works
- [ ] Payment processing works
- [ ] Admin dashboard accessible
- [ ] Moderation features work

### ✅ Performance Verification

- [ ] Page load times < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Images optimized and loading
- [ ] Caching working properly
- [ ] CDN serving static assets

### ✅ Security Verification

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] Authentication working
- [ ] Authorization rules enforced
- [ ] File upload restrictions working
- [ ] Rate limiting active

### ✅ Monitoring Setup

- [ ] Health checks responding
- [ ] Error tracking working
- [ ] Performance monitoring active
- [ ] Analytics collecting data
- [ ] Alerts configured

### ✅ Business Logic Testing

- [ ] Free tier (2.5K signatures) works
- [ ] Paid tiers work correctly
- [ ] QR upgrade (10 MAD) works
- [ ] Signature counting accurate
- [ ] Petition approval workflow works
- [ ] Email notifications work (if enabled)

## Production Environment Variables

### Required Variables

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://3arida.ma
NEXT_PUBLIC_APP_NAME=3arida

# Firebase (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Security
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://3arida.ma
```

### Optional Variables

```bash
# Analytics & Monitoring
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_QR_UPGRADES=true
NEXT_PUBLIC_ENABLE_PAYMENT_PROCESSING=true
NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS=false
```

## Monitoring & Maintenance

### Daily Checks

- [ ] Check error logs in Firebase Console
- [ ] Monitor Stripe dashboard for payments
- [ ] Review Google Analytics for traffic
- [ ] Check health endpoint status

### Weekly Checks

- [ ] Review Firebase usage and costs
- [ ] Check Firestore performance metrics
- [ ] Review user feedback and support requests
- [ ] Monitor security alerts

### Monthly Checks

- [ ] Update dependencies
- [ ] Review and update security rules
- [ ] Performance audit
- [ ] Backup verification
- [ ] Cost optimization review

## Rollback Procedure

If issues are detected after deployment:

### 1. Immediate Rollback

```bash
# Rollback to previous Firebase Hosting version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

### 2. Code Rollback

```bash
# Revert to previous commit
git revert HEAD
npm run deploy:production
```

### 3. Database Rollback

- Firestore: Use Firebase Console to restore from backup
- Storage: Restore files from backup if needed

## Emergency Contacts

### Technical Issues

- Firebase Support: https://firebase.google.com/support
- Stripe Support: https://support.stripe.com
- Domain Registrar: [Your domain provider]

### Monitoring Alerts

- Health Check Failures: Check `/api/health` endpoint
- Payment Issues: Check Stripe dashboard
- High Error Rates: Check Firebase Console logs

## Success Metrics

### Performance Targets

- Page Load Time: < 3 seconds
- Lighthouse Score: > 90
- Uptime: > 99.9%
- Error Rate: < 0.1%

### Business Metrics

- User Registration Rate
- Petition Creation Rate
- Signature Conversion Rate
- Payment Success Rate
- User Retention Rate

## Documentation Links

- [Deployment Guide](./DEPLOYMENT.md)
- [Firebase Console](https://console.firebase.google.com)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Google Analytics](https://analytics.google.com)
- [Project Repository](https://github.com/your-org/3arida-app)

---

## 🎉 Production Launch Complete!

Once all items are checked, your 3arida petition platform is ready to serve users in Morocco and beyond!

**Remember to:**

- Monitor the application closely for the first 24-48 hours
- Have the rollback procedure ready
- Keep the team informed of the launch status
- Celebrate the successful deployment! 🎊
