# Beta Founder Launch - Visual Testing Guide 👀

**Quick Reference:** What you should see at each step

---

## 🔄 FIRST: Hard Refresh Your Browser!

```
Press: Cmd + Shift + R (macOS)
```

**Why?** Browser cache might show old version with "Proceed to Payment - 0 MAD"

---

## 📍 Step 1: Pricing Page

**URL:** http://localhost:3001/pricing

### ✅ What You Should See:

```
┌─────────────────────────────────────────────────────┐
│  🎉 جميع الخطط مجانية 100% خلال فترة الإطلاق التجريبي  │
│     (Purple/Blue gradient banner at top)            │
└─────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Basic      │  │ Professional │  │   Premium    │
│   69 DH      │  │   229 DH     │  │   369 DH     │
│              │  │              │  │              │
│ (All prices  │  │ (All prices  │  │ (All prices  │
│  still       │  │  still       │  │  still       │
│  visible)    │  │  visible)    │  │  visible)    │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 📍 Step 2: Create Petition - Review Step

**URL:** http://localhost:3001/petitions/create (Step 4 of form)

### ✅ What You Should See:

```
┌─────────────────────────────────────────────────────┐
│  💰 معلومات التسعير                                  │
│                                                     │
│  Professional Plan:              229 DH            │
│  🎉 خصم BETA100:                -229 DH            │
│  ─────────────────────────────────────             │
│  المجموع:                         0 DH             │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ 🎉 مبروك! أنت من أوائل المستخدمين –          │ │
│  │ إستمتع بجميع الميزات مجانًا خلال الإطلاق     │ │
│  │ التجريبي                                      │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 📍 Step 3: Submit Button

### ✅ What You Should See:

```
┌─────────────────────────────────┐
│     إنشاء العريضة               │  ← Arabic for "Create Petition"
│  (or "Create Petition" in EN)  │
└─────────────────────────────────┘
```

### ❌ What You Should NOT See:

```
┌─────────────────────────────────┐
│  Proceed to Payment - 0 MAD     │  ← OLD VERSION (if you see this, REFRESH!)
└─────────────────────────────────┘
```

---

## 📍 Step 4: After Clicking Submit

### ✅ What Should Happen:

1. **NO payment form appears** ← This is correct!
2. **Goes directly to success page**
3. **URL changes to:** `/petitions/success?id=XXXXX`

### ❌ What Should NOT Happen:

- Payment form appearing
- Stripe/PayPal checkout
- Any payment-related screens

---

## 📍 Step 5: Success Page

**URL:** http://localhost:3001/petitions/success?id=XXXXX

### ✅ What You Should See:

```
┌─────────────────────────────────────────────────────┐
│              ✓ تم إنشاء العريضة بنجاح                │
│                                                     │
│  [View Petition]  [Browse Petitions]               │
│                                                     │
│  What's Next:                                       │
│  • Petition under review                            │
│  • Approval within 24-48 hours                      │
│  • Share with friends                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              💝 ساهم في دعم المنصة                   │
│                                                     │
│  المنصة مجانية 100% خلال فترة التجريب. مساهمتك      │
│  الاختيارية تساعدنا في الاستمرار والتطوير          │
│                                                     │
│  [20 DH]  [50 DH]  [100 DH]  [200 DH]             │
│                                                     │
│  أو أدخل مبلغاً آخر: [____] DH                     │
│                                                     │
│  [ساهم الآن]                                        │
│                                                     │
│  💚 كل مساهمة تُقدّر مهما كان حجمها                 │
└─────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problem: "I still see 'Proceed to Payment - 0 MAD'"

**Solution:**

```bash
1. Hard refresh: Cmd + Shift + R
2. Clear browser cache
3. Close and reopen browser
4. Check dev server is running on port 3001
```

### Problem: "Payment form still appears"

**Check console logs:**

```javascript
// Should see:
💰 Price calculation: {
  basePrice: 229,
  discount: 100,
  discountAmount: 229,
  finalPrice: 0
}
🎉 Free petition (Beta Founder) - creating directly...
```

### Problem: "No coupon discount shown"

**Check review step:**

- Should see "خصم BETA100: -229 DH"
- If not, check console for errors
- Coupon is hardcoded, should always appear

---

## ✅ Success Checklist

- [ ] Beta banner visible on pricing page
- [ ] Beta banner visible on influencers page
- [ ] Review step shows "0 DH" total
- [ ] Review step shows coupon breakdown
- [ ] Review step shows celebration message
- [ ] Submit button says "Create Petition" (not "Proceed to Payment")
- [ ] No payment form appears after submit
- [ ] Success page loads directly
- [ ] PWYW component visible on success page
- [ ] PWYW has suggested amounts (20, 50, 100, 200 DH)

---

## 🎯 Quick Test (2 minutes)

1. Open: http://localhost:3001/pricing
   - See beta banner? ✅

2. Click "Create Petition"
   - Fill form quickly (use mock data)
   - Go to review step
   - See "0 DH" total? ✅
   - See "Create Petition" button? ✅

3. Click submit
   - Skip payment? ✅
   - See success page? ✅
   - See PWYW component? ✅

**If all ✅ → You're ready to launch! 🚀**

---

**Dev Server:** http://localhost:3001  
**Last Updated:** February 4, 2026
