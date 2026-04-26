# Help Page - Pricing FAQ Added

## Summary

Added a new FAQ section to the Help page explaining why #منصة_عريضة is not free.

## What Was Added

### New FAQ in Pricing & Payments Section

**Question:** لماذا #منصة_عريضة ليست مجانية؟

**Answer includes:**

1. Explanation that 3arida is an independent initiative
2. Not backed by any organization, institution, or company
3. Relies on service fees to cover operating and development costs

### Key Differentiators (Purple Box)

- No ads on the platform
- No selling of user data
- Complete independence in decisions
- Transparent pricing

### Comparison Note

Explains that foreign petition platforms are backed by large NGOs and receive funding from public and private institutions plus user tips, allowing them to offer free services.

## File Modified

- `src/app/help/page.tsx` - Added new FAQ div in Pricing & Payments section (around line 380)

## Design

- Purple-themed highlight box (`bg-purple-50`, `border-purple-200`)
- Clean, organized layout matching existing help page style
- RTL-aligned Arabic text
- Comparison note in smaller text with bold "ملاحظة:" prefix

## Search Functionality

The new FAQ content is hardcoded in Arabic (not using translation keys), so it will only appear when:

- No search query is active (shows all content)
- Search query matches existing translation keys in the Pricing & Payments section

**Note:** If search functionality needs to find this new FAQ, the text would need to be added to translation files and use `t()` function like other sections.

## Status

✅ Complete - FAQ added and server running on http://localhost:3001/help

## Next Steps (Optional)

If you want the new FAQ to be searchable:

1. Add translation keys to `messages/ar.json` and `messages/en.json`
2. Update the FAQ to use `t()` function
3. Add translation keys to the `filterContent()` check for Pricing & Payments section
