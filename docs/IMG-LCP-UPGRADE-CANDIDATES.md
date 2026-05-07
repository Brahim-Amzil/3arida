# `<img>` → `next/image` (**U-02** — LCP candidates)

`next lint` may still flag `@next/next/no-img-element` on large client pages. Prioritize **above-the-fold** and **petition hero** imagery first.

## Known hotspots (grep snapshot)

| Area | File (approx.) | Notes |
|------|------------------|--------|
| Petition create (media preview) | `src/app/petitions/create/page.tsx` | **Done** — `next/image` `fill` + fixed-height container |
| Petition create (paid variant) | `src/app/petitions/create/page-paid.tsx` | **Done** — same |
| Petition edit | `src/app/petitions/[id]/edit/page.tsx` | **Done** — existing media grid |
| Admin | `src/app/admin/petitions/page.tsx` | Thumbnails if still `<img>` |
| Layout / marketing | `src/components/layout/Header.tsx`, influencer/petition cards | Audit with `npm run lint` output |

## Migration pattern

- Prefer **`next/image`** with explicit `width` / `height` or `fill` + sized container
- Remote URLs must be allowed in [`next.config.js`](../next.config.js) `images.domains` / `remotePatterns`
- For **user-uploaded** or **dynamic** URLs, ensure domain allowlist covers Firebase Storage hosts already listed in config

## When **not** to force `next/image`

- Tiny icons inlined with known dimensions sometimes stay `<img>` if wrapped in tests — prefer consistency with design system

## Task status

Petition **create** / **create (paid)** / **edit** preview grids use **`next/image`**. Remaining `<img>` elsewhere (admin, layout, marketing) can be tracked with `npm run lint` — treat as incremental **U-02** follow-up if warnings persist.
