# Security gate **G-01** — pre-launch sign-off checklist

Use this before marking **G-01** *No critical security findings* **Done** in [`launch-preparation-tracker.md`](../launch-preparation-tracker.md). Assign a **named reviewer** (security lead or delegate).

## Secrets & supply chain

- [ ] No secrets in repo: `npm run scan:secrets:staged` clean on release branch; CI **Secret Scan** workflow green
- [ ] Tracker **S-01** / **S-08** status reviewed (**MVP** excludes WhatsApp verification — **S-04** N/A until post-MVP); any remaining gaps explicitly accepted by leadership
- [ ] Production/staging env vars only in host UI (Vercel/Firebase), not in tickets or commits

## AuthN / AuthZ

- [ ] [`api-route-security-matrix.md`](../api-route-security-matrix.md) reviewed for any routes changed since last audit
- [ ] Admin/moderator flows re-tested: invite moderator, appeals status change (role matrix)

## Injection & SSRF

- [ ] Public forms: **contact** uses server-side reCAPTCHA where required (**MVP**); WhatsApp verification routes follow the same pattern when that feature is enabled post-MVP
- [ ] No new `dangerouslySetInnerHTML` without sanitizer (see **V-04** history)

## Payments & webhooks

- [ ] **T-06** complete per [`WEBHOOK-STAGING-VALIDATION.md`](./WEBHOOK-STAGING-VALIDATION.md) for staging (**MVP:** Stripe + PayPal only)
- [ ] Stripe **live** vs **test** keys match intentional go-live mode

## Sign-off

| Reviewer | Date | Result (Pass / Fail / Pass with notes) |
|----------|------|----------------------------------------|
| | | |
