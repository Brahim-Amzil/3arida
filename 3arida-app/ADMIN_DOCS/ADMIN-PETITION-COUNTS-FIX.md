# Admin Petition Counts Fix

## Problem

In the admin "Petition Moderation" page, all tab counts were showing `0` even when petitions existed in the database. This was because:

1. The counts were calculated from the `petitions` state array
2. The `petitions` array was filtered based on the active tab
3. When calculating counts, it was filtering an already-filtered array
4. Result: All tabs showed 0 because the filtered array didn't contain petitions from other statuses

## Solution

Changed the approach to:

1. Always load ALL petitions from the database
2. Store all petitions in a separate `allPetitions` state
3. Calculate tab counts from `allPetitions` (which contains all statuses)
4. Filter `petitions` for display based on the active tab

## Changes Made

### File: `3arida-app/src/app/admin/petitions/page.tsx`

#### 1. Added `allPetitions` State

```typescript
const [allPetitions, setAllPetitions] = useState<Petition[]>([]); // Store all petitions for counts
```

#### 2. Updated `loadPetitions` Function

**Before:**

- Loaded only petitions matching the current filter
- Stored filtered results in `petitions` state

**After:**

- Always loads ALL petitions from database
- Stores all petitions in `allPetitions` state
- Filters `allPetitions` for display based on active tab
- Stores filtered results in `petitions` state

```typescript
// Always load ALL petitions for accurate counts
const allPetitionsQuery = query(petitionsRef, orderBy('createdAt', 'desc'));
const allSnapshot = await getDocs(allPetitionsQuery);
// ... process all petitions ...
setAllPetitions(allPetitionsList);

// Filter for display
if (filter === 'all') {
  setPetitions(allPetitionsList);
} else {
  setPetitions(allPetitionsList.filter((p) => p.status === filter));
}
```

#### 3. Updated Tab Counts Calculation

**Before:**

```typescript
count: petitions.filter((p) => p.status === 'pending').length;
```

**After:**

```typescript
count: allPetitions.filter((p) => p.status === 'pending').length;
```

Now counts are calculated from ALL petitions, not just the filtered ones.

## Result

- **Pending Review** tab shows correct count of pending petitions
- **Approved** tab shows correct count of approved petitions
- **Paused** tab shows correct count of paused petitions
- **All Petitions** tab shows total count of all petitions

All counts are accurate regardless of which tab is active.

## Performance Note

This approach loads all petitions on every filter change. For large datasets, consider:

- Implementing server-side aggregation
- Using Firestore aggregation queries
- Caching counts with periodic refresh

For typical usage (hundreds to thousands of petitions), this approach is performant and simple.
