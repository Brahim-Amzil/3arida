# Staging dry run (**C-06**)

Run this **once** on a staging or production-like Preview deployment before calling launch gate **G-03** satisfied. Check every row; note failures in the launch tracker or issue tracker.

## Preconditions

- [ ] Preview/staging URL uses the same **env class** as production (or clearly documented deltas, e.g. Stripe test mode only).
- [ ] `VERCEL_TOKEN` / deploy path tested if you rely on [deploy-vercel-staging](../.github/workflows/deploy-vercel-staging.yml).

## Automated (local or CI)

- [ ] `npm run lint` — exit 0
- [ ] `npm run type-check` — exit 0
- [ ] `npm run test` — exit 0
- [ ] `CI=true npm run build` — exit 0
- [ ] Optional: `npm run test:e2e:smoke` against staging base URL with `E2E_AUTH_EMAIL` / `E2E_AUTH_PASSWORD` if Firebase flows must be proven

## Manual — core journeys

- [ ] **Auth**: register, login, logout, password reset email (if enabled)
- [ ] **Petition**: browse list → open detail → sign (reCAPTCHA path) → signature count updates
- [ ] **Create flow**: create draft → required fields validation → submit (as far as policy allows on staging)
- [ ] **Payments**: test card or PayPal sandbox completes; **Stripe** and **PayPal** webhooks show 2xx in provider dashboard — follow [**WEBHOOK-STAGING-VALIDATION.md**](./WEBHOOK-STAGING-VALIDATION.md) (**T-06**)
- [ ] **WhatsApp verification** — **post-MVP only** (MVP does not include this): send verification + verify code + Meta webhook — [`WEBHOOK-STAGING-VALIDATION.md`](./WEBHOOK-STAGING-VALIDATION.md) (**T-06**)
- [ ] **Admin / moderator**: sign in as elevated user → open admin-only route → confirm 403 for normal user (spot-check)

## Manual — ops toggles

- [ ] With `COMING_SOON_MODE=true`, public shell appears; `/bsk` bypass still matches policy
- [ ] With `MAINTENANCE_MODE=true`, maintenance page applies and bypass list still allows health + webhooks

## Rollback rehearsal (**G-04**)

- [ ] From hosting UI: roll back to **previous** deployment and confirm site recovers
- [ ] Document actual clicks / times in [`LAUNCH-DAY-RUNBOOK.md`](./LAUNCH-DAY-RUNBOOK.md) or team wiki

## Sign-off

| Role | Name | Date | Pass / Fail |
|------|------|------|-------------|
| QA / Deploy owner | | | |

When complete, mark **C-06** Done in [`launch-preparation-tracker.md`](../launch-preparation-tracker.md) and attach evidence (link to CI run + short note).
