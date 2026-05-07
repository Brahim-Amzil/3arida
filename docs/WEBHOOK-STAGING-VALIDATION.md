# Webhook validation in staging (**T-06**)

**MVP:** validate **Stripe** and **PayPal** only. **WhatsApp / Meta** steps below apply **post-MVP** when WhatsApp verification is enabled in the product.

Use a **staging or Preview** deployment whose public URL matches the webhook endpoints you register with each provider you use. Replace `BASE` below with that origin (e.g. `https://your-preview.vercel.app`).

## Endpoints (this repo)

| Provider | Method | Path |
|----------|--------|------|
| Stripe | `POST` | `BASE/api/stripe/webhook` |
| PayPal | `POST` | `BASE/api/paypal/webhook` |
| WhatsApp | `GET` / `POST` (Meta console) | `BASE/api/whatsapp/webhook` |

Ensure staging env has **`STRIPE_WEBHOOK_SECRET`** and **`PAYPAL_WEBHOOK_ID`** / client secret for payment webhooks. WhatsApp Graph vars are only needed when running the Meta section (post-MVP); see [`ENVIRONMENT-VARS.md`](./ENVIRONMENT-VARS.md).

---

## Stripe

1. **Dashboard (no CLI):** Developers → Webhooks → Add endpoint → URL `BASE/api/stripe/webhook` → select events your route handles (inspect `src/app/api/stripe/webhook/route.ts` for event types).
2. Copy the **signing secret** into staging `STRIPE_WEBHOOK_SECRET`.
3. Trigger a **test event** from the Dashboard (or complete a test payment in staging).
4. **Pass:** Stripe dashboard shows **2xx**; your hosting/runtime logs show `api/stripe/webhook` handling without `recordPaymentWebhookFailure` spikes.

**Optional — Stripe CLI:** `stripe listen --forward-to BASE/api/stripe/webhook` then `stripe trigger payment_intent.succeeded` (useful on localhost with `ngrok` if `BASE` is not public).

---

## PayPal

1. PayPal Developer → your app → **Webhooks** → add URL `BASE/api/paypal/webhook` (sandbox vs live must match `PAYPAL_MODE`).
2. Set **`PAYPAL_WEBHOOK_ID`** to the webhook’s ID in staging env.
3. Use PayPal’s **Webhook simulator** (or complete a sandbox checkout) for an event type your route handles (see `src/app/api/paypal/webhook/route.ts`).
4. **Pass:** Simulator / delivery shows **2xx**; logs show successful verification path.

---

## WhatsApp (Meta) — post-MVP

Skip for **MVP** launches that do not ship WhatsApp verification.

1. Meta Developer → WhatsApp → **Configuration** → Callback URL `BASE/api/whatsapp/webhook`, verify token = staging **`WHATSAPP_VERIFY_TOKEN`**.
2. Meta sends **GET** verification; your route must return the `hub.challenge` when token matches.
3. Send a test message or use **Test** from Meta UI to hit **POST** delivery.
4. **Pass:** Subscription **Verified**; inbound POSTs return 2xx in Meta’s delivery log.

---

## After validation

- [ ] Note date + environment in [`STAGING-DRY-RUN.md`](./STAGING-DRY-RUN.md) sign-off or launch tracker update log
- [ ] Mark **T-06** **Done** in [`launch-preparation-tracker.md`](../launch-preparation-tracker.md) when **Stripe + PayPal** are green on staging (**MVP**). Add Meta/WhatsApp validation when that feature ships.

## Related

- Payment failure alerting: `PAYMENT_ALERT_*` env vars in [`ENVIRONMENT-VARS.md`](./ENVIRONMENT-VARS.md)
- Release smoke §13 row 4 (payments) in the launch tracker
