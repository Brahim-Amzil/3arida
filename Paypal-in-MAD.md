PayPal Implementation — v1 (Launch Checklist)
1️⃣ Price & Currency (App side)

Always display a fixed price:
👉 49 MAD

Price never changes in the UI.

No dynamic conversion on your side.

2️⃣ PayPal Payment Setup (Technical)

Send the payment to PayPal as:

Amount: 49

Currency: MAD

Let PayPal handle currency conversion automatically.

Your Spanish PayPal account will receive the funds in EUR.

✔️ You do not need to calculate or store exchange rates.

3️⃣ What You Control vs PayPal Controls

You control:

Displayed price (49 MAD)

Amount sent to PayPal (49 MAD)

Product description

PayPal controls:

MAD → EUR conversion rate

Final charged amount on the user’s card

This is normal and acceptable for launch.

4️⃣ Required User Disclosure (Important)

Add this short line near the PayPal button or checkout:

السعر ثابت: 49 درهم مغربي
يتم احتساب المبلغ النهائي وفق سعر الصرف المعتمد من PayPal

This protects you from:

complaints

chargebacks

PayPal disputes

5️⃣ Refund Policy (PayPal-safe)

Since your service is non-refundable, clearly state:

نظرًا لطبيعة الخدمة الرقمية، لا يتم تقديم أي استرداد للمبالغ المدفوعة بعد إتمام عملية الدفع.

✔️ PayPal allows this if users are informed before payment.

6️⃣ Why This Is the Right Choice for v1

Fast to implement

No legal/company documents required upfront

Works with a Spanish PayPal account

Moroccan-friendly pricing

Easy to replace later with Stripe

🟢 Final Verdict

✔️ Fixed price: YES
✔️ PayPal auto-conversion: YES
✔️ Spanish account: OK
✔️ No refunds: OK if disclosed
✔️ Good for launch: YES
