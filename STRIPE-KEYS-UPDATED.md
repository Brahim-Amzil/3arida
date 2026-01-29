# Stripe Keys Updated - January 29, 2025

## ✅ Status: Ready to Test

Your new Stripe API keys have been successfully added to `.env.local`.

### Keys Added:

- **Publishable Key**: `pk_test_51Suz8uQcEsrvss5k...` ✅
- **Secret Key**: `sk_test_51Suz8uQcEsrvss5k...` ✅

### Dev Server Running:

- **URL**: http://localhost:3004
- **Status**: ✅ Ready

## 🧪 How to Test

1. **Open the app**: http://localhost:3004

2. **Create a petition**:
   - Go to "Start Petition" or http://localhost:3004/petitions/create
   - Fill in all the required fields
   - Choose a paid tier (69, 129, 229, or 369 MAD)
   - Complete all 6 steps

3. **Test payment with Stripe**:
   - When you reach the payment step, you'll see the Stripe payment form
   - Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., **12/25**)
   - CVC: Any 3 digits (e.g., **123**)
   - Click "Pay"

4. **Verify success**:
   - Payment should process successfully
   - You'll be redirected to success page
   - Petition will be created and sent for review

## 🎯 Test Cards

| Card Number         | Result                |
| ------------------- | --------------------- |
| 4242 4242 4242 4242 | ✅ Success            |
| 4000 0000 0000 0002 | ❌ Decline            |
| 4000 0025 0000 3155 | 🔐 Requires 3D Secure |

## 📝 What to Check

- [ ] Payment form loads correctly
- [ ] Card input works smoothly
- [ ] Test card processes successfully
- [ ] Success page shows after payment
- [ ] Petition is created in Firestore
- [ ] Payment amount is correct (69, 129, 229, or 369 MAD)

## 🚀 Next Steps After Testing

1. **If everything works locally**:
   - Add Stripe keys to Vercel environment variables
   - Deploy to production
   - Test on live site

2. **Setup Webhooks** (after deployment):
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret
   - Add to Vercel as `STRIPE_WEBHOOK_SECRET`

## 💡 Tips

- The payment form shows "Test Mode" indicator in development
- All test payments will appear in your Stripe dashboard
- No real money is charged with test cards
- You can view all test payments at: https://dashboard.stripe.com/test/payments

---

**Ready to test!** Open http://localhost:3004 and create a petition with a paid tier.
