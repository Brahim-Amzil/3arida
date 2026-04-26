# Cost Protection & Spike Management Guide

## 🚨 Current Risk Level: MEDIUM-HIGH

Your application is vulnerable to unexpected cost spikes. Follow this guide immediately.

---

## CRITICAL: Do These 3 Things RIGHT NOW

### 1. Firebase Budget Alerts (5 minutes)
- Go to Firebase Console > Project Settings > Usage and Billing
- Set budget alerts at: $10, $25, $50, $100
- Enable email notifications

### 2. Vercel Spending Limit (2 minutes)
- Go to Vercel Dashboard > Settings > Billing  
- Set spending limit: $20/month
- Enable email alerts

### 3. Review Firestore Rules (10 minutes)
- Check firestore.rules has size limits
- Add rate limiting checks
- Ensure authentication required for writes

---

## What Could Go Wrong

**Firebase Firestore:**
- Infinite loop reading/writing data = $$$
- Bot spam creating petitions = $$$
- Someone scraping all your data = $$$

**Firebase Storage:**
- Mass image uploads = $$$
- Large file uploads (no size limit) = $$$

**Vercel:**
- DDoS attack = $$$
- Viral traffic spike = $$$
- Inefficient API routes called repeatedly = $$$

---

## Quick Wins (Implement This Week)

### Add Rate Limiting Middleware

Create `middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map();
const LIMIT = 100; // requests per minute
const WINDOW = 60000; // 1 minute

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW });
  } else {
    limit.count++;
    if (limit.count > LIMIT) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/petitions/create'],
};
```

### Update Firestore Rules

Add to `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /petitions/{petitionId} {
      allow create: if request.auth != null 
        && request.resource.data.size() < 50000; // 50KB limit
      allow read: if true;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.creatorId;
    }
    
    match /signatures/{signatureId} {
      allow create: if request.auth != null
        && request.resource.data.size() < 5000; // 5KB limit
      allow read: if true;
    }
  }
}
```

### Update Storage Rules

Add to `storage.rules`:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /petition-images/{imageId} {
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024 // 5MB max
        && request.resource.contentType.matches('image/.*');
      allow read: if true;
    }
  }
}
```

---

## Emergency Response Plan

### If Costs Spike:

**Step 1: Stop the Bleeding (5 min)**
```bash
# Disable Firebase Functions
firebase functions:delete --force

# Deploy stricter rules
firebase deploy --only firestore:rules,storage:rules
```

**Step 2: Investigate (15 min)**
- Check Firebase Console > Usage tab
- Check Vercel Analytics for traffic patterns
- Look for suspicious IPs or patterns

**Step 3: Block Abuse**
- Add IP blocking in Vercel
- Tighten security rules further
- Consider adding Cloudflare (free tier)

---

## Free Tier Limits (Don't Exceed These)

**Firebase Spark Plan:**
- Firestore: 50K reads/day, 20K writes/day
- Storage: 1GB storage, 10GB/month transfer
- Functions: 125K invocations/month

**Vercel Hobby Plan:**
- 100GB bandwidth/month
- 6,000 build minutes/month

---

## Monitoring Setup

Install analytics:
```bash
npm install @vercel/analytics @vercel/speed-insights
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Checklist

- [ ] Firebase budget alerts set
- [ ] Vercel spending limit set  
- [ ] Firestore rules have size limits
- [ ] Storage rules have size limits
- [ ] Rate limiting middleware added
- [ ] Analytics installed
- [ ] Emergency plan documented
- [ ] Team knows what to do if spike happens

---

**Bottom Line:** You're currently vulnerable. Set budget alerts TODAY, add rate limiting THIS WEEK.
