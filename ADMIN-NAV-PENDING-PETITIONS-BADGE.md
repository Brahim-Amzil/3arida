# Admin Navigation - Pending Petitions Badge

## Issue

The "العرائض" (Petitions) tab in the admin navigation did not show a red badge with the count of pending petitions, unlike the "الطعون" (Appeals) tab which correctly showed the count.

## Solution

Added pending petitions count badge to the AdminNav component, matching the existing appeals badge functionality.

### Changes Made

1. **Added state for pending petitions count** (line 14)

   ```typescript
   const [pendingPetitionsCount, setPendingPetitionsCount] = useState(0);
   ```

2. **Added useEffect to fetch pending petitions count** (lines 232-256)
   - Queries Firestore for petitions with status 'pending'
   - Updates count every 30 seconds (auto-refresh)
   - Handles errors gracefully

3. **Added badge display for petitions tab** (lines 308-314)
   - Shows red badge with count when pendingPetitionsCount > 0
   - Matches the styling of the appeals badge
   - Only shows when there are pending petitions

## Implementation Details

### Firestore Query

```typescript
const petitionsRef = collection(db, 'petitions');
const pendingQuery = query(petitionsRef, where('status', '==', 'pending'));
const snapshot = await getDocs(pendingQuery);
setPendingPetitionsCount(snapshot.size);
```

### Badge Display Logic

- Badge appears next to "العرائض" tab name
- Red background (`bg-red-600`)
- White text (`text-white`)
- Rounded pill shape (`rounded-full`)
- Only visible when count > 0

### Auto-Refresh

- Count refreshes every 30 seconds automatically
- Ensures moderators/admins see up-to-date counts
- Cleanup on component unmount

## Files Modified

- `src/components/admin/AdminNav.tsx`

## Visual Result

The "العرائض" (Petitions) tab now shows a red badge with the number of pending petitions, just like the "الطعون" (Appeals) tab shows its count.

Example:

```
العرائض [1]  الطعون [3]
```

Where [1] and [3] are red circular badges with white text.

## Testing

- [x] Badge appears when there are pending petitions
- [x] Badge shows correct count
- [x] Badge updates automatically every 30 seconds
- [x] Badge disappears when count is 0
- [x] No TypeScript errors
- [x] Matches appeals badge styling

## Status

✅ **COMPLETE** - Ready for use
