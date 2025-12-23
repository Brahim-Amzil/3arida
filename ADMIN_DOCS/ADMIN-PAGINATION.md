# Admin Petition Pagination

## Feature Added

Added pagination to the admin petition moderation page to display 10 petitions per page with navigation controls.

## Implementation Details

### Pagination State

```typescript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
```

### Auto-Reset on Filter Change

When users change filters (status tab, search query, or category), the page automatically resets to page 1:

```typescript
useEffect(() => {
  // Reset to page 1 when filters change
  setCurrentPage(1);
}, [filter, searchQuery, searchCategory]);
```

### Petition Slicing

Only 10 petitions are displayed at a time:

```typescript
petitions
  .slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  .map((petition) => (
    // Petition card
  ))
```

## Pagination Controls

### Components

1. **Results Counter**

   - Shows "Showing X to Y of Z results"
   - Example: "Showing 1 to 10 of 34 results"

2. **Previous Button**

   - Navigates to previous page
   - Disabled on first page

3. **Page Numbers**

   - Shows clickable page numbers
   - Current page highlighted in green
   - Smart display: Shows first, last, current, and adjacent pages
   - Uses ellipsis (...) for skipped pages

4. **Next Button**
   - Navigates to next page
   - Disabled on last page

### UI Example

```
Showing 1 to 10 of 34 results

[< Previous]  [1]  [2]  [3]  [4]  [Next >]
```

With many pages:

```
[< Previous]  [1]  ...  [5]  [6]  [7]  ...  [15]  [Next >]
```

## Features

### Smart Page Display

- Always shows first page
- Always shows last page
- Shows current page and adjacent pages (±1)
- Uses ellipsis for gaps

### Responsive Behavior

- Pagination only shows when there are more than 10 petitions
- Automatically adjusts total pages based on filtered results
- Resets to page 1 when filters change

### User Experience

- Clear visual feedback for current page (green background)
- Disabled state for Previous/Next when at boundaries
- Shows total results count
- Shows current range being displayed

## Example Scenarios

### Scenario 1: 34 Total Petitions

- Page 1: Shows petitions 1-10
- Page 2: Shows petitions 11-20
- Page 3: Shows petitions 21-30
- Page 4: Shows petitions 31-34

### Scenario 2: Search Results

- User searches for "environment"
- 15 results found
- Page 1: Shows results 1-10
- Page 2: Shows results 11-15

### Scenario 3: Filter Change

- User on page 3 of "All Petitions"
- Clicks "Pending Review" tab
- Automatically resets to page 1 of pending petitions

## Performance

- All petitions loaded once on page load
- Pagination happens client-side (instant)
- No additional database queries when changing pages
- Efficient for typical admin use cases

## Files Modified

- `3arida-app/src/app/admin/petitions/page.tsx`
  - Added pagination state variables
  - Added auto-reset effect
  - Added petition slicing logic
  - Added pagination UI controls
  - Added smart page number display

## Benefits

1. **Better Performance**: Page loads faster with fewer DOM elements
2. **Improved UX**: Easier to scan and navigate through petitions
3. **Scalability**: Works well even with hundreds of petitions
4. **Professional**: Standard pagination pattern users expect
5. **Accessibility**: Clear navigation with Previous/Next buttons
