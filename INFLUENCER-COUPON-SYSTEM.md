# Influencer Coupon Request System - Implementation Complete

## Overview

Implemented a complete influencer coupon request system that allows influencers to request discount coupons (10-30% off) before creating petitions. The system uses manual verification by admin to ensure authenticity.

## User Flow

### 1. Influencer Discovers Discount Opportunity

**Two Entry Points:**

#### A. During Petition Creation (Step 1)

- When user selects "Influencer" as publisher type
- Alert box appears with gradient purple/blue background
- Shows title: "كمؤثر، يمكنك الحصول على خصم!"
- Description explains they can get up to 30% discount
- Button: "اطلب كوبون الخصم" → Links to contact form

#### B. From Influencers Page

- Visit `/influencers` page
- Four discount tier boxes are now clickable:
  - 10% (30K-50K followers)
  - 15% (50K-100K followers)
  - 20% (100K-500K followers)
  - 30% (500K+ followers)
- Clicking any tier → Redirects to contact form with pre-filled tier

### 2. Contact Form Submission

**URL Parameters:**

- `?reason=influencer-coupon` - Auto-selects reason
- `&tier=X` - Pre-fills discount tier (10, 15, 20, or 30)

**Special Form Fields (shown only for influencer-coupon reason):**

- **Discount Tier** (dropdown, pre-filled if from tier box)
  - 10% خصم (30K-50K متابع)
  - 15% خصم (50K-100K متابع)
  - 20% خصم (100K-500K متابع)
  - 30% خصم (500K+ متابع)

- **Platform** (dropdown)
  - Instagram
  - TikTok
  - YouTube
  - X (Twitter)
  - Facebook
  - Snapchat
  - Other

- **Account URL** (text input, dir="ltr")
  - Placeholder: "https://instagram.com/username"
  - Required, validated as URL

- **Follower Count** (text input)
  - Placeholder: "مثال: 50,000"
  - Required

**Visual Design:**

- Purple/blue gradient background
- 2px purple border
- Star emoji (🌟) in header
- Info box explaining next steps
- All fields required

### 3. Admin Receives Email

**Email Template Features:**

- Special purple section for influencer info
- Highlighted discount tier (18px, bold, purple)
- Clickable account URL
- Bold follower count
- Yellow action box with instructions:
  1. Verify account and follower count
  2. Create coupon code with X% discount
  3. Send code to influencer's email

### 4. Admin Verification Process

1. Admin receives email at `3aridapp@gmail.com`
2. Clicks account URL to verify
3. Checks follower count matches claimed amount
4. If qualified:
   - Creates coupon code (manual process for MVP)
   - Sends code via email reply
5. If not qualified:
   - Replies explaining why

### 5. Influencer Uses Coupon

**Next Steps (To Be Implemented):**

- Add coupon code input field at payment step in petition creation
- Implement coupon validation logic
- Apply discount to payment amount

## Files Modified

### Frontend Components

1. **src/app/contact/page.tsx**
   - Added influencer-coupon to contact reasons
   - Added social platform options
   - Added discount tier options
   - URL parameter detection on mount
   - Special form section for influencer verification
   - Updated form state to include new fields

2. **src/app/petitions/create/page.tsx**
   - Coupon alert already implemented (from previous session)
   - Shows when publisherType === 'Influencer'
   - Links to `/contact?reason=influencer-coupon`

3. **src/app/influencers/page.tsx**
   - Made discount tier boxes clickable (from previous session)
   - Each links to contact form with tier parameter

### Backend API

4. **src/app/api/contact/route.ts**
   - Added 'influencer-coupon' to reasonLabels
   - Added platformLabels mapping
   - Validation for influencer fields
   - Special email template section for influencer info
   - Highlighted action box for admin

### Translations

5. **messages/ar.json**
   - Added `influencer.couponAlert` section:
     - title: "كمؤثر، يمكنك الحصول على خصم!"
     - description: Explains discount and verification process
     - button: "اطلب كوبون الخصم"

### Header

6. **src/components/layout/Header.tsx**
   - Added star icon (🌟) to Influencers nav link (from previous session)

## Technical Details

### Form State

```typescript
{
  // Existing fields
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  petitionCode: string;
  reportDetails: string;

  // New influencer fields
  platform: string;
  accountUrl: string;
  followerCount: string;
  discountTier: string;
}
```

### URL Parameters

- Detected using `URLSearchParams` on component mount
- Auto-fills form when `reason=influencer-coupon`
- Pre-selects tier when `tier` parameter present

### Validation

- All influencer fields required when reason is 'influencer-coupon'
- Account URL validated as proper URL format
- Backend validates all fields before sending email

## Discount Tiers

| Followers | Discount | Tier Value |
| --------- | -------- | ---------- |
| 30K-50K   | 10%      | 10         |
| 50K-100K  | 15%      | 15         |
| 100K-500K | 20%      | 20         |
| 500K+     | 30%      | 30         |

## Next Steps (Not Yet Implemented)

### 1. Coupon Input at Payment Step

- Add coupon code input field in petition creation review/payment step
- Show discount amount when valid coupon applied
- Update total price calculation

### 2. Coupon Validation

For MVP, use simple hardcoded object:

```typescript
const COUPONS = {
  INFLUENCER10: { discount: 10, used: false },
  INFLUENCER15: { discount: 15, used: false },
  INFLUENCER20: { discount: 20, used: false },
  INFLUENCER30: { discount: 30, used: false },
};
```

### 3. Coupon Management (Future)

- Admin panel to create/manage coupons
- Track coupon usage
- Set expiration dates
- Limit number of uses

## Benefits for Influencers

1. **Financial Incentive**: Up to 30% discount on petition creation
2. **Free Promotion**: Influencer banner on published petitions
3. **Verified Badge**: Shows credibility
4. **Profile Visibility**: Photo, name, follower count displayed
5. **Direct Link**: "Visit Profile" button to their channel

## Testing Checklist

- [ ] Visit `/petitions/create`, select "Influencer" → Alert appears
- [ ] Click "اطلب كوبون الخصم" → Redirects to contact form
- [ ] Form pre-filled with reason and subject
- [ ] Visit `/influencers`, click 10% tier box → Redirects with tier=10
- [ ] Fill all influencer fields → Submit successfully
- [ ] Admin receives email with purple section
- [ ] Account URL is clickable in email
- [ ] Action box shows clear instructions

## Notes

- Manual verification ensures quality control
- Simple coupon system avoids credit complications
- Influencers must request coupon BEFORE creating petition
- 24-48 hour turnaround for coupon delivery
- Admin can verify follower count before issuing coupon

## Status

✅ **COMPLETE** - Contact form and email system ready
⏳ **PENDING** - Coupon input and validation at payment step
