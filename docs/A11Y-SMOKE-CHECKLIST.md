# Accessibility smoke pass (**U-01**)

Run once per major release on **Chrome + Safari (iOS)** at minimum. Record pass/fail in the launch tracker or a ticket.

## Global

- [ ] **Keyboard**: `Tab` / `Shift+Tab` moves focus visibly; no keyboard traps in modals/menus
- [ ] **Skip**: If you add a skip link later, verify it targets main content
- [ ] **Focus ring**: Interactive controls show focus state (not `outline: none` without replacement)

## Forms (auth, petition create, contact)

- [ ] Every text field has an associated **label** (visible or `aria-label`)
- [ ] Required fields announced in error summary (or inline errors tied to fields with `aria-describedby` where applicable)
- [ ] Submit buttons reachable without mouse

## Media

- [ ] Non-decorative images have meaningful **`alt`** (or `alt=""` if decorative only)
- [ ] Icon-only buttons have **`aria-label`**

## Locale / direction

- [ ] Arabic (`ar`): RTL layout does not clip primary actions; French (`fr`): LTR consistent
- [ ] See also [`LOCALE-LAYOUT-CONTRACT.md`](./LOCALE-LAYOUT-CONTRACT.md)

## Color & motion

- [ ] Body text meets contrast on primary backgrounds (spot-check hero + cards)
- [ ] No seizure-risk flashing; respect `prefers-reduced-motion` where animations are heavy (optional hardening)

## Sign-off

| Reviewer | Date | Browsers / devices |
|----------|------|--------------------|
| | | |
