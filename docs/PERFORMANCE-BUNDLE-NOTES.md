# Bundle & runtime performance (**U-03**)

Focus: **petition create**, **petition detail**, and dashboard shells (largest client components).

## Quick measurements

1. **Production build analysis** (local):
   ```bash
   ANALYZE=true npm run build
   ```
   Open generated report under `.next/analyze` (see webpack-bundle-analyzer output path in console).

2. **Lighthouse** (staging URL, incognito, throttling on):
   - Targets: LCP under ~2.5s on petition **detail** on mid-tier mobile where possible
   - Watch **Total Blocking Time** on create flow (many client hooks)

## Code-level checklist

- [ ] **Dynamic import** for below-the-fold panels (analytics, heavy modals) where `next/dynamic` + `ssr: false` is acceptable
- [ ] **Lists**: virtualize or paginate very long supporter/comment lists if profiling shows jank
- [ ] **Images**: follow [`IMG-LCP-UPGRADE-CANDIDATES.md`](./IMG-LCP-UPGRADE-CANDIDATES.md)
- [ ] **Firebase listeners**: ensure unsubscribe on unmount for real-time subscriptions on detail/dashboard

## Server vs client

- Prefer **Server Components** for static petition metadata where the App Router tree allows it
- Keep `'use client'` boundaries **small**; avoid fetching in `useEffect` when a server loader or route handler can supply data

## Sign-off

| Page | LCP (mobile est.) | Notes | Date |
|------|-------------------|-------|------|
| `/petitions/[id]` | | | |
| `/petitions/create` | | | |
