# Influencer Coupon System - Quick Start Guide

## What Was Implemented

### ✅ Contact Form Enhancement

The contact form (`/contact`) now handles influencer coupon requests with:

- Special form fields for influencer verification
- Platform selection (Instagram, TikTok, YouTube, X, Facebook, Snapchat)
- Account URL input
- Follower count input
- Discount tier selection (10%, 15%, 20%, 30%)
- URL parameter detection for pre-filling

### ✅ Email Notifications

Admin receives beautifully formatted emails with:

- Purple highlighted section for influencer info
- Clickable account URL for verification
- Clear action steps in yellow box
- All verification details in one place

### ✅ User Entry Points

Two ways influencers can request coupons:

1. **During Petition Creation**
   - Select "Influencer" as publisher type
   - Alert appears with "اطلب كوبون الخصم" button
   - Click → Redirects to contact form

2. **From Influencers Page**
   - Visit `/influencers`
   - Click any discount tier box (10%, 15%, 20%, 30%)
   - Redirects to contact form with tier pre-filled

## How to Test

### Test Entry Point 1: Petition Creation

```
1. Go to /petitions/create
2. Select "Influencer" as publisher type
3. See purple alert box appear
4. Click "اطلب كوبون الخصم"
5. Should redirect to /contact?reason=influencer-coupon
6. Form should show influencer fields
```

### Test Entry Point 2: Influencers Page

```
1. Go to /influencers
2. Click on "10% خصم" tier box
3. Should redirect to /contact?reason=influencer-coupon&tier=10
4. Form should show influencer fields
5. Discount tier should be pre-selected to 10%
```

### Test Form Submission

```
1. Fill in all required fields:
   - Name
   - Email
   - Discount Tier (should be pre-filled)
   - Platform (e.g., Instagram)
   - Account URL (e.g., https://instagram.com/username)
   - Follower Count (e.g., 50,000)
   - Subject (auto-filled)
   - Message
2. Click "إرسال الرسالة"
3. Should see success message
4. Check admin email (3aridapp@gmail.com)
5. Email should have purple section with all influencer info
```

## Admin Workflow

When you receive an influencer coupon request:

1. **Open Email** - Look for purple section with influencer info
2. **Click Account URL** - Verify the account exists
3. **Check Follower Count** - Confirm it matches claimed amount
4. **Verify Tier Eligibility** - Ensure follower count qualifies for requested discount
5. **Create Coupon Code** (manual for MVP):
   - Example: `INFLUENCER10-USERNAME`
   - Note the discount percentage
6. **Reply to Email** with coupon code
7. **Influencer Uses Code** at payment step (to be implemented next)

## Discount Tiers Reference

| Followers | Discount | Tier Code |
| --------- | -------- | --------- |
| 30K-50K   | 10%      | tier=10   |
| 50K-100K  | 15%      | tier=15   |
| 100K-500K | 20%      | tier=20   |
| 500K+     | 30%      | tier=30   |

## What's Next?

### Still To Implement:

1. **Coupon Input Field** at payment/review step in petition creation
2. **Coupon Validation Logic** (simple hardcoded object for MVP)
3. **Discount Calculation** and display
4. **Coupon Usage Tracking** (mark as used after payment)

### Future Enhancements:

- Admin panel for coupon management
- Automatic coupon generation
- Expiration dates
- Usage limits
- Analytics dashboard

## Files Changed

### Frontend

- `src/app/contact/page.tsx` - Enhanced contact form
- `src/app/petitions/create/page.tsx` - Coupon alert (already done)
- `src/app/influencers/page.tsx` - Clickable tier boxes (already done)

### Backend

- `src/app/api/contact/route.ts` - Email template with influencer section

### Translations

- `messages/ar.json` - Added influencer.couponAlert translations

## Quick Links

- Contact Form: `/contact`
- Influencers Page: `/influencers`
- Petition Creation: `/petitions/create`
- Full Documentation: `INFLUENCER-COUPON-SYSTEM.md`

## Support

If you encounter any issues:

1. Check browser console for errors
2. Verify all required fields are filled
3. Ensure email service (Resend) is configured
4. Check admin email inbox (3aridapp@gmail.com)
