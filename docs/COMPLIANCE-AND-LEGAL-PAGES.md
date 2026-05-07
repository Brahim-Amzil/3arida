# Legal, privacy, and consent (**U-05**)

Inventory of first-party legal/consent surfaces in this app. Use for QA before launch (copy, links, locale).

## Routes

| Path | Source | Notes |
|------|--------|------|
| `/privacy` | `src/app/privacy/page.tsx` | Privacy policy |
| `/terms` | `src/app/terms/page.tsx` | Terms of use |
| Cookie banner | `src/components/legal/CookieConsent.tsx` | Mounted in `src/app/layout.tsx` (and alternate layout under `Improving UI Design/layout.tsx`) |

## QA checklist

- [ ] **Privacy** and **Terms** render in default locale(s); no broken internal links; contact/support link if promised in copy
- [ ] **Cookie consent**: banner appears for new sessions; accept/dismiss persists (e.g. `localStorage` key used by `CookieConsent`); no overlay blocking primary nav after accept
- [ ] Footer / auth footers link to `/privacy` and `/terms` (e.g. `src/components/layout/Footer.tsx`, `src/app/auth/login/page.tsx`, `CookieConsent.tsx`)
- [ ] **Coming soon / maintenance**: if enabled, confirm legal pages remain reachable if they are on the bypass list (see `middleware.ts`)

## Post-launch

- [ ] Legal owner approves final text version and date stamp in page copy if required by counsel
