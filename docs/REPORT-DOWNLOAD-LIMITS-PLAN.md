# Report PDF Download Limits — Plan & Tasks

**Goal:** Stop Puppeteer/PDF abuse while keeping MVP checkout (BETA100) free. **Report downloads use tier quotas**, not unlimited launch mode.

**Policy (per petition):**

| Tier | Free downloads | After quota |
|------|----------------|-------------|
| **Paid** (incl. BETA100 checkout) | 10 | **10 MAD** per extra download |
| **Free** | 4 | **19 MAD** for one download **or** upgrade plan (recommended) |

**Important:** `NEXT_PUBLIC_BETA_MODE=true` keeps **petition creation checkout** at 100% off. It does **not** mean unlimited PDF downloads.

---

## Architecture

1. **`report-access-control.ts`** — single source for quotas, prices, button state
2. **`report-download-access-server.ts`** — enforce before `recordDownload` + PDF generation
3. **`ReportDownloadLimitModal`** — free-tier exhausted: pay 19 MAD vs upgrade
4. **`ReportPaymentModal`** — paid-tier extra downloads (10 MAD); extend for free one-off (19 MAD)
5. **All download APIs** — same counter (`reportDownloads`), including verify-page creator path

---

## Task list

| ID | Task | Priority | Status | Owner |
|----|------|----------|--------|-------|
| RPT-01 | Update `report-access-control` quotas (10 paid / 4 free, 10/19 MAD) | P0 | Done | `src/lib/report-access-control.ts` |
| RPT-02 | Remove unlimited PDF bypass from `isLaunchMode()` in report billing | P0 | Done | BETA100 only affects checkout |
| RPT-03 | Add `ReportDownloadLimitModal` (19 MAD vs upgrade + perks) | P0 | Done | `ReportDownloadLimitModal.tsx` |
| RPT-04 | Wire modal + button states in `ReportDownloadButton` and parents | P0 | Done | Card, section, verify page |
| RPT-05 | Enforce limits on generate + download + verify PDF APIs | P0 | Done | Verify route no longer public in launch mode |
| RPT-06 | Stripe one-off payment for report download (10 MAD / 19 MAD) | P0 | Done | Stripe PaymentIntent + pay/download progress modal |
| RPT-07 | Arabic UI copy (badges, modal, verify page) | P1 | Done | |
| RPT-08 | Unit tests for `report-access-control` | P1 | Done | 14 tests |
| RPT-09 | Manual smoke: free 4→modal, paid 10→10 MAD, verify counts | P0 | Done | Prod smoke passed 2026-06-04 |

---

## Execution order

1. RPT-01 + RPT-02 (access control)
2. RPT-03 + RPT-04 (UI modal + button)
3. RPT-05 (API enforcement + verify page)
4. RPT-06 (Stripe — can ship stub modal first, block until paid)
5. RPT-07 + RPT-08 + RPT-09

---

## Upgrade perks (free-tier modal — Option B)

- 10 free report downloads per petition (vs 4)
- 10 MAD per extra download (vs 19 MAD)
- Existing paid-tier benefits (signatures, QR, etc. per selected plan)

---

## Vercel env (unchanged for MVP checkout)

```
NEXT_PUBLIC_BETA_MODE=true   # BETA100 on create/upgrade checkout only
```

Report limits apply **even when** `BETA_MODE=true`.

---

## Update log

| Date | ID | Notes |
|------|-----|-------|
| 2026-05-22 | PLAN | Plan created; execution started (RPT-01+) |
| 2026-05-22 | RPT-01–RPT-05, RPT-07–RPT-08 | Implemented quotas, limit modal, API enforcement, tests |
| 2026-06-04 | RPT-06, RPT-09 | Stripe report pay + full prod QA complete |
