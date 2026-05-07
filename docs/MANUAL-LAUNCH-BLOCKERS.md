# Manual launch blockers (human-only queue)

**MVP product scope:** this launch **does not include WhatsApp Business / Graph phone verification** (no Meta webhook or WhatsApp env vars required for go-live). WhatsApp-related tracker rows and runbooks remain for **post-MVP** when you turn that feature on.

These items **cannot** be closed from the codebase alone. Use [`launch-preparation-tracker.md`](../launch-preparation-tracker.md) as the source of truth for status; this page is the **ordered execution list**.

| Order | ID | What to do | Primary doc |
|-------|-----|------------|-------------|
| 1 | **S-01** / **S-08** | Finish credential work for **in-MVP** providers (Firebase, Resend, SMTP, Stripe, PayPal, etc.) in every Vercel env you use for launch. **Do not** block on Meta/WhatsApp verification secrets until that feature ships. | [`SECURITY.md`](../SECURITY.md), [`ENVIRONMENT-VARS.md`](./ENVIRONMENT-VARS.md) |
| 2 | **T-06** | On staging: validate **Stripe** and **PayPal** webhooks until both return **2xx** and logs look clean. | [`WEBHOOK-STAGING-VALIDATION.md`](./WEBHOOK-STAGING-VALIDATION.md) |
| 3 | **G-03** | Execute §13 smoke + optional `npm run test:e2e:smoke` (with `E2E_*` if needed) on a production-like URL. | Tracker §13, [`STAGING-DRY-RUN.md`](./STAGING-DRY-RUN.md) |
| 4 | **G-04** | Perform **rollback drill** (hosting UI); sign [`STAGING-DRY-RUN.md`](./STAGING-DRY-RUN.md) table. | Tracker §13 |
| 5 | **G-01** | Complete security sign-off checklist (named reviewer). | [`SECURITY-GATE-G01-CHECKLIST.md`](./SECURITY-GATE-G01-CHECKLIST.md) |
| 6 | **G-02** | Confirm **CI** workflow green on **`main`** after branch protection is on; record date in tracker update log. | [`GITHUB-BRANCH-PROTECTION.md`](./GITHUB-BRANCH-PROTECTION.md), `.github/workflows/ci.yml` |
| 7 | **Go-live** | Follow launch day sequence; fill [`MONITORING-AND-ALERTS.md`](./MONITORING-AND-ALERTS.md) post-launch. | [`LAUNCH-DAY-RUNBOOK.md`](./LAUNCH-DAY-RUNBOOK.md) |

### Post-MVP backlog (WhatsApp)

When you add **WhatsApp verification** back to the product: **S-04**, Meta webhook checks in **T-06**, and [`WHATSAPP-TOKEN-ROTATION.md`](./WHATSAPP-TOKEN-ROTATION.md).

When a row is finished, update the tracker table and (optionally) paste a one-line note in the tracker **Update Log**.
