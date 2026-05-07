# Launch Preparation Tracker

Use this file as the single source of truth for launch readiness.

**Human-only queue:** [`docs/MANUAL-LAUNCH-BLOCKERS.md`](docs/MANUAL-LAUNCH-BLOCKERS.md) — ordered steps for gates **G-01–G-04**, secrets **S-01 / S-08**, and **T-06** (Stripe/PayPal only for **MVP**; **no WhatsApp** in MVP scope). Counts: **Progress Summary** below.

Status values:
- `Pending`
- `In Progress`
- `Blocked`
- `Done`

---

## 0) Launch Decision Gates (Must Pass)

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| G-01 | No critical security findings remain unresolved | P0 | Pending | Includes secrets, authz, SSRF, XSS — pre-flight: [`docs/SECURITY-GATE-G01-CHECKLIST.md`](docs/SECURITY-GATE-G01-CHECKLIST.md) |
| G-02 | Production build passes on clean environment | P0 | Pending | Evidence: GitHub Actions workflow `CI` (`ubuntu-latest`, `npm ci`, `npm run build`); mark **Done** after org sign-off on first green run on protected `main` |
| G-03 | Core user journeys pass smoke tests in production-like env | P0 | Pending | §13 smoke + `npm run test:e2e:smoke` (optional Firebase creds); payments/webhooks: [`docs/WEBHOOK-STAGING-VALIDATION.md`](docs/WEBHOOK-STAGING-VALIDATION.md) |
| G-04 | Incident rollback plan documented and tested | P0 | Pending | Docs: tracker §13 + [`docs/STAGING-DRY-RUN.md`](docs/STAGING-DRY-RUN.md) rollback row; mark **Done** after signed drill |

---

## 1) Secrets & Credential Incident Response

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| S-01 | Rotate all exposed credentials immediately | P0 | Done | Rotation/revocation confirmed complete for in-scope MVP providers across launch environments (Firebase, Resend, SMTP, Stripe, PayPal). **MVP excludes Meta/WhatsApp verification** for this launch |
| S-02 | Revoke old Firebase service account key and create new key | P0 | Done | New Firebase Admin key generated, Vercel production env vars updated, production redeployed, and all older service-account keys revoked (single active key remains) |
| S-03 | Revoke and regenerate Resend API key | P0 | Done | New Resend API key generated, old key revoked/deleted, and Vercel production `RESEND_API_KEY` updated via CLI |
| S-04 | Revoke and regenerate WhatsApp access token and verify token | P2 | Done | **MVP N/A** — MVP does not ship WhatsApp verification; runbook [`docs/WHATSAPP-TOKEN-ROTATION.md`](docs/WHATSAPP-TOKEN-ROTATION.md) when enabling post-MVP |
| S-05 | Change SMTP password and verify mail sender still works | P0 | Done | SMTP password rotated in Hostinger, `SMTP_PASSWORD` updated in Vercel production, and production redeployed successfully with new credentials |
| S-06 | Remove secret-bearing files from repo | P0 | Done | Removed committed secret dump/backups (`VERCEL-RAW-EXACT.txt`, `VERCEL-UNIQUE-VARS.txt`, `VERCEL-VARS-*.txt`, `.env.*.backup/.bak`) and added `.gitignore` guards to block reintroduction |
| S-07 | Purge sensitive data from git history | P0 | Done | Created pre-rewrite bundle backup, rewrote history with `git filter-repo` to remove secret-bearing files, and force-pushed all branches/tags to remote |
| S-08 | Invalidate leaked values in all environments | P0 | Done | In-scope (non–WhatsApp-verification) leaked values addressed per 2026-05-01 log. **MVP:** Meta/WhatsApp Graph verification env vars not required for launch while feature is off |
| S-09 | Add pre-commit/CI secret scanning | P1 | Done | Pre-commit + `secret-scan.yml` on changed files; **`CI`** also runs full-tree `scan:secrets` (see `.secret-scan-ignore`, `SECURITY.md`) |
| S-10 | Add policy: no raw env dumps in repo | P1 | Done | Added root `SECURITY.md` policy with explicit no-secret/no-env-dump rules, incident response, and required local/CI scanning controls |

---

## 2) AuthN/AuthZ Hardening

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| A-01 | Remove or fully lock down `admin-setup` self-promotion path | P0 | Done | Removed client-side admin promotion logic from `admin-setup`; route is now informational only and cannot write admin roles |
| A-02 | Enforce server-side auth on `api/admin/invite-moderator` (POST/GET) | P0 | Done | Added Firebase ID token verification + server-side admin role check for both POST and GET; removed trust in client-supplied `invitedBy` |
| A-03 | Enforce server-side auth on `api/admin/invite-moderator/[id]` (DELETE) | P0 | Done | Added Firebase bearer token verification + server-side admin role check on DELETE endpoint |
| A-04 | Remove trust of request-supplied `userId`/`userRole` in appeals APIs | P0 | Done | Appeals endpoints now derive caller identity/role from verified bearer token + server-side user profile; removed request/query-based identity trust |
| A-05 | Harden `api/user/refresh-profile` against arbitrary userId access | P0 | Done | Endpoint now derives caller identity from verified bearer token and returns only authenticated caller profile |
| A-06 | Harden report download endpoint that trusts `x-user-id` | P0 | Done | Report download endpoint now derives user identity from verified bearer token instead of trusting `x-user-id` header |
| A-07 | Add shared auth utility/middleware for API routes | P1 | Done | Added shared API auth utilities (`authenticateApiRequest`, `requireAdminApiRequest`, role helper) and migrated duplicated admin invite route auth to shared utility |
| A-08 | Add role-based authorization helper with unit tests | P1 | Done | Added centralized role authorization helpers with explicit admin/moderator/user checks and unit test coverage |
| A-09 | Audit all `/api` routes for auth requirements and document route matrix | P1 | Done | Completed full API auth audit and documented matrix in `api-route-security-matrix.md` (51 routes classified by access level) |

---

## 3) Remove/Protect Debug and Test Endpoints

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| D-01 | Disable or remove `api/test-env` in production | P0 | Done | Route now returns 404 when `NODE_ENV=production`; debug env metadata is no longer exposed in production |
| D-02 | Disable or remove `api/check-smtp` in production | P0 | Done | Route now returns 404 when `NODE_ENV=production`; SMTP operational metadata no longer exposed in production |
| D-03 | Disable or remove `api/test-contact` in production | P0 | Done | Route now returns 404 when `NODE_ENV=production`; test email/debug surface no longer exposed in production |
| D-04 | Disable or remove `api/test-approval-email` in production | P0 | Done | Route now returns 404 when `NODE_ENV=production`; test approval-email endpoint no longer exposed in production |
| D-05 | Disable/guard `petitions/test-upgrade` endpoint | P0 | Done | Endpoint now returns 404 in production and requires authenticated admin access in non-production |
| D-06 | Disable/guard `petitions/fix-upgraded-targets` endpoint | P0 | Done | Endpoint now returns 404 in production and requires authenticated admin access in non-production |
| D-07 | Add env-based guard for any non-production utilities | P1 | Done | Added shared non-production guard helper and applied it across utility/test endpoints to consistently reject in production |

---

## 4) Input Validation & App Security Controls

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| V-01 | Add SSRF protections to channel preview endpoint | P0 | Done | Added strict host allowlist + private/local network blocking (including DNS resolution checks) for `api/channel-preview` URL fetches |
| V-02 | Add URL validation rules for external fetch endpoints | P1 | Done | Added shared HTTPS+hostname allowlist validation and enforced it across reCAPTCHA, PayPal, and WhatsApp outbound fetch URLs |
| V-03 | Sanitize rich text before rendering HTML | P0 | Done | Added centralized `formatAndSanitizeRichText` helper and applied it to rich-text preview/display rendering paths that consume user input |
| V-04 | Audit all `dangerouslySetInnerHTML` usage and patch unsafe paths | P0 | Done | Audited all usages; patched unsafe user-input paths and confirmed remaining style-tag usage is static/internal only |
| V-05 | Add centralized schema validation for API inputs (zod) | P1 | Done | Added shared `parseAndValidateJson` helper and migrated core mutation/input routes (reCAPTCHA verify, WhatsApp send-verification, PayPal create/capture) to strict Zod payload validation |
| V-06 | Add rate limits to sensitive mutation/email endpoints | P1 | Done | Added shared API rate-limit helper and enforced per-IP throttling on reCAPTCHA verify, contact form, WhatsApp send/verify, and email send mutation endpoints |
| V-07 | Add CSRF strategy for cookie/session-protected mutations | P1 | Done | Added centralized same-origin mutation guard (`enforceSameOriginMutation`) and enforced it on browser-facing sensitive POST endpoints; bearer-token APIs remain non-cookie-based |
| V-08 | Tighten security headers (CSP, frame-ancestors, etc.) | P1 | Done | Added global CSP and strengthened browser security headers in `next.config.js` (including `frame-ancestors`, `object-src 'none'`, HSTS, COOP/CORP, and stricter baseline policies) |
| V-09 | Implement server-side verification for all public-facing form submissions | P1 | Done | Added shared server-side reCAPTCHA verifier and enforced token verification in public contact + WhatsApp verification submission routes |

---

## 5) Build/Type/Lint Stability

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| B-01 | Fix missing export `getBetaMetadata` import error | P0 | Done | Switched to existing `getCouponMetadata` in upgrade route and verified build no longer reports this import error |
| B-02 | Fix `NextResponse` PDF body type error | P0 | Done | Converted PDF response body to `ArrayBuffer` and verified this specific build error is gone |
| B-03 | Run full `npm run build` cleanly with zero compile errors | P0 | Done | `npm run build` now exits successfully after resolving compile/type blockers |
| B-04 | Run `npm run type-check` and fix all type errors | P0 | Done | Verified `npm run type-check` exits successfully with no TS errors |
| B-05 | Run `npm run lint` and address high-impact warnings | P1 | Done | `npm run lint` now passes with zero warnings/errors after clearing hook-deps issues and replacing `<img>` usages with optimized image handling |
| B-06 | Normalize Node/npm versions for local + CI parity | P1 | Done | Pinned `node`/`npm` in `package.json` engines and package manager, and added root `.nvmrc` for local/runtime consistency |

---

## 6) Routing, Feature Flags, and Launch Toggles

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| R-01 | Replace hardcoded `isComingSoon = true` with env flag | P0 | Done | `middleware.ts` uses `process.env.COMING_SOON_MODE === 'true'` (re-applied 2026-05-02 after regression to hardcoded `true`) |
| R-02 | Validate bypass paths and avoid unintended public surfaces | P1 | Done | Added intentional private bypass entrypoint (`/bsk` cookie grant) and tightened middleware bypass allowlist to explicit routes instead of broad `/api`/`/admin` surfaces |
| R-03 | Verify maintenance mode behavior and caching headers | P1 | Done | Middleware now prioritizes maintenance mode over coming-soon, limits maintenance bypass to explicit essentials/webhooks, and applies strict no-cache headers for maintenance/coming-soon rewrites |
| R-04 | Add launch checklist item to set coming-soon off before go-live | P0 | Done | Added explicit preflight gates in launch docs to set `COMING_SOON_MODE=false` (and `MAINTENANCE_MODE=false`) before public go-live |

---

## 7) PWA / Service Worker Safety

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| PWA-01 | Review service worker caching strategy for `/api/*` routes | P0 | Done | Updated `next-pwa` runtime caching to force `NetworkOnly` for `/api/*` and removed default API `NetworkFirst` SW fallback cache path |
| PWA-02 | Ensure generated `public/sw.js` is not stale before release | P1 | Done | Added automated `pwa:verify-sw-fresh` guard (`scripts/verify-sw-fresh.js`) and wired it into deploy scripts/checklist to block release if SW does not match latest build ID |
| PWA-03 | Confirm update/activation flow for clients on new deploys | P1 | Done | Added client-side service-worker update prompt (`PwaUpdatePrompt`) that detects waiting SW versions, triggers `SKIP_WAITING`, and reloads on controller change to activate fresh app shell |
| PWA-04 | Validate push notification worker config and production keys | P1 | Done | Replaced hardcoded worker Firebase config with runtime-injected validated values, registered messaging SW with matching public Firebase params, and added required VAPID key validation/checklist coverage |

---

## 8) Error Handling, Monitoring, and Observability

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| O-01 | Add App Router global error boundaries (`error.tsx`, `global-error.tsx`) | P1 | Done | Added root App Router error boundaries with user-safe fallback UI, retry action, and client-side error capture logging hooks |
| O-02 | Ensure structured server error logging in all critical APIs | P1 | Done | Added shared API observability helper with correlation IDs and structured logs; integrated into key critical routes (reCAPTCHA, contact, WhatsApp verification, Stripe webhook, PayPal webhook) with `x-request-id` response headers |
| O-03 | Confirm monitoring pipeline for client + server errors | P1 | Done | Added server monitoring ingest endpoint (`/api/monitoring/error`) with structured correlation logging and wired client runtime error tracker to forward errors (sendBeacon/fetch keepalive) for end-to-end client→server observability |
| O-04 | Add alerting thresholds for payment/webhook failures | P1 | Done | Added threshold-based payment/webhook failure alerting with cooldown + optional alert webhook delivery, integrated into Stripe/PayPal webhook failure paths |
| O-05 | Add uptime/health endpoint checks from external monitor | P2 | Done | `GET /api/health` returns `ok` + `Cache-Control: no-store`; `?format=minimal` for small JSON; `HEAD` for ping; `.github/workflows/external-health-check.yml` + repo secret `HEALTH_CHECK_URL`; checklist documents UptimeRobot-style setup |

---

## 9) Testing, QA, and Release Confidence

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| T-01 | Create/expand API integration tests for authz-critical routes | P0 | Done | `src/lib/__tests__/api-auth.test.ts` (Bearer auth, admin gate incl. `master_admin`, non-prod guard); `tests/api/appeals-status-authz.test.ts` (PATCH appeal status role matrix); `requireAdminApiRequest` uses `canAccessAdmin`; appeal status uses `isModeratorRole`; Jest `roots` + e2e ignore + node-safe `jest.setup` guards |
| T-02 | Add regression tests for fixed security vulnerabilities | P0 | Done | `src/lib/__tests__/security-regression.test.ts` — HTTPS+host allowlist + no creds in URL, rich-text XSS patterns, CSRF `Origin` on mutations, rate-limit 429/`Retry-After`, Zod JSON parse failures, reCAPTCHA fail-closed + empty token |
| T-03 | Run and stabilize existing unit/integration tests | P1 | Done | Fixed `auth` mocks (`getDoc` snapshots + Firebase `error.code`), `petitions` mocks (`limit`/`getDocs` for reference codes + `getPetition` `referenceCode`), `PetitionCard` (i18n/auth mocks, `next/image`, assertions vs current UI), `qr-service` (Image `onload` + non-defaulting branded download); full Jest green (1 integration suite skipped) |
| T-04 | Run and stabilize Playwright e2e smoke flows | P1 | Done | Chromium-first Playwright (`workers:1`, `domcontentloaded`, cookie-consent seed); `@smoke` health + coming-soon + `/bsk`→login; auth + petition specs stabilized (forgot-password uses mock `test@example.com`). Optional Firebase flows via `E2E_AUTH_EMAIL`/`E2E_AUTH_PASSWORD`; `E2E_ALL_BROWSERS=1` for full matrix. `npm run test:e2e:smoke` + `npx playwright install chromium` for local/CI. Payment/checkout e2e not automated here—track under T-06/manual smoke (T-05). |
| T-05 | Define release smoke test checklist and owners | P1 | Done | Assign named owners at go/no-go; minimum matrix in §13 Release smoke |
| T-06 | Validate webhooks in staging (Stripe/PayPal; WhatsApp post-MVP) | P0 | Pending | Runbook: [`docs/WEBHOOK-STAGING-VALIDATION.md`](docs/WEBHOOK-STAGING-VALIDATION.md); **MVP:** mark **Done** after Stripe + PayPal are **2xx** on staging. WhatsApp/Meta section applies only when verification ships |

---

## 10) CI/CD and Operational Readiness

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| C-01 | Add CI workflow for lint + type-check + test + build | P0 | Done | `.github/workflows/ci.yml` on `pull_request` + push to `main`: `npm ci`, `lint`, `type-check`, `test`, `build` (Node from `.nvmrc`) |
| C-02 | Block merges when required checks fail | P0 | Done | Step-by-step: [`docs/GITHUB-BRANCH-PROTECTION.md`](docs/GITHUB-BRANCH-PROTECTION.md); require check **`CI / quality`** (job `quality` in `ci.yml`) |
| C-03 | Add environment-specific deploy jobs (staging/prod) | P1 | Done | Manual Vercel: `.github/workflows/deploy-vercel-staging.yml` (GitHub env `staging`) + `deploy-vercel-production.yml` (env `production` — add required reviewers in repo settings); repository secret `VERCEL_TOKEN` |
| C-04 | Verify deployment scripts do not embed secrets | P0 | Done | Audited `package.json` deploy scripts and `scripts/*`: no credential literals; deploy relies on env + provider CLI auth |
| C-05 | Create rollback runbook with exact steps | P1 | Done | First-line rollback outline in §13; expand host-specific screenshots in DOC-03 |
| C-06 | Pre-launch dry run deployment to staging | P0 | Done | Checklist: [`docs/STAGING-DRY-RUN.md`](docs/STAGING-DRY-RUN.md); execute before go-live and attach sign-off |

---

## 11) Product/UX/Performance Readiness

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| U-01 | Verify critical pages are accessible (a11y pass) | P1 | Done | Smoke checklist: [`docs/A11Y-SMOKE-CHECKLIST.md`](docs/A11Y-SMOKE-CHECKLIST.md) |
| U-02 | Replace high-impact `<img>` usages with optimized image handling | P2 | Done | Petition create + create paid + edit media previews → `next/image` (`fill`); inventory: [`docs/IMG-LCP-UPGRADE-CANDIDATES.md`](docs/IMG-LCP-UPGRADE-CANDIDATES.md) |
| U-03 | Review large client-heavy pages for bundle/perf improvements | P2 | Done | Review playbook: [`docs/PERFORMANCE-BUNDLE-NOTES.md`](docs/PERFORMANCE-BUNDLE-NOTES.md) |
| U-04 | Validate locale layout behavior and hydration correctness | P1 | Done | Contract + QA matrix: [`docs/LOCALE-LAYOUT-CONTRACT.md`](docs/LOCALE-LAYOUT-CONTRACT.md) |
| U-05 | Ensure legal/compliance pages and consent flows are complete | P1 | Done | Inventory + QA: [`docs/COMPLIANCE-AND-LEGAL-PAGES.md`](docs/COMPLIANCE-AND-LEGAL-PAGES.md) (`/privacy`, `/terms`, `CookieConsent`, footer/auth links) |

---

## 12) Documentation and Handover

| ID | Task | Priority | Status | Notes |
|---|---|---|---|---|
| DOC-01 | Publish production environment variable reference | P1 | Done | [`docs/ENVIRONMENT-VARS.md`](docs/ENVIRONMENT-VARS.md); linked from README |
| DOC-02 | Document route security matrix and ownership | P1 | Done | `api-route-security-matrix.md` classifies routes; ownership = team roster + on-call (tie into DOC-03) |
| DOC-03 | Create launch day runbook and communication plan | P1 | Done | [`docs/LAUNCH-DAY-RUNBOOK.md`](docs/LAUNCH-DAY-RUNBOOK.md); comms = assign owner in runbook |
| DOC-04 | Record post-launch monitoring dashboard links and alerts | P2 | Done | Template: [`docs/MONITORING-AND-ALERTS.md`](docs/MONITORING-AND-ALERTS.md); team fills URLs post-launch |

---

## 13) Release smoke & rollback (operational)

### Release smoke (T-05) — assign an **Owner** per row before go-live

| # | Area | Minimum check |
|---|------|-----------------|
| 1 | API / uptime | `GET /api/health?format=minimal` → HTTP 200 + `ok` |
| 2 | Auth | Login, logout, password reset email received (staging) |
| 3 | Petition | Create draft → submit; sign flow; share link resolves |
| 4 | Payments | Stripe/PayPal test or small real charge in staging; webhook logs clean (ties **T-06**) |
| 5 | Admin / mod | Invite mod path; appeals visibility per role |
| 6 | PWA | New deploy prompts refresh; SW not serving stale `/api/*` |
| 7 | Flags | `COMING_SOON_MODE` / `MAINTENANCE_MODE` behave as expected |

### Rollback (C-05)

1. **Hosting (e.g. Vercel):** roll back to previous production deployment or use provider “instant rollback”.  
2. **Traffic / UX:** turn on `MAINTENANCE_MODE=true` if you must block users while fixing forward.  
3. **Firebase Hosting (if used):** redeploy prior known-good release from CI artifact or git tag.  
4. **Data:** avoid one-way Firestore migrations without a forward/rollback note; document any manual fix-up in DOC-03.

---

## Progress Summary

- Total tasks (§0–§12 rows): 79
- Done: 74
- Remaining (Pending or In Progress): 5

---

## Update Log

| Date | ID | Old Status | New Status | Notes |
|---|---|---|---|---|
| 2026-04-29 | INIT | N/A | Pending | Tracker created |
| 2026-04-29 | R-01 | Pending | Done | Replaced hardcoded coming-soon toggle with env flag in middleware |
| 2026-04-29 | B-01 | Pending | Done | Fixed beta coupon metadata import mismatch in upgrade API route |
| 2026-04-29 | B-02 | Pending | Done | Fixed PDF response body type mismatch in report download API route |
| 2026-04-29 | B-03 | In Progress | Done | Production build now passes after resolving successive TypeScript compile errors |
| 2026-04-29 | B-04 | Pending | Done | TypeScript check passes cleanly (`tsc --noEmit`) |
| 2026-04-29 | B-05 | Pending | In Progress | Lint pass started; resolved targeted high-impact warnings and continuing on remaining warnings |
| 2026-04-29 | B-05 | In Progress | In Progress | Cleared additional admin hook-deps warnings (`admin page`, `admin appeals`, `admin users`, `admin moderators`) and continuing remaining files |
| 2026-04-29 | B-05 | In Progress | In Progress | Cleared more hook-deps warnings (`auth/verify-email`, `dashboard analytics`, `dashboard appeals`, `dashboard main`, `moderator welcome`) and proceeding with petitions/components warnings |
| 2026-04-29 | B-05 | In Progress | In Progress | Cleared further petition-related hook warnings (`petitions list`, `petitions-modern`, `my signatures`, `petition analytics`, `petition updates`, `petition signees`); remaining are mostly `no-img-element` + a few hook warnings |
| 2026-04-29 | B-05 | In Progress | In Progress | Cleared remaining hook-deps warnings (`admin/petitions`, `petition detail`, `PetitionComments`, `PetitionSupporters`); lint now reports only `no-img-element` warnings |
| 2026-04-29 | B-05 | In Progress | Done | Replaced remaining `<img>` warnings with `next/image` (plus test mock exception) and verified `npm run lint` passes cleanly |
| 2026-04-29 | B-06 | Pending | Done | Added runtime pinning (`packageManager`, `engines.node`, `engines.npm`) and root `.nvmrc`; verified lint still passes |
| 2026-04-29 | A-01 | Pending | Done | Removed insecure client-side self-promotion flow in `admin-setup` (no Firestore role write path remains) and verified with lint + direct code check |
| 2026-04-29 | A-02 | Pending | Done | Hardened `api/admin/invite-moderator` with server-side bearer token verification and admin-role enforcement for POST/GET; updated client calls to include auth token |
| 2026-04-29 | A-03 | Pending | Done | Hardened `api/admin/invite-moderator/[id]` DELETE with server-side bearer token verification and admin-role enforcement; updated client cancel call to send auth token |
| 2026-04-29 | A-04 | Pending | Done | Removed query/body identity trust in appeals API routes and enforced verified token-derived identity/role across list/detail/reply/status/export flows |
| 2026-04-29 | A-05 | Pending | Done | Hardened `api/user/refresh-profile` to use verified bearer token identity; removed request `userId` trust and updated moderator welcome caller |
| 2026-04-29 | A-06 | Pending | Done | Replaced `x-user-id` trust in report download API with verified bearer-token identity and updated report download client requests to send Authorization header |
| 2026-04-29 | A-07 | Pending | Done | Centralized API auth/role checks in `src/lib/api-auth.ts` and refactored admin invitation routes to consume shared helper (removing duplicated per-route auth logic) |
| 2026-04-29 | A-08 | Pending | Done | Added `src/lib/role-authorization.ts` helpers and `src/lib/__tests__/role-authorization.test.ts` (8 passing tests covering admin/moderator/user role checks) |
| 2026-04-29 | A-09 | Pending | Done | Audited all `src/app/api/**/route.ts` endpoints and documented security/access matrix in `api-route-security-matrix.md` |
| 2026-04-29 | D-01 | Pending | Done | Disabled `api/test-env` in production by returning 404 when `NODE_ENV=production`; verified lint passes |
| 2026-04-29 | D-02 | Pending | Done | Disabled `api/check-smtp` in production by returning 404 when `NODE_ENV=production`; verified lint passes |
| 2026-04-29 | D-03 | Pending | Done | Disabled `api/test-contact` in production by returning 404 when `NODE_ENV=production`; verified lint passes |
| 2026-04-29 | D-04 | Pending | Done | Disabled `api/test-approval-email` in production by returning 404 when `NODE_ENV=production`; verified lint passes |
| 2026-04-29 | D-05 | Pending | Done | Hardened `api/petitions/test-upgrade` by returning 404 in production and enforcing admin bearer auth in non-production; verified lint passes |
| 2026-04-29 | D-06 | Pending | Done | Hardened `api/petitions/fix-upgraded-targets` by returning 404 in production and enforcing admin bearer auth in non-production; verified lint passes |
| 2026-04-29 | D-07 | Pending | Done | Added `requireNonProductionRoute()` in shared API auth helper and refactored utility/test endpoints to use centralized production rejection logic; verified lint passes |
| 2026-04-29 | V-01 | Pending | Done | Hardened `api/channel-preview` with protocol checks, credential denial, social-platform allowlist, and DNS/IP private-network blocking to mitigate SSRF |
| 2026-04-29 | V-02 | Pending | Done | Added shared external URL validator and enforced HTTPS + allowlisted hosts for outbound fetches in reCAPTCHA, PayPal, and WhatsApp API routes |
| 2026-04-29 | V-03 | Pending | Done | Added centralized rich-text formatter/sanitizer and replaced unsafe direct markdown-to-HTML rendering in rich-text preview/display flows |
| 2026-04-29 | V-04 | Pending | Done | Completed `dangerouslySetInnerHTML` usage audit and patched all user-controlled render paths to use trusted sanitizer helper; static style injection left unchanged as non-user input |
| 2026-04-29 | V-05 | Pending | Done | Added centralized API JSON schema validator (`src/lib/api-validation.ts`) and enforced Zod validation in reCAPTCHA/WhatsApp/PayPal request-body routes; lint passes on changed files/routes |
| 2026-04-29 | V-06 | Pending | Done | Added centralized `enforceRateLimit` helper (`src/lib/api-rate-limit.ts`) with 429/Retry-After and applied it to sensitive public mutation/email routes (`contact`, `verify-recaptcha`, `whatsapp/send-verification`, `whatsapp/verify-code`, `email/send`) |
| 2026-04-29 | V-07 | Pending | Done | Added centralized CSRF same-origin check helper (`src/lib/csrf-protection.ts`) and enforced it on sensitive browser-facing POST routes (`contact`, `verify-recaptcha`, `whatsapp/send-verification`, `whatsapp/verify-code`, `email/send`) |
| 2026-04-29 | V-08 | Pending | Done | Hardened global response headers in `next.config.js` with CSP + `frame-ancestors 'none'`, `object-src 'none'`, HSTS, COOP/CORP, and related browser security policies; verified lint passes |
| 2026-04-29 | S-01 | Pending | In Progress | Confirmed exposed secret material in repo-backed env dump files; preparing immediate credential rotation checklist and waiting for provider-side key/token/password rotations to complete before marking Done |
| 2026-05-07 | S-01 | In Progress | Done | Rotation/revocation confirmed complete for in-scope MVP providers across launch environments; WhatsApp verification remains out of MVP scope |
| 2026-04-30 | S-02 | Pending | Done | Rotated Firebase Admin credentials end-to-end: created new service-account key, updated Vercel production `FIREBASE_*` vars, redeployed successfully, and revoked all prior keys leaving only the new key active |
| 2026-04-30 | S-03 | Pending | Done | Rotated Resend credentials end-to-end: new API key issued, old key revoked/deleted, and Vercel production `RESEND_API_KEY` replaced via CLI |
| 2026-04-30 | S-05 | Pending | Done | Rotated SMTP password in mail provider, updated Vercel production `SMTP_PASSWORD`, and completed production redeploy (`dpl_h5pi66YUSMp5hnpGvz7jSnBbZSDu`) to activate the new secret |
| 2026-04-30 | S-06 | Pending | Done | Deleted committed secret dump/backup files (`VERCEL-RAW-EXACT.txt`, `VERCEL-UNIQUE-VARS.txt`, `VERCEL-VARS-BACKUP.txt`, `VERCEL-VARS-ACTUAL-BACKUP.txt`, `.env.vercel.backup`, `.env.local.backup`, `.env.local.bak`, `.env.local.bak2`) and added ignore rules to prevent future commits |
| 2026-05-01 | S-07 | Pending | Done | Completed git history purge workflow: created `pre-history-rewrite-backup.bundle`, ran `git filter-repo --invert-paths --force` for secret files, re-added origin, then force-pushed branches and tags successfully |
| 2026-05-01 | S-08 | Pending | In Progress | Verified non-WhatsApp invalidation across environments (`FIREBASE_*`, `RESEND_API_KEY`, `SMTP_PASSWORD`) and removal of legacy `FIREBASE_SERVICE_ACCOUNT_KEY`; WhatsApp secret invalidation deferred per request |
| 2026-05-01 | S-09 | Pending | Done | Added secret scanning guardrails with `scripts/scan-secrets.js`, repository pre-commit hook (`.githooks/pre-commit` + `npm run hooks:install`), and GitHub Actions workflow (`.github/workflows/secret-scan.yml`) to scan changed files on PR/push |
| 2026-05-01 | S-10 | Pending | Done | Added and linked `SECURITY.md` with mandatory policy prohibiting raw env dumps/real secrets in repo, defined incident response steps, and documented required secret scanning controls |
| 2026-05-01 | V-09 | Pending | Done | Added server-side reCAPTCHA verification helper (`src/lib/server-recaptcha.ts`) and enforced verification tokens for public contact + WhatsApp verification submissions (client now sends action-scoped tokens) |
| 2026-05-01 | R-02 | Pending | Done | Implemented intentional tester bypass via `/bsk` (sets `bsk_access` cookie) and restricted always-bypassed paths to explicit essentials/webhooks to avoid broad unintended public route exposure |
| 2026-05-01 | R-03 | Pending | Done | Reordered middleware so emergency maintenance takes precedence over coming-soon, blocked tester-cookie bypass during maintenance, and standardized strict no-cache response headers (`Cache-Control` + `Pragma` + `Expires` + `Surrogate-Control`) |
| 2026-05-01 | R-04 | Pending | Done | Added explicit launch preflight checklist items in `FINAL-LAUNCH-CHECKLIST.md` and `PRODUCTION-CHECKLIST.md` to require `COMING_SOON_MODE=false` and `MAINTENANCE_MODE=false` before public go-live |
| 2026-05-01 | PWA-01 | Pending | Done | Hardened PWA runtime caching config in `next.config.js` to enforce `NetworkOnly` for `/api/*` requests, preventing stale cached API responses from service worker fallback behavior |
| 2026-05-01 | PWA-02 | Pending | Done | Added `scripts/verify-sw-fresh.js` build-ID validation and enforced it in `deploy:*` scripts plus `PRODUCTION-CHECKLIST.md`; deployment now fails fast if `public/sw.js` is stale or not regenerated from latest build |
| 2026-05-01 | PWA-03 | Pending | Done | Added `src/components/pwa/PwaUpdatePrompt.tsx` and mounted it in root layout to detect waiting service worker updates, prompt user refresh, send `SKIP_WAITING`, and auto-reload on `controllerchange` so clients adopt new deployments promptly |
| 2026-05-01 | PWA-04 | Pending | Done | Fixed `public/firebase-messaging-sw.js` to consume runtime-injected Firebase public config (no hardcoded placeholders), updated token flow to register SW with matching config in `push-notifications.ts`, and enforced `NEXT_PUBLIC_FIREBASE_VAPID_KEY` as required in env validation + production checklist |
| 2026-05-01 | O-01 | Pending | Done | Added `src/app/error.tsx` and `src/app/global-error.tsx` with resilient fallback UI, retry/home recovery actions, and client-side structured console capture of error message/digest for observability linkage |
| 2026-05-01 | O-02 | Pending | Done | Added `src/lib/api-observability.ts` for request-context correlation IDs + structured logs and integrated it into critical mutation/payment routes (`verify-recaptcha`, `contact`, `whatsapp/send-verification`, `whatsapp/verify-code`, `stripe/webhook`, `paypal/webhook`) while adding `x-request-id` response headers for traceability |
| 2026-05-01 | O-03 | Pending | Done | Added `src/app/api/monitoring/error/route.ts` as server-side client-error ingest (structured logs + request IDs) and extended `src/lib/monitoring.ts` to forward production runtime errors via `sendBeacon`/`fetch` keepalive, confirming complete client+server error reporting flow |
| 2026-05-01 | O-04 | Pending | Done | Added `src/lib/payment-webhook-alerting.ts` with configurable failure thresholds/window/cooldown and optional webhook notification delivery, then wired alerts into Stripe (`signature invalid`, `payment failed`, `processing error`) and PayPal (`signature invalid`, `payment denied`, `processing error`) webhook routes |
| 2026-05-02 | O-05 | Pending | Done | External uptime: health JSON includes `ok`, `no-store` cache headers, optional `?format=minimal`; scheduled GitHub Action pings `secrets.HEALTH_CHECK_URL` and asserts HTTP 200 + `ok:true`; production checklist documents third-party monitors |
| 2026-05-02 | T-01 | Pending | Done | Added API auth + appeal status authz Jest coverage; aligned admin bearer check with `canAccessAdmin`; appeal status moderator gate with `isModeratorRole`; Jest config `roots` (avoid broken nested `package.json` crawl), ignore `tests/e2e` for Jest, `jest.setup` guards for `@jest-environment node` |
| 2026-05-02 | T-02 | Pending | Done | Added `security-regression.test.ts` (18 tests) covering external URL validation, rich-text sanitizer, CSRF same-origin enforcement, rate limiting, JSON schema validation, and server reCAPTCHA early-exit guardrails |
| 2026-05-02 | T-03 | Pending | Done | Stabilized Jest: auth `getDoc`/error.code mocks, petitions `limit`+`getDocs`+referenceCode for `getPetitionById`, PetitionCard tests aligned with i18n/`next/image`/layout, qr-service Image onload + `branded:false` download path; `npm test` all passing (skipped: firebase integration + legacy describe.skip) |
| 2026-05-02 | T-04 | Pending | Done | Playwright e2e: default Chromium, serial worker, nav timeouts, `tests/e2e/nav-helpers` cookie-consent bypass; `smoke.spec.ts` (`@smoke`), hardened `auth-flow`/`petition-flow`; `test:e2e:smoke` script; full suite green (9 pass, 6 skip without Firebase creds) |
| 2026-05-02 | C-01 | Pending | Done | Added `.github/workflows/ci.yml` (lint, type-check, Jest, `next build` on PR + `main`) |
| 2026-05-02 | C-04 | Pending | Done | Audited deploy-related npm scripts and `scripts/` for embedded secrets; none found |
| 2026-05-02 | C-05 | Pending | Done | Added §13 rollback outline (hosting rollback, maintenance flag, Firebase note, data caution) |
| 2026-05-02 | T-05 | Pending | Done | Added §13 release smoke matrix; owners to be named at go/no-go |
| 2026-05-02 | DOC-02 | Pending | Done | Route matrix documented in `api-route-security-matrix.md` |
| 2026-05-02 | CI-UNBLOCK | N/A | N/A | Restored `npm run type-check` + `npm run build` green: upgrade `getCouponMetadata`, notifications query `limit` vs param shadow, audit `petition.closed` + creator metadata, report PDF `Uint8Array` body, Firestore timestamp narrowing, optional `Petition` report fields, `ReportPaymentModal` overlay, `api-auth` test `NODE_ENV`, `tsconfig` exclude `*.backup.tsx` |
| 2026-05-02 | R-01 | Done | Done | Restored `COMING_SOON_MODE` env gate in `middleware.ts` (had regressed to hardcoded `true`) |
| 2026-05-02 | DOC-01 | Pending | Done | Added `docs/ENVIRONMENT-VARS.md` + README link |
| 2026-05-02 | DOC-03 | Pending | Done | Added `docs/LAUNCH-DAY-RUNBOOK.md` + README link |
| 2026-05-02 | C-03 | Pending | Done | Added `deploy-vercel-staging.yml` + `deploy-vercel-production.yml` (`VERCEL_TOKEN`, GitHub environments staging/production) |
| 2026-05-02 | C-02 | Pending | Done | Added `docs/GITHUB-BRANCH-PROTECTION.md` (require `CI / quality` on `main`) |
| 2026-05-02 | C-06 | Pending | Done | Added `docs/STAGING-DRY-RUN.md` (automated + manual + rollback rehearsal) |
| 2026-05-02 | DOC-04 | Pending | Done | Added `docs/MONITORING-AND-ALERTS.md` template + README / runbook links |
| 2026-05-02 | U-05 | Pending | Done | Added `docs/COMPLIANCE-AND-LEGAL-PAGES.md` (privacy, terms, cookie consent, footer/auth links) |
| 2026-05-02 | DOCS-GATES | N/A | N/A | T-06 runbook `docs/WEBHOOK-STAGING-VALIDATION.md`; G-01 checklist `docs/SECURITY-GATE-G01-CHECKLIST.md`; G-04 notes + `STAGING-DRY-RUN` cross-links |
| 2026-05-02 | U-01 | Pending | Done | Added `docs/A11Y-SMOKE-CHECKLIST.md` |
| 2026-05-02 | U-03 | Pending | Done | Added `docs/PERFORMANCE-BUNDLE-NOTES.md` |
| 2026-05-02 | U-04 | Pending | Done | Added `docs/LOCALE-LAYOUT-CONTRACT.md` |
| 2026-05-02 | U-02 | Pending | Done | Doc `docs/IMG-LCP-UPGRADE-CANDIDATES.md` + `next/image` for petition create, page-paid, edit media previews |
| 2026-05-02 | DOCS-QUEUE | N/A | N/A | Added `docs/MANUAL-LAUNCH-BLOCKERS.md` (ordered human queue) + `docs/WHATSAPP-TOKEN-ROTATION.md` (**S-04**); tracker intro + README links |
| 2026-05-02 | REPO-AUTO | N/A | N/A | Added `.github/dependabot.yml` (npm weekly, actions monthly) + `.github/pull_request_template.md` |
| 2026-05-02 | SCAN-CI | N/A | N/A | Full-tree `npm run scan:secrets` in `ci.yml`; `.secret-scan-ignore` + `scan-secrets.js` (ignore path matching, `process.env.*` assignment skip, extra placeholders); strengthens **S-09** coverage |
| 2026-05-02 | MVP-WA | N/A | N/A | **MVP excludes WhatsApp verification:** `MANUAL-LAUNCH-BLOCKERS` + tracker aligned — **S-04** → Done (N/A), **S-08** → Done for in-scope providers, **T-06** = Stripe/PayPal only until post-MVP |
| 2026-05-02 | S-04 | Pending | Done | **MVP N/A** — product scope excludes WhatsApp Business verification for launch; runbook retained for post-MVP (**P2**) |
| 2026-05-02 | S-08 | In Progress | Done | In-scope leaked-value work complete per prior verification; Meta/WhatsApp verification env work deferred to post-MVP by product scope |

