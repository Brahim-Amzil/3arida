# Contact Moderator - Tier Restriction Implementation

## Feature Overview

Implemented a tier-based restriction for the "Contact Moderator" feature, making direct moderator appeals exclusive to paid petitions while providing an alternative "Contact Support" option for free petitions.

## Business Logic

### Free Tier Petitions

- **Contact Moderator**: Disabled (grayed out with lock icon)
- **Contact Support**: Enabled (redirects to general contact form)
- **Inline Message**: Shows when clicking locked button explaining the restriction

### Paid Tier Petitions (Basic+)

- **Contact Moderator**: Fully enabled (opens appeal modal)
- **Contact Support**: Also available as alternative
- **No Restrictions**: Direct access to moderator appeals system

## Implementation

### New Component: `ContactButtons.tsx`

Created a reusable component that handles both buttons with smart logic:

**Features:**

- Two buttons side-by-side: "Contact Moderator" + "Contact Support"
- Automatic tier detection using `canAccessAppeals(petition.pricingTier)`
- Lock icon on disabled moderator button for free tiers
- Inline warning message (auto-dismisses after 5 seconds)
- Responsive design (stacks on mobile)
- Variant support for different contexts (rejected/paused)

**Visual States:**

```
Free Tier:
[🔒 Contact Moderator (grayed)] [Contact Support (blue)]
└─ Shows inline message when clicked

Paid Tier:
[Contact Moderator (red/orange)] [Contact Support (blue)]
└─ Both fully functional
```

### Files Modified

1. **`src/components/moderation/ContactButtons.tsx`** (NEW)
   - Handles tier checking
   - Manages button states
   - Shows inline locked message
   - Provides both contact options

2. **`src/app/petitions/[id]/page.tsx`**
   - Added import for `ContactButtons`
   - Replaced old single button with new component
   - Applied to both rejected and paused petition sections

## User Experience

### For Free Tier Users:

1. See both buttons (moderator button is grayed with lock)
2. Click "Contact Moderator" → Inline message appears
3. Message explains: "Direct moderator contact is for paid petitions only"
4. Can use "Contact Support" button instead
5. Message auto-dismisses after 5 seconds

### For Paid Tier Users:

1. See both buttons (both fully enabled)
2. Click "Contact Moderator" → Opens appeal modal
3. Click "Contact Support" → Redirects to contact form
4. Full access to direct moderator appeals

## Inline Message Content

**Arabic:**

```
التواصل المباشر مع المشرفين متاح للعرائض المدفوعة فقط
يمكنك استخدام نموذج الدعم العام أو ترقية عريضتك للحصول على دعم مباشر من المشرفين
```

**Translation:**
"Direct contact with moderators is available for paid petitions only. You can use the general support form or upgrade your petition to get direct support from moderators."

## Benefits

### Business Value:

- Clear monetization incentive
- Reduces moderator workload (fewer frivolous appeals)
- Encourages petition upgrades
- Maintains fair access (support form available)

### User Experience:

- Transparent about restrictions
- Provides clear alternative
- No dead ends or frustration
- Inline feedback (no navigation required)

### Technical:

- Reusable component
- Consistent with existing tier system
- Easy to maintain
- Follows existing patterns

## Testing Checklist

- [ ] Free petition shows locked moderator button (80-100% opacity, clearly visible)
- [ ] Paid petition shows enabled moderator button
- [ ] Clicking locked button shows inline message
- [ ] Message auto-dismisses after 5 seconds
- [ ] Contact Support button works for both tiers
- [ ] Contact Moderator opens modal for paid tiers
- [ ] Responsive design works on mobile
- [ ] Works for both rejected and paused petitions
- [ ] Lock icon displays correctly
- [ ] Helper text shows for free tier

## Button Visibility Fix (Feb 3, 2026)

### Issue

The disabled "Contact Moderator" button for free tier petitions was nearly invisible, making it hard for users to see the option exists.

### Solution

Updated button styling for locked state:

- Changed text color: `text-gray-600` → `text-gray-700` (darker, more visible)
- Changed border: `border-gray-300` → `border-gray-400` (stronger outline)
- Added background: `bg-gray-50` (better contrast)
- Added `!opacity-100` to override Button component's default `disabled:opacity-50`
- Lock icon remains as clear visual indicator of locked state

### Result

Button is now fully visible (100% opacity) with lock icon clearly indicating it's restricted to paid tiers.

## Future Enhancements

Potential improvements:

1. Add "Upgrade" button in the inline message
2. Track clicks on locked button (analytics)
3. A/B test message wording
4. Add tooltip on hover for locked button
5. Animate the inline message appearance
