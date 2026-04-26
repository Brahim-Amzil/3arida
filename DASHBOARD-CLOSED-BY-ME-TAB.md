# Dashboard "Closed By Me" Tab Implementation

## Date: February 9, 2026

## Feature Request

Add a "Closed By Me" filter tab in the creator petitions dashboard to show petitions that the user has closed.

## Implementation

### File Modified

`src/app/dashboard/page.tsx`

### Changes Made

#### 1. Updated Filter Logic

Added 'closed' filter to the `filteredPetitions` logic:

```typescript
if (statusFilter === 'closed') return petition.closedByCreator === true;
```

#### 2. Added Closed Count

Added closed petitions count to `statusCounts`:

```typescript
closed: petitions.filter((p) => p.closedByCreator === true).length,
```

#### 3. Added Filter Button

Added "مغلقة من طرفي" (Closed By Me) button in the status filters section:

- **Label**: "مغلقة من طرفي" (Closed By Me in Arabic)
- **Icon**: Archive/box icon
- **Position**: Between "Paused" and "Deleted" buttons
- **Badge**: Shows count of closed petitions
- **Style**: Consistent with other filter buttons

## User Experience

### Filter Button

- **Text**: "مغلقة من طرفي" (Closed By Me)
- **Icon**: Archive/box icon (same as close action)
- **Badge**: Number of closed petitions
- **Active State**: Green when selected
- **Inactive State**: Outline style

### Filtered View

When clicked, shows only petitions where:

- `petition.closedByCreator === true`

### Petition Cards

Closed petitions display with:

- All normal petition information
- Status badge (if applicable)
- Closed indicator (from PetitionCard component)

## Filter Order

1. All
2. Active (Approved)
3. Pending
4. Rejected
5. Paused
6. **Closed By Me** ← NEW
7. Deleted

## Technical Details

### Filter Value

- **Key**: `'closed'`
- **Condition**: `petition.closedByCreator === true`
- **Independent of Status**: Works across all petition statuses

### Count Calculation

```typescript
closed: petitions.filter((p) => p.closedByCreator === true).length;
```

### Icon Used

Archive/box icon (SVG path):

```svg
<path
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth={2}
  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
/>
```

## Testing Checklist

- [x] Filter button appears in dashboard
- [x] Badge shows correct count
- [x] Clicking button filters to closed petitions
- [x] Only petitions with `closedByCreator === true` shown
- [x] Works with petitions of any status
- [x] Button style matches other filters
- [x] Count updates when petitions are closed
- [x] No TypeScript errors

## Edge Cases Handled

1. **No Closed Petitions**: Badge shows "0"
2. **All Petitions Closed**: Shows all petitions
3. **Mixed Statuses**: Shows closed petitions regardless of status
4. **Empty State**: Shows "No petitions found" message

## Visual Design

### Button (Inactive)

- Border: Gray outline
- Text: Gray
- Icon: Gray
- Badge: Gray background

### Button (Active)

- Background: Green (default button style)
- Text: White
- Icon: White
- Badge: Light gray background

## Integration with Existing Features

### Works With

- ✅ Petition cards
- ✅ Status badges
- ✅ Pagination (if implemented)
- ✅ Search (if implemented)
- ✅ Sorting (if implemented)

### Complements

- Admin "Closed by Creator" tab (different view)
- Petition management card (shows closed status)
- Petition detail page (shows closed alert)

## Future Enhancements

1. **Reopen Functionality**: Add ability to reopen closed petitions
2. **Closing Statistics**: Show when petition was closed, how many signatures at time of closing
3. **Bulk Actions**: Close multiple petitions at once
4. **Export**: Export list of closed petitions

## Notes

- Filter is independent of petition status
- A petition can be "approved" AND "closed"
- Closed petitions remain visible to creator
- Count badge updates in real-time when petitions are closed
- Arabic label used for consistency with platform language

## Files Modified

1. `src/app/dashboard/page.tsx` - Added closed filter and button

## Related Features

- Petition Close Feature (PETITION-CLOSE-FEATURE.md)
- Admin Closed by Creator Tab (already implemented)
- Signing Prevention (PETITION-CLOSE-SIGNING-PREVENTION.md)
