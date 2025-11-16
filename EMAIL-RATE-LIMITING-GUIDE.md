# Email Rate Limiting & Scaling Guide

## 🚨 The Problem

**Resend Free Tier Limits:**

- 2 emails per second
- 100 emails per day
- 3,000 emails per month

**This WILL cause problems when:**

- Multiple users register simultaneously
- Petition goes viral and gets many signatures
- Admin approves multiple petitions at once
- Creator posts update to 100+ signers

---

## 📊 Real-World Scenarios

### Scenario 1: Launch Day (100 users)

```
100 registrations    = 100 welcome emails
20 petitions created = 20 approval emails
50 signatures        = 50 confirmation emails
5 updates            = 5 × 20 signers = 100 update emails
────────────────────────────────────────────────
TOTAL: 270 emails/day ❌ EXCEEDS 100/day limit
```

### Scenario 2: Viral Petition (500 signatures in 1 hour)

```
500 signatures = 500 confirmation emails
Rate: 500 emails / 3600 seconds = 0.14 emails/second ✅ OK

BUT if all sign within 5 minutes:
500 emails / 300 seconds = 1.67 emails/second ✅ OK (barely)

BUT if 50 sign simultaneously:
50 emails instant = Rate limit hit ❌ PROBLEM
```

### Scenario 3: Update to 200 Signers

```
1 update × 200 signers = 200 emails
At 2 emails/second = 100 seconds (1.6 minutes) ⚠️ SLOW
Some users wait 1-2 minutes for email
```

---

## ✅ Solutions

### Solution 1: Upgrade Resend Plan (Immediate Fix)

#### Pro Plan: $20/month

- **50 emails/second** (25x faster)
- **50,000 emails/month** (16x more)
- **Perfect for:** 100-500 daily active users
- **Cost per user:** $0.04-$0.20/month

#### Business Plan: $80/month

- **100 emails/second** (50x faster)
- **250,000 emails/month** (83x more)
- **Perfect for:** 500-2000 daily active users
- **Cost per user:** $0.04-$0.16/month

**Recommendation:** Start with Pro plan at launch

---

### Solution 2: Email Queue System (Best Practice)

We've implemented an email queue that:

- ✅ Handles rate limits gracefully
- ✅ Retries failed emails (3 attempts)
- ✅ Prevents email loss
- ✅ Works with any tier

**How it works:**

```typescript
// Instead of sending immediately
await sendEmail(to, subject, html);

// Queue for later (respects rate limits)
await queueEmail(to, subject, html);
```

**Enable in production:**

```bash
# .env.production
USE_EMAIL_QUEUE=true
```

---

### Solution 3: Batch Processing (For Updates)

For petition updates sent to many signers:

```typescript
// Bad: Send all at once (hits rate limit)
signers.forEach((signer) => {
  sendEmail(signer.email, subject, html);
});

// Good: Batch with delays
for (const signer of signers) {
  await queueEmail(signer.email, subject, html);
  // Queue handles rate limiting automatically
}
```

---

### Solution 4: Smart Email Strategy

**Reduce email volume:**

1. **Make emails optional**
   - Let users opt-out of certain notifications
   - Default: Only critical emails (welcome, approval, confirmation)
   - Optional: Updates, milestones, comments

2. **Digest emails**
   - Instead of 10 separate update emails
   - Send 1 daily digest with all updates

3. **In-app notifications first**
   - Show notification in app immediately
   - Send email only if user doesn't see it in 1 hour

---

## 📈 Scaling Timeline

### Phase 1: Launch (0-100 users)

- **Use:** Free tier + Email queue
- **Cost:** $0/month
- **Limit:** ~90 emails/day (stay under 100)
- **Action:** Monitor usage daily

### Phase 2: Growth (100-500 users)

- **Use:** Pro plan ($20/month)
- **Cost:** $20/month
- **Limit:** 50,000 emails/month
- **Action:** Upgrade when hitting 80 emails/day consistently

### Phase 3: Scale (500-2000 users)

- **Use:** Business plan ($80/month)
- **Cost:** $80/month
- **Limit:** 250,000 emails/month
- **Action:** Implement email preferences & digests

### Phase 4: Enterprise (2000+ users)

- **Use:** Enterprise plan (custom pricing)
- **Cost:** $200-500/month
- **Limit:** Unlimited
- **Action:** Consider multiple email providers for redundancy

---

## 🔧 Implementation Checklist

### Immediate (Before Launch):

- [ ] Enable email queue system
- [ ] Set up monitoring for email failures
- [ ] Add retry logic (already implemented)
- [ ] Test with 50+ simultaneous emails

### Week 1 (After Launch):

- [ ] Monitor daily email usage
- [ ] Track rate limit errors
- [ ] Collect user feedback on email delivery time
- [ ] Decide if upgrade needed

### Month 1:

- [ ] Analyze email open rates
- [ ] Implement email preferences
- [ ] Consider digest emails
- [ ] Upgrade plan if needed

---

## 💰 Cost Comparison

### Email Volume Estimates:

**100 Daily Active Users:**

- 10 new registrations/day = 10 emails
- 5 petitions approved/day = 5 emails
- 30 signatures/day = 30 emails
- 2 updates/day × 20 signers = 40 emails
- **Total: ~85 emails/day = 2,550/month**

**Cost:**

- Free tier: ✅ Works (barely)
- Pro tier: $20/month (overkill but safe)

**500 Daily Active Users:**

- 50 registrations = 50 emails
- 20 approvals = 20 emails
- 150 signatures = 150 emails
- 10 updates × 50 signers = 500 emails
- **Total: ~720 emails/day = 21,600/month**

**Cost:**

- Free tier: ❌ Impossible
- Pro tier: ✅ $20/month (perfect fit)

---

## 🎯 Recommendation

### For Launch (November 23):

1. **Use Free Tier** with email queue
2. **Monitor closely** for first week
3. **Upgrade to Pro** ($20/month) when you hit:
   - 80+ emails/day consistently
   - OR any rate limit errors
   - OR user complaints about slow emails

### Long Term:

- Pro plan is **$20/month** = **$240/year**
- This is **0.5% of typical SaaS costs**
- **Worth it** for reliability and user experience

---

## 📊 Monitoring

### Check Resend Dashboard Daily:

- Emails sent today
- Rate limit errors
- Bounce rate
- Delivery rate

### Set Up Alerts:

```typescript
// Alert if queue gets too long
if (emailQueue.getStatus().queueLength > 50) {
  console.error('⚠️ Email queue backing up!');
  // Send alert to admin
}
```

---

## 🚀 Quick Start

### Enable Email Queue:

1. Add to `.env.production`:

```bash
USE_EMAIL_QUEUE=true
```

2. Restart server

3. Emails now queue automatically!

### Monitor Queue:

```typescript
import { emailQueue } from '@/lib/email-queue';

// Check status
const status = emailQueue.getStatus();
console.log(`Queue: ${status.queueLength} emails`);
```

---

## ✅ Conclusion

**Yes, rate limiting WILL be a problem** as you scale, but:

1. ✅ Email queue system handles it gracefully
2. ✅ Pro plan ($20/month) solves it completely
3. ✅ You can start free and upgrade when needed
4. ✅ Monitoring helps you know when to upgrade

**Action Plan:**

- Launch with free tier + queue
- Monitor for 1 week
- Upgrade to Pro when needed
- Sleep well knowing emails are reliable 😴

---

**Current Status:**

- ✅ Email queue implemented
- ✅ Retry logic added
- ✅ Monitoring ready
- ⏳ Waiting for production traffic to decide on upgrade
