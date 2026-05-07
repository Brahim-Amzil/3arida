# Monitoring and alerts (post-launch handover)

Fill this in after go-live (**DOC-04**). Keep URLs and alert routing in your team’s password manager / wiki; this file should only hold **non-secret** links and channel names.

## Uptime & health

| Item | URL or location | Owner |
|------|-----------------|-------|
| Public health check | _e.g. `https://your-domain/api/health?format=minimal`_ | |
| External synthetic monitor | _UptimeRobot / Better Stack / etc._ | |
| GitHub scheduled ping | Repo secret `HEALTH_CHECK_URL` → [`.github/workflows/external-health-check.yml`](../.github/workflows/external-health-check.yml) | |

## Application & hosting

| Item | URL or location | Owner |
|------|-----------------|-------|
| Vercel project dashboard | | |
| Vercel deployment / runtime logs | | |
| Firebase console (Auth, Firestore, Storage) | | |

## Errors & client telemetry

| Item | URL or location | Owner |
|------|-----------------|-------|
| Sentry (if `NEXT_PUBLIC_SENTRY_DSN` enabled) | | |
| Client error ingest | `POST /api/monitoring/error` (see `src/lib/monitoring.ts`) | |

## Payments & webhooks

| Item | URL or location | Owner |
|------|-----------------|-------|
| Stripe Dashboard → Developers → Webhooks | | |
| PayPal Dashboard → Webhooks | | |
| Meta / WhatsApp webhook status | | |
| Optional: `PAYMENT_ALERT_WEBHOOK_URL` (Slack/Discord/etc.) | Channel name only here; URL in env | |

## On-call

| Role | Contact / rotation doc |
|------|-------------------------|
| Primary | |
| Secondary | |

## Review cadence

- [ ] Weekly: skim error volume and failed webhooks
- [ ] After each deploy: 15 min smoke (tracker §13)
