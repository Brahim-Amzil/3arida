# Pay What You Want - Stripe Integration

**Date:** February 4, 2026  
**Status:** ✅ COMPLETE

---

## 🎯 Overview

Integrated Stripe payment processing into the "Pay What You Want" (PWYW) donation component. Users can now voluntarily support the platform with real payments during the beta launch.

---

## ✅ What Was Implemented

### 1. Donation Payment Intent API

**File Created:** `src/app/api/stripe/create-donation-intent/route.ts`

**What it does:**

- Creates Stripe payment intent specifically for donations
- Accepts amount, userId, and userName
- Adds metadata to track donation type
- Uses MAD (Moroccan Dirham) currency
- Shows "ARIDA DONATION" on bank statements

**API Endpoint:** `POST /api/stripe/create-donation-intent`

**Request:**

```json
{
  "amount": 50,
  "userId": "user123",
  "userName": "Ahmed"
}
```

**Response:**

```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

### 2. Updated PWYW Component

**File Modified:** `src/components/payments/PayWhatYouWant.tsx`

**New Features:**

- ✅ Stripe Elements integration
- ✅ Payment form with card input
- ✅ Loading states during payment processing
- ✅ Error handling with Arabic messages
- ✅ Success confirmation
- ✅ Cancel option
- ✅ User authentication integration

**User Flow:**

1. User selects amount (20, 50, 100, 200 DH) or enters custom amount
2. Clicks "ساهم الآن" (Donate Now)
3. Payment form appears with Stripe card input
4. User enters card details
5. Clicks "تأكيد المساهمة - X DH" (Confirm Donation)
6. Payment processed via Stripe
7. Success message shown: "شكراً جزيلاً!" (Thank you very much!)

---

## 🎨 UI States

### State 1: Amount Selection

```
┌─────────────────────────────────────────┐
│  💝 ساهم في دعم المنصة                   │
│                                         │
│  [20 DH] [50 DH] [100 DH] [200 DH]     │
│                                         │
│  أو أدخل مبلغاً آخر: [____] DH          │
│                                         │
│  [ساهم الآن]                            │
└─────────────────────────────────────────┘
```

### State 2: Payment Form

```
┌─────────────────────────────────────────┐
│  💝 إتمام المساهمة                      │
│  المبلغ: 50 DH                          │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Card Number: [____________]       │  │
│  │ Expiry: [__/__]  CVC: [___]      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [تأكيد المساهمة - 50 DH]  [إلغاء]     │
└─────────────────────────────────────────┘
```

### State 3: Success

```
┌─────────────────────────────────────────┐
│              🙏                         │
│                                         │
│         شكراً جزيلاً!                   │
│                                         │
│  مساهمتك تساعدنا في تطوير المنصة       │
│  وخدمة المجتمع بشكل أفضل               │
└─────────────────────────────────────────┘
```

---

## 🔧 Technical Details

### Stripe Configuration

**Environment Variables Required:**

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

**Currency:** MAD (Moroccan Dirham)  
**Amount Format:** Multiplied by 100 for Stripe (e.g., 50 DH = 5000 cents)  
**Locale:** Arabic (ar)  
**Theme:** Purple (#9333ea) to match PWYW component

### Payment Metadata

Each donation includes:

```json
{
  "type": "donation",
  "userId": "user123",
  "userName": "Ahmed",
  "donatedAt": "2026-02-04T10:30:00.000Z"
}
```

This allows tracking donations in Stripe dashboard and future analytics.

---

## 🧪 Testing

### Test with Stripe Test Cards

**Successful Payment:**

```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
```

**Declined Payment:**

```
Card: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

**Requires Authentication (3D Secure):**

```
Card: 4000 0027 6000 3184
Expiry: Any future date
CVC: Any 3 digits
```

### Testing Steps

1. **Go to success page after creating free petition:**
   - http://localhost:3001/petitions/success?id=xxx

2. **Scroll to PWYW component**

3. **Select amount:** Click "50 DH"

4. **Click "ساهم الآن"**
   - Should show loading state
   - Should fetch payment intent from API
   - Should show payment form

5. **Enter test card:** 4242 4242 4242 4242

6. **Click "تأكيد المساهمة - 50 DH"**
   - Should process payment
   - Should show success message

7. **Check Stripe Dashboard:**
   - Go to https://dashboard.stripe.com/test/payments
   - Should see payment for 50 MAD
   - Metadata should show donation type

---

## 💰 Stripe Dashboard

### Where to View Donations

1. **Payments:** https://dashboard.stripe.com/test/payments
   - See all donation transactions
   - Filter by metadata: `type=donation`

2. **Payment Details:**
   - Amount in MAD
   - User information (userId, userName)
   - Timestamp
   - Card details (last 4 digits)

3. **Metadata Fields:**
   - `type`: "donation"
   - `userId`: User's Firebase UID
   - `userName`: User's display name
   - `donatedAt`: ISO timestamp

---

## 🔒 Security

### Payment Security

- ✅ Stripe handles all card data (PCI compliant)
- ✅ No card details stored on our servers
- ✅ Payment intent created server-side
- ✅ Client secret used for one-time payment only

### User Privacy

- ✅ User ID and name stored in metadata (for tracking)
- ✅ Anonymous donations supported (userId: "anonymous")
- ✅ No email required for donation

---

## 📊 Future Enhancements

### Optional Improvements:

1. **Donation Tracking:**
   - Store donations in Firestore
   - Show donation history in user profile
   - Display total donations on platform

2. **Donor Recognition:**
   - "Top Supporters" badge
   - Thank you page with donor names (opt-in)
   - Monthly donor newsletter

3. **Recurring Donations:**
   - Monthly subscription option
   - "Become a Patron" tier
   - Automatic billing

4. **Analytics:**
   - Total donations dashboard
   - Average donation amount
   - Donation trends over time

---

## ✅ Status

- [x] Donation API endpoint created
- [x] Stripe integration in PWYW component
- [x] Payment form with card input
- [x] Loading and error states
- [x] Success confirmation
- [x] Arabic localization
- [x] User authentication integration
- [x] Metadata tracking

**Ready for testing!** 🚀

---

## 🧪 Quick Test

1. Create a free petition (Beta launch)
2. Go to success page
3. See PWYW component
4. Select 50 DH
5. Enter test card: 4242 4242 4242 4242
6. Complete payment
7. See success message
8. Check Stripe dashboard for payment

**Dev Server:** http://localhost:3001
