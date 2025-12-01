# Admin Petition Search & Deleted Tab

## Features Added

### 1. Deleted Tab

Added a new "Deleted" tab to view petitions that have been deleted by admins/moderators.

**Tab Order:**

1. Pending Review
2. Approved
3. Paused
4. **Deleted** ← NEW
5. All Petitions

**Features:**

- Shows count of deleted petitions
- Displays deleted petitions with dark badge (black background, white text)
- Allows admins to review deleted petitions

### 2. Search Functionality

Added comprehensive search capabilities to find petitions quickly.

**Search Features:**

- **Text Search**: Search by title, description, category, or publisher name
- **Category Filter**: Dropdown to filter by specific category
- **Clear Button**: Quickly reset search and filters
- **Real-time Filtering**: Results update as you type

**Search Fields:**

- Petition title
- Petition description
- Category name
- Publisher name

### 3. Combined Filtering

The search works in combination with status tabs:

- Select a tab (e.g., "Approved")
- Search within that status
- Filter by category
- All filters work together

## Implementation Details

### State Management

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [searchCategory, setSearchCategory] = useState<string>('all');
```

### Filter Function

```typescript
const filterAndSearchPetitions = (
  petitionsList: Petition[],
  statusFilter: string,
  search: string,
  category: string
) => {
  let filtered = petitionsList;

  // Filter by status
  if (statusFilter !== 'all') {
    filtered = filtered.filter((p) => p.status === statusFilter);
  }

  // Filter by category
  if (category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Filter by search query
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        p.publisherName?.toLowerCase().includes(searchLower)
    );
  }

  setPetitions(filtered);
};
```

### UI Components

#### Search Bar

```tsx
<input
  type="text"
  placeholder="Search petitions by title, description, category, or publisher..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg..."
/>
```

#### Category Dropdown

```tsx
<select
  value={searchCategory}
  onChange={(e) => setSearchCategory(e.target.value)}
>
  <option value="all">All Categories</option>
  {Array.from(new Set(allPetitions.map((p) => p.category)))
    .sort()
    .map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
</select>
```

#### Clear Button

```tsx
{
  (searchQuery || searchCategory !== 'all') && (
    <Button
      variant="outline"
      onClick={() => {
        setSearchQuery('');
        setSearchCategory('all');
      }}
    >
      Clear
    </Button>
  );
}
```

## User Experience

### Search Flow

1. Admin opens Petition Moderation page
2. All petitions are loaded
3. Admin can:
   - Type in search box to find specific petitions
   - Select a category from dropdown
   - Switch between status tabs
   - Clear filters with one click

### Example Use Cases

**Find a specific petition:**

- Type petition title or keywords in search box
- Results filter in real-time

**View deleted petitions:**

- Click "Deleted" tab
- See all deleted petitions with their details

**Find approved petitions in a category:**

- Click "Approved" tab
- Select category from dropdown
- See only approved petitions in that category

**Search within pending petitions:**

- Click "Pending Review" tab
- Type search query
- See only pending petitions matching search

## Status Badge Colors

- **Pending**: Yellow background, yellow text
- **Approved**: Green background, green text
- **Paused**: Red background, red text
- **Deleted**: Black background, white text ← NEW
- **Other**: Gray background, gray text

## Performance

- All petitions loaded once on page load
- Filtering happens client-side for instant results
- No additional database queries when searching/filtering
- Efficient for typical admin use (hundreds to thousands of petitions)

## Files Modified

- `3arida-app/src/app/admin/petitions/page.tsx`
  - Added search state variables
  - Added `filterAndSearchPetitions` function
  - Added search bar UI
  - Added category filter dropdown
  - Added "Deleted" tab
  - Updated status badge colors
  - Updated empty state messages
