# Appeals System - Deployment Guide

## Overview

This guide covers the deployment of the Appeals Management System to production.

## Pre-Deployment Checklist

### ✅ Code Complete

- [x] All TypeScript types defined
- [x] Firestore security rules added
- [x] Firestore indexes configured
- [x] Appeals service implemented
- [x] Email templates created
- [x] API endpoints implemented (4 endpoints)
- [x] Creator UI components built
- [x] Admin UI components built
- [x] Export functionality added
- [x] Security vulnerabilities patched (CVE-2025-66478)

### ✅ Dependencies Updated

- [x] Next.js upgraded to 14.2.33 (security patch)
- [x] Firebase upgraded to 12.6.0
- [x] fast-check installed for property-based testing
- [x] All production dependencies secure (0 vulnerabilities)

## Deployment Steps

### Step 1: Deploy Firestore Security Rules

```bash
cd 3arida-app
firebase deploy --only firestore:rules
```

**What this does:**

- Deploys the updated `firestore.rules` file
- Adds security rules for the `appeals` collection
- Enforces role-based access control

**Verify:**

```bash
# Check Firebase console
# Navigate to: Firestore Database > Rules
# Confirm appeals collection rules are present
```

### Step 2: Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

**What this does:**

- Creates composite indexes for appeals queries
- Indexes created:
  - `creatorId + status + createdAt` (for creator filtering)
  - `status + createdAt` (for moderator filtering)
  - `petitionId + status` (for checking existing appeals)

**Verify:**

```bash
# Check Firebase console
# Navigate to: Firestore Database > Indexes
# Confirm all 3 appeals indexes are created
```

**Note:** Index creation can take 5-15 minutes. Wait for all indexes to show "Enabled" status before proceeding.

### Step 3: Deploy Application Code

```bash
# Build the application
npm run build

# Deploy to production
npm run deploy:production

# Or deploy everything at once
npm run deploy:all
```

**What this does:**

- Builds optimized production bundle
- Deploys to Firebase Hosting or Vercel
- Makes appeals system available to users

### Step 4: Verify Email Configuration

Ensure email environment variables are set:

```bash
# Required environment variables
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=contact@3arida.ma
CONTACT_EMAIL=3aridapp@gmail.com
```

**For Vercel:**

```bash
vercel env add RESEND_API_KEY
vercel env add EMAIL_FROM
vercel env add CONTACT_EMAIL
```

**For Firebase:**

```bash
firebase functions:config:set resend.api_key="your_key"
firebase functions:config:set email.from="contact@3arida.ma"
firebase functions:config:set email.contact="3aridapp@gmail.com"
```

### Step 5: Test in Production

#### Test Creator Flow:

1. Log in as a petition creator
2. Navigate to a paused/rejected petition
3. Click "Contact Moderator" button
4. Submit an appeal
5. Verify appeal appears in dashboard
6. Check email notification was sent to moderators

#### Test Moderator Flow:

1. Log in as moderator/admin
2. Navigate to `/admin/appeals`
3. Verify appeals list loads
4. Click on an appeal
5. Reply to the appeal
6. Update appeal status
7. Verify creator receives email notification

#### Test Export:

1. As moderator, open an appeal detail page
2. Click "JSON" export button
3. Verify file downloads with complete data
4. Click "CSV" export button
5. Verify CSV format is correct

## Post-Deployment Monitoring

### Metrics to Monitor:

1. **Appeal Creation Rate**
   - Track number of appeals created per day
   - Alert if sudden spike (may indicate moderation issues)

2. **Email Delivery Success Rate**
   - Monitor Resend dashboard for delivery failures
   - Check bounce rates

3. **API Response Times**
   - Monitor `/api/appeals/*` endpoints
   - Alert if response time > 2 seconds

4. **Error Rates**
   - Check Firebase console for errors
   - Monitor Vercel/hosting logs

### Firebase Console Queries:

```javascript
// Count appeals by status
db.collection('appeals')
  .where('status', '==', 'pending')
  .get()
  .then((snap) => console.log('Pending:', snap.size));

// Recent appeals
db.collection('appeals')
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get()
  .then((snap) => snap.forEach((doc) => console.log(doc.data())));
```

## Rollback Plan

If critical issues are discovered:

### Quick Rollback (Frontend Only):

```bash
# Revert to previous deployment
vercel rollback

# Or for Firebase
firebase hosting:rollback
```

### Full Rollback (Including Rules):

```bash
# Restore previous firestore.rules from git
git checkout HEAD~1 -- firestore.rules
firebase deploy --only firestore:rules

# Restore previous code
git revert HEAD
npm run deploy:production
```

**Note:** Do NOT delete appeals data or indexes during rollback. This preserves existing appeals for when the fix is deployed.

## Troubleshooting

### Issue: Appeals not appearing in list

**Solution:**

- Check Firestore indexes are fully built (not "Building")
- Verify user authentication is working
- Check browser console for errors

### Issue: Email notifications not sending

**Solution:**

- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for API errors
- Verify EMAIL_FROM domain is verified in Resend

### Issue: Permission denied errors

**Solution:**

- Verify Firestore rules deployed correctly
- Check user role in Firestore (users collection)
- Ensure moderator role is set for admin users

### Issue: Export not working

**Solution:**

- Check browser allows downloads
- Verify user has permission to view appeal
- Check API endpoint logs for errors

## Success Criteria

✅ Appeals system is successfully deployed when:

- [ ] Firestore rules deployed and active
- [ ] All 3 indexes created and enabled
- [ ] Application deployed and accessible
- [ ] Creator can submit appeals
- [ ] Moderators can view and respond to appeals
- [ ] Email notifications are being sent
- [ ] Export functionality works
- [ ] No errors in production logs
- [ ] Response times < 2 seconds

## Support

For issues or questions:

- Check Firebase console logs
- Review Vercel/hosting logs
- Check Resend email delivery logs
- Review this deployment guide

---

**Deployed**: [Date]
**Version**: 1.0.0
**Status**: Ready for Production ✅
