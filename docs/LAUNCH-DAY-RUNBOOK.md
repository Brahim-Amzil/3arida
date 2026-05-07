# Launch day runbook (go / no-go)

Use this with [`launch-preparation-tracker.md`](../launch-preparation-tracker.md) §0 gates and §13 smoke checks.

## Roles (fill names before launch)

| Role | Name | Responsibility |
|------|------|----------------|
| **Incident lead** | _TBD_ | Calls go/no-go, owns rollback decision |
| **Deploy owner** | _TBD_ | Runs or approves production deploy (Vercel / Firebase) |
| **Comms** | _TBD_ | User-facing status if maintenance required |
| **Payments** | _TBD_ | Confirms Stripe/PayPal dashboards + webhooks after cutover |

---

## T-24h — freeze & verify

- [ ] No open P0 defects on the release branch
- [ ] `main` green: CI workflow (lint, type-check, test, build)
- [ ] Staging / Preview: run §13 smoke from [`launch-preparation-tracker.md`](../launch-preparation-tracker.md)
- [ ] **T-06**: Stripe + PayPal test events received in staging (webhook logs); WhatsApp/Meta only when that feature is live (**post-MVP** for current scope)

---

## T-1h — environment

- [ ] `COMING_SOON_MODE=false` in production (or flip immediately after DNS/cutover per your plan)
- [ ] `MAINTENANCE_MODE=false`
- [ ] Production env vars match [`docs/ENVIRONMENT-VARS.md`](./ENVIRONMENT-VARS.md) (no `pk_test_` / `sandbox` in prod unless intentional)
- [ ] External monitor URL set (`HEALTH_CHECK_URL` secret for GitHub health workflow, plus UptimeRobot or equivalent)

---

## Go-live sequence (suggested)

1. Merge or promote the **exact** commit that passed CI.
2. Deploy production (Vercel dashboard or [deploy-vercel-production workflow](../.github/workflows/deploy-vercel-production.yml) after configuring `VERCEL_TOKEN` and GitHub **production** environment protection).
3. Wait for deploy **Ready**; open site in a private window (no stale SW).
4. Run §13 smoke rows 1–3 minimum; spot-check payments if live keys are on.
5. Announce externally only after step 4 passes.

---

## No-go triggers (stop and rollback)

- Health endpoint not `ok` after deploy settles (~5–10 min)
- Auth or Firestore errors spike in logs / Sentry
- Payment webhooks failing or alert webhook firing repeatedly

Rollback first steps: see **§13 Rollback** in the launch tracker (`MAINTENANCE_MODE`, hosting rollback to prior deployment).

---

## Post-launch (first 24h)

- [ ] Watch error ingest (`/api/monitoring/error`) and payment webhooks
- [ ] Complete [**MONITORING-AND-ALERTS.md**](./MONITORING-AND-ALERTS.md) (dashboard URLs, on-call, review cadence) — **DOC-04**
