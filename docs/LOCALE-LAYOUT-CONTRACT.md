# Locales, layout, and hydration (**U-04**)

## Supported locales

Defined in [`src/i18n.ts`](../src/i18n.ts):

- `locales`: `ar`, `fr`
- `defaultLocale`: `ar`
- `timeZone`: `Africa/Casablanca` (passed into `next-intl` request config)

Messages live under `messages/ar.json` and `messages/fr.json`.

## Layout structure

| Layer | File | Responsibility |
|-------|------|------------------|
| Root (fonts, global providers) | `src/app/layout.tsx` | App-wide fonts, `CookieConsent`, PWA prompts, `AuthProvider`, etc. |
| Locale segment | `src/app/[locale]/layout.tsx` | `html lang={locale}` `dir={rtl|ltr}`, `NextIntlClientProvider` + `getMessages()`, Analytics |

**`generateStaticParams`** on `[locale]/layout.tsx` prebuilds `ar` and `fr` params.

## Hydration expectations

- **`NextIntlClientProvider`** must wrap client components that call `useTranslations()`.
- Avoid **locale mismatch**: server-rendered tree should use the same `locale` segment as the URL.
- Client-only APIs (`window`, `localStorage`) belong in `useEffect` or small client leaf components — not during render of server components.

## QA matrix

| Check | `ar` | `fr` |
|-------|------|------|
| `dir=rtl` / `ltr` on `<html>` and body classes | | |
| No clipped primary CTA in nav + petition actions | | |
| Date/number formatting acceptable for Morocco users | | |
| Switching locale (if you expose a switch) updates messages without full reload errors | | |

## Middleware note

Root [`middleware.ts`](../middleware.ts) handles maintenance, coming-soon, rate limits, and `/bsk` bypass. It does **not** rewrite locale prefixes; ensure your **public routes** that need locale use the `[locale]` segment or consistent links (`/ar/...`, `/fr/...`) per your routing strategy.

## Sign-off

| Reviewer | Date | Result |
|----------|------|--------|
| | | |
