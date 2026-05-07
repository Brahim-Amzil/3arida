# API Route Security Matrix

Audit scope: `src/app/api/**/route.ts`  
Audit date: 2026-04-29

## Access Levels
- `Public`: no user auth required
- `Authenticated`: verified bearer token required
- `Moderator+`: authenticated user with moderator/admin role
- `Admin`: authenticated user with admin role
- `Webhook/Public+Secret`: public endpoint but protected by webhook signature/verify token

## Route Matrix

| Route | Methods | Current Access | Notes |
|---|---|---|---|
| `/api/admin/invite-moderator` | `GET`, `POST` | `Admin` | Uses shared `requireAdminApiRequest`. |
| `/api/admin/invite-moderator/[id]` | `DELETE` | `Admin` | Uses shared `requireAdminApiRequest`. |
| `/api/appeals` | `GET` | `Authenticated` | Identity/role derived from bearer token. |
| `/api/appeals/create` | `POST` | `Public` | Validation pass-through route; no auth enforcement in route. |
| `/api/appeals/[id]` | `GET` | `Authenticated` | Identity/role derived from bearer token. |
| `/api/appeals/[id]/reply` | `POST` | `Authenticated` | Role evaluated server-side; internal notes require moderator role. |
| `/api/appeals/[id]/status` | `PATCH` | `Moderator+` | Enforced via token + role check (`isModeratorRole`). |
| `/api/appeals/[id]/export` | `GET` | `Authenticated` | Access filtered to owner/moderator/admin via server-side checks. |
| `/api/auth/session` | `GET` | `Public` | Session status endpoint; no bearer guard. |
| `/api/channel-preview` | `POST` | `Public` | External fetch surface; SSRF protections tracked separately (`V-01`). |
| `/api/check-smtp` | `GET` | `Public` | Debug/operational endpoint; tracked under debug hardening tasks. |
| `/api/contact` | `POST` | `Public` | User-facing contact form endpoint. |
| `/api/coupons/use` | `POST` | `Public` | No token guard in route. |
| `/api/coupons/validate` | `POST` | `Public` | No token guard in route. |
| `/api/email/send` | `POST` | `Public` | Internal mail send path currently unauthenticated in route. |
| `/api/email/welcome` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/milestone` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/petition-approved` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/petition-rejected` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/petition-paused` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/petition-deleted` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/petition-update` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/signature-confirmation` | `POST` | `Public` | No bearer guard in route. |
| `/api/email/platform-support-thanks` | `POST` | `Public` | No bearer guard in route. |
| `/api/health` | `GET` | `Public` | Intended uptime/health endpoint. |
| `/api/moderator/validate-invitation` | `GET` | `Public` | Token-based invitation validation endpoint. |
| `/api/moderator/accept-invitation` | `POST` | `Public` | Accept flow trusts request user identity; should align with token-auth strategy. |
| `/api/paypal/create-order` | `POST` | `Public` | Uses server-to-server PayPal token; user auth not enforced. |
| `/api/paypal/capture-order` | `POST` | `Public` | Uses server-to-server PayPal token; user auth not enforced. |
| `/api/paypal/webhook` | `POST` | `Webhook/Public+Secret` | Public webhook endpoint; validates signature. |
| `/api/petitions/fix-upgraded-targets` | `POST` | `Public` | Maintenance mutation endpoint; should be restricted (`D-06`). |
| `/api/petitions/test-upgrade` | `POST` | `Public` | Test mutation endpoint; should be restricted (`D-05`). |
| `/api/petitions/upgrade` | `POST` | `Public` | Payment/upgrade flow route; user auth not currently enforced at route layer. |
| `/api/petitions/[code]` | `GET` | `Public` | Petition detail retrieval route. |
| `/api/petitions/[code]/check-tier` | `GET` | `Public` | Tier visibility endpoint. |
| `/api/petitions/[code]/report` | `POST` | `Public` | Report/payment orchestration path; no bearer guard in route. |
| `/api/petitions/[code]/report/generate` | `POST` | `Public` | Report generation path currently accepts request-supplied user identity. |
| `/api/petitions/[code]/report/download` | `GET` | `Authenticated` | Hardened to use bearer token identity. |
| `/api/push/send` | `POST` | `Public` | Push send endpoint currently unauthenticated in route. |
| `/api/reports/verify/[petitionId]` | `GET` | `Public` | Public report verification endpoint. |
| `/api/stripe/create-payment-intent` | `POST` | `Public` | Stripe payment route; no bearer guard in route. |
| `/api/stripe/create-donation-intent` | `POST` | `Public` | Stripe donation route; no bearer guard in route. |
| `/api/stripe/webhook` | `POST` | `Webhook/Public+Secret` | Public webhook endpoint; signature-validated. |
| `/api/test-approval-email` | `GET` | `Public` | Debug/test endpoint; tracked under debug hardening. |
| `/api/test-contact` | `POST` | `Public` | Debug/test endpoint; tracked under debug hardening. |
| `/api/test-env` | `GET` | `Public` | Debug environment endpoint; tracked under debug hardening. |
| `/api/user/refresh-profile` | `POST` | `Authenticated` | Hardened to use bearer token identity only. |
| `/api/verify-recaptcha` | `POST` | `Public` | Public verification endpoint for anti-bot flow. |
| `/api/whatsapp/send-verification` | `POST` | `Public` | Uses WhatsApp service token server-side; no user bearer requirement. |
| `/api/whatsapp/verify-code` | `POST` | `Public` | User verification flow endpoint. |
| `/api/whatsapp/webhook` | `GET`, `POST` | `Webhook/Public+Secret` | Uses verify token / webhook auth checks. |

## Summary
- Total audited route files: **51**
- `Admin`: **2**
- `Moderator+`: **1**
- `Authenticated`: **5**
- `Webhook/Public+Secret`: **3**
- `Public` (no bearer guard in route): **40**

## Follow-up Priorities
- Align remaining identity-sensitive routes to token-derived identity (avoid request-supplied `userId`/`userRole`).
- Restrict debug/test/maintenance endpoints (`test-*`, `check-smtp`, `fix-upgraded-targets`, `test-upgrade`) before production.
- Apply explicit auth/role requirements to mutation endpoints that trigger emails, payments, notifications, or state changes.
