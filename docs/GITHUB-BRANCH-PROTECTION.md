# GitHub branch protection (required checks)

This satisfies launch task **C-02**: merges to `main` should be blocked until automated quality checks pass.

## Prerequisites

- The [`CI` workflow](../.github/workflows/ci.yml) has completed successfully at least once on the default branch (so the check name appears in the branch protection UI).
- Optional: [`Secret Scan`](../.github/workflows/secret-scan.yml) as an additional required check.

## Steps (repository admins)

1. Open the repo on GitHub → **Settings** → **Branches**.
2. Under **Branch protection rules**, **Add rule** (or edit the existing rule) for branch name pattern `main`.
3. Enable:
   - **Require a pull request before merging** (recommended).
   - **Require status checks to pass before merging**.
   - **Require branches to be up to date before merging** (recommended).
4. In **Status checks that are required**, search and add:
   - `quality` — this is the **job id** from `ci.yml` (GitHub shows it as `CI / quality` in the checks API; in the UI you often pick the combined name that matches your last run).
5. If the UI lists the workflow as **`CI / quality`**, select that entry so every PR must pass lint, type-check, tests, and production build.
6. Save the rule.

### If the check does not appear

- Push a commit to `main` or open a PR so `ci.yml` runs once.
- Refresh the branch protection page; GitHub populates check names from recent runs.

### Optional hardening

- **Require approval** of the most recent reviewable push.
- **Do not allow bypassing** the above settings (admins included), if your org policy allows.

## Related

- [`docs/LAUNCH-DAY-RUNBOOK.md`](./LAUNCH-DAY-RUNBOOK.md) — go-live order assumes CI is green before merge.
