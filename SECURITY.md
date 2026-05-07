# Security Policy

This document defines mandatory security handling for this repository.

## Supported Versions

Only the latest production branch/version is supported for security fixes.

## Secret Handling Policy (Mandatory)

- Never commit real credentials, API keys, private keys, tokens, or passwords.
- Never commit raw environment dumps (for example: `VERCEL-RAW-EXACT.txt`, `.env.*.backup`, copied dashboard exports).
- Use `.env.local` only for local development and keep it untracked.
- Use `.env.example` for placeholders only (never real values).
- Use the platform secret managers for runtime values:
  - Vercel Environment Variables
  - Firebase/Google Cloud secret/config screens
  - Provider dashboards (Stripe, PayPal, Resend, Meta, SMTP provider)

## Required Local and CI Checks

- Local pre-commit scanning is required via `.githooks/pre-commit`.
- CI scanning is required via `.github/workflows/secret-scan.yml` (changed files on PR/push).
- The **`CI`** workflow also runs `npm run scan:secrets` (**full git tree**) so `src/`, `middleware.ts`, and new files are checked every time. Legacy paths listed in **`.secret-scan-ignore`** are skipped only for that full pass so historic docs/scripts do not block merges. **If those values were already rotated at the provider**, they are no longer *usable* secrets—but literal strings still look like secrets to heuristics, so redacting or replacing them with placeholders is still worth doing to shrink the ignore list and avoid copy-paste mistakes. **Do not** add new real credentials under ignored paths; prefer redacting legacy material and removing entries from `.secret-scan-ignore` over time.
- If the scanner flags a potential secret, remove it or replace it with placeholders before commit/merge.

## Installing Local Hook

Run once after cloning:

```bash
npm run hooks:install
```

## Incident Response

If a secret is exposed:

1. Revoke/rotate the credential immediately in the provider dashboard.
2. Update all affected environments (Production, Preview, Development).
3. Remove secret-bearing files from the repository.
4. Purge sensitive data from Git history if needed.
5. Document the incident and mitigation in `launch-preparation-tracker.md`.

## Reporting a Vulnerability

For security vulnerabilities, do not open a public issue with exploit details.
Report privately to the repository owner/maintainers with:

- Impacted area
- Reproduction steps
- Potential impact
- Suggested mitigation (if known)
