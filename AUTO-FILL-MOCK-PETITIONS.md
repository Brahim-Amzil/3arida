# Auto-Fill Mock Petitions

## Overview

The auto-fill button now rotates through 4 different mock petitions to avoid confusion with duplicate titles during testing.

## How It Works

Each time you click the "Auto-fill Test Data" button:

1. It fills the form with one of 4 pre-defined petitions
2. Automatically rotates to the next petition for the next click
3. After the 4th petition, it cycles back to the 1st

## Mock Petitions

### Petition 1: Road Infrastructure (5,000 signatures - 99 MAD)

- **Publisher**: أحمد محمد الحسني (Individual)
- **Type**: Change
- **Addressed To**: وزارة التجهيز والنقل واللوجستيك والماء
- **Title**: عريضة لإصلاح البنية التحتية للطرق في حي الأمل
- **Category**: Infrastructure → Transportation
- **Location**: Casablanca, Morocco
- **Signatures**: 5,000 (triggers payment)

### Petition 2: Public Library (2,500 signatures - 49 MAD)

- **Publisher**: فاطمة الزهراء بنعلي (Individual)
- **Type**: Start
- **Addressed To**: وزارة التربية الوطنية والتعليم الأولي والرياضة
- **Title**: إنشاء مكتبة عمومية حديثة في حي النخيل
- **Category**: Education → Educational Access
- **Location**: Rabat, Morocco
- **Signatures**: 2,500 (triggers payment)

### Petition 3: Industrial Pollution (10,000 signatures - 199 MAD)

- **Publisher**: جمعية حماية البيئة بمراكش (Organization)
- **Type**: Stop
- **Addressed To**: وزارة الانتقال الطاقي والتنمية المستدامة
- **Title**: وقف التلوث الصناعي في منطقة سيدي غانم
- **Category**: Environment → Pollution
- **Location**: Marrakech, Morocco
- **Signatures**: 10,000 (triggers payment)

### Petition 4: Mental Health Services (1,000 signatures - FREE)

- **Publisher**: يوسف التازي (Individual)
- **Type**: Support
- **Addressed To**: وزارة الصحة والحماية الاجتماعية
- **Title**: دعم توسيع خدمات الصحة النفسية في المستشفيات العمومية
- **Category**: Healthcare → Mental Health
- **Location**: Fez, Morocco
- **Signatures**: 1,000 (FREE - no payment)

## Testing Scenarios

### Test Payment Flow

Use Petitions 1, 2, or 3 (they require payment):

- Click auto-fill 1x → Petition 1 (99 MAD)
- Click auto-fill 2x → Petition 2 (49 MAD)
- Click auto-fill 3x → Petition 3 (199 MAD)

### Test Free Petition

Use Petition 4 (no payment required):

- Click auto-fill 4x → Petition 4 (FREE)

### Test Different Categories

- Petition 1: Infrastructure
- Petition 2: Education
- Petition 3: Environment
- Petition 4: Healthcare

### Test Different Types

- Petition 1: Change
- Petition 2: Start
- Petition 3: Stop
- Petition 4: Support

### Test Different Publishers

- Petitions 1, 2, 4: Individual
- Petition 3: Organization (requires document upload)

## Rotation Cycle

```
Click 1 → Petition 1 (Roads, Casablanca, 5K sigs, 99 MAD)
Click 2 → Petition 2 (Library, Rabat, 2.5K sigs, 49 MAD)
Click 3 → Petition 3 (Pollution, Marrakech, 10K sigs, 199 MAD)
Click 4 → Petition 4 (Mental Health, Fez, 1K sigs, FREE)
Click 5 → Petition 1 (cycle repeats)
```

## Console Output

When you click auto-fill, you'll see:

```
🤖 Auto-filling test data (Petition 1/4)...
✅ Test data filled (Petition 1/4) and navigated to review step
```

The number tells you which petition was loaded.

## Benefits

✅ **No Duplicates**: Each petition has unique title and content
✅ **Easy Testing**: Different scenarios covered (free, paid, different categories)
✅ **Clear Identification**: Console shows which petition is loaded
✅ **Automatic Rotation**: No need to manually change data
✅ **Diverse Content**: Tests different petition types and locations

## Implementation

**File**: `src/app/petitions/create/page.tsx`

**State**:

```typescript
const [mockPetitionIndex, setMockPetitionIndex] = useState(0);
```

**Mock Data Array**:

```typescript
const mockPetitions = [
  {
    /* Petition 1 */
  },
  {
    /* Petition 2 */
  },
  {
    /* Petition 3 */
  },
  {
    /* Petition 4 */
  },
];
```

**Auto-fill Function**:

```typescript
const autoFillTestData = () => {
  const mockData = mockPetitions[mockPetitionIndex];
  // Fill form with mockData
  // Rotate index: (prev + 1) % 4
};
```

## Usage Tips

1. **Quick Payment Test**: Click once, get paid petition
2. **Free Petition Test**: Click 4 times, get free petition
3. **Different Categories**: Each click gives different category
4. **Organization Test**: Click 3 times for organization petition (note: document upload still required)

## Notes

- All petitions are in Arabic (realistic for Morocco)
- All petitions have proper structure and formatting
- Signature counts vary to test different pricing tiers
- Locations vary to test different cities
- One free petition included for testing non-payment flow
- Organization petition requires document upload (not auto-filled)

## Future Enhancements

Could add:

- French language petitions
- More petition types
- Different signature counts
- Custom rotation order
- Random selection instead of rotation
