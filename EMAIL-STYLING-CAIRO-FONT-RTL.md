# Email Styling - Cairo Font & RTL Alignment

## Changes Made

Updated the base email styles to use **Cairo font** and proper **right-to-left (RTL) alignment** for all petition status emails, matching the donation thank you email style.

## Updated Styles

### Font

- **Primary Font:** Cairo (Google Fonts)
- **Fallback Fonts:** System fonts (Apple, Segoe UI, Roboto, etc.)
- **Font Import:** `@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');`

### RTL Alignment

- **Body:** `direction: rtl; text-align: right;`
- **Container:** `direction: rtl;`
- **Header:** `direction: rtl; text-align: center;` (centered for header)
- **Content:** `direction: rtl; text-align: right;`
- **All text elements:** `text-align: right; direction: rtl;`

### List Styling

- **Padding:** `padding-right: 20px; padding-left: 0;` (bullets on the right)

### Button Styling

- **Font:** Uses Cairo font
- Maintains existing gradient and styling

## Affected Emails

All petition status emails now use Cairo font and RTL alignment:

1. ✅ **Petition Approved** - Green gradient header
2. ❌ **Petition Rejected** - Red gradient header
3. ⏸️ **Petition Paused** - Orange gradient header
4. 🗑️ **Petition Deleted** - Dark red gradient header
5. ✍️ **Signature Confirmation** - Existing email
6. 📢 **Petition Update** - Existing email
7. 🎯 **Milestone Reached** - Existing email
8. 🎉 **Welcome Email** - Existing email
9. 💝 **Donation Thank You** - Already using Cairo (reference)

## Visual Improvements

### Before

- Generic system fonts
- Left-aligned text (incorrect for Arabic)
- No RTL support
- Inconsistent with donation emails

### After

- ✅ Cairo font (professional Arabic typography)
- ✅ Right-aligned text (correct for Arabic)
- ✅ Full RTL support (direction: rtl)
- ✅ Consistent with donation thank you emails
- ✅ Bullets appear on the right side
- ✅ Proper text flow for Arabic content

## Technical Details

### CSS Applied

```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

body {
  font-family:
    'Cairo',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  direction: rtl;
  text-align: right;
}

.container {
  direction: rtl;
}

.content {
  direction: rtl;
  text-align: right;
}

.content h2,
.content h3,
.content p,
.content ul,
.content li {
  text-align: right;
  direction: rtl;
}

.content ul {
  padding-right: 20px;
  padding-left: 0;
}
```

### Font Weights Available

- **400:** Regular (body text)
- **600:** Semi-bold (headings)
- **700:** Bold (emphasis)

## Files Modified

- `src/lib/email-service.ts` - Updated `getBaseEmailStyles()` function

## Testing

To test the new styling:

1. **Send test email:**

   ```
   http://localhost:3001/api/test-approval-email?email=YOUR_EMAIL
   ```

2. **Check email appearance:**
   - ✅ Text is right-aligned
   - ✅ Cairo font is used
   - ✅ Bullets appear on the right
   - ✅ Proper Arabic text flow
   - ✅ Matches donation thank you email style

3. **Test all email types:**
   - Approve a petition
   - Reject a petition
   - Pause a petition
   - Delete a petition

## Browser/Email Client Compatibility

Cairo font is loaded from Google Fonts, which is supported by:

- ✅ Gmail
- ✅ Outlook.com
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Most modern email clients

If the font fails to load, it falls back to system fonts while maintaining RTL alignment.

## Status

✅ **COMPLETE** - All emails now use Cairo font with proper RTL alignment
