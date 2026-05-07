# WhatsApp token rotation (**S-04**) and **S-08** follow-through

**Not required for MVP:** the current launch scope **does not include** WhatsApp Business / Graph phone verification. Use this runbook when you **enable that feature post-MVP** or after a leak involving Meta WhatsApp credentials.

Use when rotating Meta WhatsApp credentials after a leak or scheduled rotation.

## 1. Meta Business / Developer

1. [Meta for Developers](https://developers.facebook.com/) → your **app** → **WhatsApp** → **API Setup** (or **Configuration**).
2. Under **Temporary access token** or **System User** (depending on setup), generate a **new long-lived token** with `whatsapp_business_messaging` (and any scopes you already use).
3. Copy **Phone number ID** if it changed (usually unchanged).

## 2. Webhook verify token

1. Choose a new random **`WHATSAPP_VERIFY_TOKEN`** (high entropy; store in password manager).
2. In **WhatsApp → Configuration**, set **Callback URL** to your staging/production URL + `/api/whatsapp/webhook` and **Verify token** to that value.
3. Meta will **GET** your endpoint — confirm deployment has the new env var before saving in Meta UI.

## 3. Vercel (all affected environments)

Set for **Production**, **Preview** (per branch if needed), and **Development** as applicable:

| Variable | Notes |
|----------|--------|
| `WHATSAPP_ACCESS_TOKEN` | New long-lived token |
| `WHATSAPP_VERIFY_TOKEN` | Must match Meta configuration |
| `WHATSAPP_PHONE_NUMBER_ID` | If unchanged, still re-check |

Redeploy each environment after saving.

## 4. Validation

1. Send a test **template** or session message to your test number from Meta’s tester tools.
2. Confirm **200** on webhook **POST** in Meta’s webhook delivery log.
3. Run the WhatsApp section of [`WEBHOOK-STAGING-VALIDATION.md`](./WEBHOOK-STAGING-VALIDATION.md).

## 5. Tracker

- **Post-MVP:** reopen **S-04** (or add a successor task) when WhatsApp verification ships; mark complete after Meta shows verified webhook + successful test delivery.
- When WhatsApp verification is in production, align **S-08** / env dashboards with any newly minted Meta secrets.
