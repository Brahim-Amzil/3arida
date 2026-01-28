# PayPal Payment Testing Guide

## Quick Start Testing

### 1. Start Development Server

```bash
npm run dev
```

### 2. Navigate to Create Petition

```
http://localhost:3000/petitions/create
```

### 3. Fill Out Form

- Use the "Auto-fill Test Data" button (if available)
- Or manually fill all required fields
- Set target signatures to **5,000** (triggers payment)

### 4. Proceed to Payment

- Click "Proceed to Payment - 49 MAD"
- Payment modal should open

### 5. Verify Disclosures

Check that you see:

- ✅ Order summary showing 49 MAD
- ✅ Yellow box with currency disclosure
- ✅ Gray box with no-refunds policy
- ✅ PayPal buttons (gold color)

### 6. Test Payment (Sandbox)

- Click PayPal button
- PayPal popup opens showing **$4.90 USD**
- Log in with sandbox account
- Complete payment

### 7. Verify Success

- Petition should be created
- Redirected to success page
- Payment reference stored

---

## PayPal Sandbox Accounts

### Test Buyer Account

You need to create a sandbox buyer account in PayPal Developer Dashboard:

1. Go to: https://developer.paypal.com/dashboard/
2. Navigate to: **Sandbox** → **Accounts**
3. Create a **Personal** account (buyer)
4. Note the email and password

**Example**:

- Email: `sb-buyer123@personal.example.com`
- Password: `test1234`

### Test Seller Account (Already Configured)

Your app is configured with:

- Client ID: `Aa34q9Nxp4vVfvnAhzb7h3TzApGl0Cz28dBEjiAQhSYA631kmvAaB4c9cHy4OEldFwfSiu4pZpJogL1t`
- Mode: `sandbox`

---

## Test Scenarios

### Scenario 1: Successful Payment

**Steps**:

1. Fill petition form
2. Set signatures to 5,000
3. Click "Proceed to Payment"
4. Click PayPal button
5. Log in with sandbox buyer account
6. Confirm payment

**Expected**:

- ✅ Payment completes
- ✅ Petition created
- ✅ Redirected to success page
- ✅ Payment ID stored

### Scenario 2: Payment Cancellation

**Steps**:

1. Fill petition form
2. Set signatures to 5,000
3. Click "Proceed to Payment"
4. Click PayPal button
5. Click "Cancel" in PayPal popup

**Expected**:

- ✅ Error message: "Payment was cancelled"
- ✅ User stays on payment modal
- ✅ Can try again

### Scenario 3: Free Petition (No Payment)

**Steps**:

1. Fill petition form
2. Set signatures to 1,000 (free tier)
3. Click "Create Petition"

**Expected**:

- ✅ No payment modal
- ✅ Petition created immediately
- ✅ Redirected to success page

### Scenario 4: Card Payment (Without PayPal Account)

**Steps**:

1. Fill petition form
2. Set signatures to 5,000
3. Click "Proceed to Payment"
4. Click "Debit or Credit Card" button
5. Enter test card details

**Expected**:

- ✅ Card form appears
- ✅ Payment completes
- ✅ Petition created

**Test Card** (Sandbox):

- Card: `4032039668851305`
- Expiry: Any future date
- CVV: Any 3 digits

---

## Verification Checklist

### Visual Checks

- [ ] Payment modal opens correctly
- [ ] Order summary shows correct MAD amount
- [ ] Currency disclosure box is visible (yellow)
- [ ] USD amount is calculated correctly (MAD / 10)
- [ ] No-refunds policy is visible (gray box)
- [ ] PayPal buttons render (gold color)
- [ ] All text is translated (Arabic/French)

### Functional Checks

- [ ] PayPal popup opens when button clicked
- [ ] Popup shows correct USD amount
- [ ] Payment completes successfully
- [ ] Petition is created after payment
- [ ] Payment ID is stored correctly
- [ ] User redirected to success page
- [ ] Success page shows payment confirmation

### Error Handling Checks

- [ ] Payment cancellation shows error
- [ ] Payment failure shows error
- [ ] Can retry after error
- [ ] Back button works
- [ ] Loading states show during processing

### Mobile Checks

- [ ] Payment modal is responsive
- [ ] Buttons are touch-friendly
- [ ] Text is readable on small screens
- [ ] PayPal popup works on mobile
- [ ] Can complete payment on mobile

### RTL Checks (Arabic)

- [ ] Text flows right-to-left
- [ ] Numbers display correctly
- [ ] Currency symbols positioned properly
- [ ] Buttons aligned correctly
- [ ] PayPal buttons adapt to RTL

---

## Debugging

### Check Browser Console

Look for these logs:

```
🔍 PayPal Configuration Check:
Client ID exists: true
Client ID length: 80
Environment: development

💱 Currency conversion: 49 MAD → 4.90 USD

✅ Payment successful - Order ID: xxx Capture ID: xxx
```

### Check Network Tab

Look for these API calls:

1. `POST /api/paypal/create-order`
   - Request: `{ amount: 49, currency: "MAD", ... }`
   - Response: `{ orderId: "xxx", status: "CREATED" }`

2. `POST /api/paypal/capture-order`
   - Request: `{ orderId: "xxx" }`
   - Response: `{ orderId: "xxx", captureId: "xxx", status: "COMPLETED" }`

### Common Issues

#### PayPal buttons don't render

**Cause**: Client ID not configured
**Fix**: Check `.env.local` has `NEXT_PUBLIC_PAYPAL_CLIENT_ID`

#### Payment shows wrong amount

**Cause**: Conversion calculation error
**Fix**: Check `const usdAmount = (price / 10).toFixed(2)`

#### Payment succeeds but petition not created

**Cause**: `handlePaymentSuccess` not called
**Fix**: Check `onPaymentSuccess` prop is passed correctly

#### Currency disclosure not showing

**Cause**: Translation key missing
**Fix**: Check `useTranslation.ts` has `payment.currencyDisclosure`

---

## Testing Different Pricing Tiers

### Tier 1: 2,500 signatures

- Price: 49 MAD
- USD: $4.90
- Test: Set signatures to 2,500

### Tier 2: 5,000 signatures

- Price: 99 MAD
- USD: $9.90
- Test: Set signatures to 5,000

### Tier 3: 10,000 signatures

- Price: 199 MAD
- USD: $19.90
- Test: Set signatures to 10,000

### Tier 4: 100,000 signatures

- Price: 499 MAD
- USD: $49.90
- Test: Set signatures to 100,000

---

## Production Testing (After Going Live)

### Before Launch

1. Get live PayPal credentials
2. Update environment variables:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=<live_client_id>
   PAYPAL_CLIENT_SECRET=<live_secret>
   PAYPAL_MODE=live
   ```
3. Deploy to Vercel
4. Test with small amount first

### First Live Payment

1. Use your own card
2. Create test petition
3. Complete payment
4. Verify petition created
5. Check Spanish PayPal account receives EUR
6. Verify webhook is called

### Monitor

- Check PayPal dashboard for transactions
- Monitor server logs for errors
- Watch for user complaints
- Track conversion rates
- Monitor refund requests

---

## Rollback Plan

If issues occur in production:

### Quick Fix

1. Set `PAYPAL_MODE=sandbox` in Vercel
2. Redeploy
3. Investigate issue
4. Fix and test in sandbox
5. Switch back to `PAYPAL_MODE=live`

### Emergency Disable

1. Comment out payment requirement in code
2. Make all petitions free temporarily
3. Redeploy
4. Fix payment system
5. Re-enable payments

---

## Support Resources

### PayPal Developer Docs

- API Reference: https://developer.paypal.com/docs/api/
- Sandbox Testing: https://developer.paypal.com/docs/api-basics/sandbox/
- Webhooks: https://developer.paypal.com/docs/api-basics/notifications/webhooks/

### Internal Docs

- `PAYPAL-SETUP-GUIDE.md` - Setup instructions
- `PAYPAL-IMPLEMENTATION-SUMMARY.md` - Implementation details
- `PAYPAL-MAD-CURRENCY-SOLUTION.md` - Currency handling
- `PAYPAL-USER-EXPERIENCE.md` - User experience guide

---

## Success Criteria

Payment system is ready for production when:

- ✅ All test scenarios pass
- ✅ Sandbox payments complete successfully
- ✅ Petitions created after payment
- ✅ Payment IDs stored correctly
- ✅ All disclosures visible
- ✅ Mobile experience works
- ✅ RTL layout works
- ✅ Error handling works
- ✅ No console errors
- ✅ Network requests succeed

---

## Next Steps After Testing

1. ✅ Complete sandbox testing
2. ✅ Fix any issues found
3. ✅ Get live PayPal credentials
4. ✅ Update Vercel environment variables
5. ✅ Deploy to production
6. ✅ Test with real payment (small amount)
7. ✅ Monitor for issues
8. ✅ Announce payment system is live

---

## Contact

If you encounter issues during testing:

1. Check browser console for errors
2. Check network tab for failed requests
3. Review implementation docs
4. Check PayPal sandbox dashboard
5. Review server logs

Good luck with testing! 🚀
