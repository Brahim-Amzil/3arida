# Petition Reference Code System

## Feature Overview

Implemented a unique 6-character reference code system for petitions to enable quick lookup and support inquiries.

## Code Format

**Format**: 2 uppercase letters + 4 numbers
**Examples**:

- `AB1234`
- `XY5678`
- `MK9012`

## Implementation Details

### 1. Code Generation

**Function**: `generateReferenceCode()`

```typescript
function generateReferenceCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let code = '';
  // 2 random letters
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  // 4 random numbers
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
}
```

### 2. Uniqueness Check

**Function**: `isReferenceCodeUnique()`

- Queries Firestore to check if code already exists
- Returns true if code is unique

**Function**: `generateUniqueReferenceCode()`

- Generates codes until a unique one is found
- Maximum 10 attempts
- Fallback: Adds timestamp digits if all attempts fail

### 3. Database Storage

**Field**: `referenceCode` (string, optional)

- Added to Petition interface
- Generated automatically when petition is created
- Stored in Firestore with petition document

### 4. Display Locations

#### Public Petition Page

- Shown in "Petition Details" section
- Below "Specific Target"
- Large, bold, monospace font
- Helper text: "Use this code for support inquiries"

#### Admin Petition Detail Page

- Same location and styling as public page
- Helps admins quickly identify petitions

#### Admin Petition List

- Searchable via search bar
- Case-insensitive search

## Use Cases

### 1. Customer Support

**Scenario**: User contacts support about their petition

**Before**:

- User: "I created a petition about climate change..."
- Support: "Can you send me the link?"
- User: "I don't have it..."
- Support: "What's your email?"
- _Long search process_

**After**:

- User: "My petition code is AB1234"
- Support: _Types AB1234 in search_
- _Instant result_

### 2. Quick Lookup

**Scenario**: Admin needs to find specific petition

**Before**:

- Search by title (might not remember exact wording)
- Scroll through pages
- Check multiple petitions

**After**:

- Type reference code in search
- Instant match

### 3. Phone Support

**Scenario**: User calls support

**Before**:

- Hard to communicate long URLs or titles
- Spelling issues
- Time-consuming

**After**:

- User: "A-B-1-2-3-4"
- Clear, short, easy to communicate

### 4. Email/Chat Support

**Scenario**: User emails about petition

**Before**:

- User sends long URL or description
- Support needs to parse and search

**After**:

- User includes code in email
- Support searches instantly

## Search Functionality

### Admin Search Bar

Updated placeholder:

```
"Search by title, description, category, publisher, or reference code (e.g., AB1234)..."
```

### Search Logic

```typescript
// Case-insensitive search for reference codes
const searchUpper = search.toUpperCase();
filtered = filtered.filter(
  (p) =>
    p.title.toLowerCase().includes(searchLower) ||
    p.description.toLowerCase().includes(searchLower) ||
    p.category.toLowerCase().includes(searchLower) ||
    p.publisherName?.toLowerCase().includes(searchLower) ||
    p.referenceCode?.toUpperCase().includes(searchUpper)
);
```

## Display Styling

### Visual Design

- **Font**: Monospace (font-mono)
- **Size**: Large (text-lg)
- **Weight**: Bold (font-bold)
- **Color**: Purple-900 (matches Petition Details theme)
- **Spacing**: Wide letter spacing (tracking-wider)
- **Helper Text**: Small, purple-600

### Example Display

```
┌─────────────────────────────────┐
│ Petition Details                │
├─────────────────────────────────┤
│ Type: Support                   │
│ Addressed To: Government        │
│ Specific Target: Ministry       │
│                                 │
│ Reference Code                  │
│ AB1234                          │
│ Use this code for support       │
│ inquiries                       │
└─────────────────────────────────┘
```

## Benefits

1. **Quick Identification**: 6 characters are easy to remember and communicate
2. **Professional**: Looks official and organized
3. **Support Efficiency**: Dramatically reduces support lookup time
4. **User-Friendly**: Simple format that anyone can read and type
5. **Unique**: Guaranteed unique across all petitions
6. **Searchable**: Integrated into admin search functionality
7. **Scalable**: Can handle millions of petitions (26² × 10⁴ = 6,760,000 combinations)

## Technical Details

### Collision Probability

- Total combinations: 26 × 26 × 10 × 10 × 10 × 10 = 6,760,000
- With 10,000 petitions: ~0.015% collision chance per generation
- Uniqueness check ensures no duplicates

### Performance

- Code generation: O(1) - instant
- Uniqueness check: O(1) - indexed query
- Maximum 10 attempts: Still very fast
- Fallback ensures code is always generated

## Files Modified

1. **3arida-app/src/types/petition.ts**

   - Added `referenceCode?: string` field

2. **3arida-app/src/lib/petitions.ts**

   - Added `generateReferenceCode()` function
   - Added `isReferenceCodeUnique()` function
   - Added `generateUniqueReferenceCode()` function
   - Updated `createPetition()` to generate and save code

3. **3arida-app/src/app/petitions/[id]/page.tsx**

   - Added reference code display in Petition Details section

4. **3arida-app/src/app/admin/petitions/[id]/page.tsx**

   - Added reference code display in Petition Details section

5. **3arida-app/src/app/admin/petitions/page.tsx**
   - Updated search logic to include reference code
   - Updated search placeholder text

## Future Enhancements

Potential improvements:

1. Add copy-to-clipboard button next to code
2. Show code in email notifications
3. Add code to QR code data
4. Create dedicated /petition/AB1234 short URL route
5. Add code to petition cards in lists
6. Include code in petition share messages
