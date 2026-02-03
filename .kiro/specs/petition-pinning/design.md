# Petition Pinning Feature - Design Document

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Home Page          Petition Detail      Admin Dashboard     │
│  - Featured Section - Pin Button         - Pin Management    │
│  - Pinned Badges    - Pin Status         - Manual Controls   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  /api/pins/create-payment-intent                             │
│  /api/pins/webhook                                           │
│  /api/pins/check-expiry                                      │
│  /api/admin/pins/manage                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
├─────────────────────────────────────────────────────────────┤
│  Stripe Payment API          Firestore Database             │
│  - Payment Intents           - petitions collection          │
│  - Webhooks                  - pinPurchases collection       │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Data Flow

**Pin Purchase Flow:**

1. User clicks "Feature This Petition" button
2. Modal displays pricing options
3. User selects duration and clicks "Pay"
4. Stripe payment component loads
5. Payment processed via Stripe
6. Webhook confirms payment
7. Petition document updated with pin data
8. Pin purchase record created
9. User sees confirmation

**Display Flow:**

1. Home page loads
2. Query Firestore for pinned petitions
3. Filter by active pins (endDate > now)
4. Sort by priority (admin > user) and expiry date
5. Display top 3 in featured section
6. Show pin badges on petition cards

**Expiry Flow:**

1. Scheduled function runs hourly
2. Query pins where endDate < now
3. Update petition documents (isPinned = false)
4. Update pin purchase status to 'expired'
5. Log expiry events

## 2. Database Schema

### 2.1 Petitions Collection Updates

Add the following fields to existing `petitions` collection:

```typescript
interface PetitionPinData {
  // Pin status
  isPinned: boolean;
  pinnedStartDate: Timestamp | null;
  pinnedEndDate: Timestamp | null;
  pinnedBy: 'user' | 'admin' | null;

  // Payment tracking
  pinPaymentId: string | null;
  pinDuration: number | null; // in days
  pinPrice: number | null; // in MAD

  // Admin metadata
  pinnedByUserId: string | null; // admin who pinned it
  pinNotes: string | null; // admin notes
}
```

**Firestore Indexes Required:**

```
Collection: petitions
- isPinned (ASC), pinnedEndDate (ASC)
- isPinned (ASC), pinnedBy (ASC), pinnedEndDate (ASC)
```

### 2.2 Pin Purchases Collection (New)

```typescript
interface PinPurchase {
  id: string; // auto-generated

  // Reference data
  petitionId: string;
  petitionTitle: string;
  userId: string;
  userEmail: string;

  // Purchase details
  duration: number; // days (3, 7, 14, 30)
  price: number; // MAD (99, 199, 349, 599)

  // Payment data
  paymentIntentId: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed';

  // Pin period
  startDate: Timestamp;
  endDate: Timestamp;

  // Status tracking
  status: 'active' | 'expired' | 'cancelled' | 'refunded';

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiryCheckedAt: Timestamp | null;
}
```

**Firestore Indexes Required:**

```
Collection: pinPurchases
- petitionId (ASC), status (ASC)
- userId (ASC), createdAt (DESC)
- status (ASC), endDate (ASC)
```

### 2.3 Audit Log Updates

Add pin-related events to existing audit log:

```typescript
type PinAuditEvent =
  | 'pin_purchased'
  | 'pin_activated'
  | 'pin_expired'
  | 'pin_cancelled'
  | 'pin_extended'
  | 'pin_manually_added'
  | 'pin_manually_removed';
```

## 3. API Endpoints

### 3.1 Create Pin Payment Intent

**Endpoint:** `POST /api/pins/create-payment-intent`

**Request:**

```typescript
{
  petitionId: string;
  duration: 3 | 7 | 14 | 30;
}
```

**Response:**

```typescript
{
  clientSecret: string;
  price: number;
  duration: number;
}
```

**Logic:**

1. Verify user is petition creator
2. Check petition is published
3. Check no active pin exists
4. Calculate price based on duration
5. Create Stripe payment intent
6. Return client secret

### 3.2 Pin Payment Webhook

**Endpoint:** `POST /api/pins/webhook`

**Stripe Events Handled:**

- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Logic:**

1. Verify Stripe signature
2. Extract payment intent data
3. Find associated petition
4. Update petition with pin data
5. Create pin purchase record
6. Log audit event

### 3.3 Check Pin Expiry

**Endpoint:** `POST /api/pins/check-expiry`

**Authentication:** Internal/Cron only

**Logic:**

1. Query pins where endDate < now AND status = 'active'
2. For each expired pin:
   - Update petition (isPinned = false)
   - Update pin purchase (status = 'expired')
   - Log audit event
3. Return count of expired pins

### 3.4 Admin Pin Management

**Endpoint:** `POST /api/admin/pins/manage`

**Request:**

```typescript
{
  action: 'pin' | 'unpin' | 'extend';
  petitionId: string;
  duration?: number; // for pin/extend
  notes?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
  pinData?: PetitionPinData;
}
```

**Logic:**

1. Verify user is admin
2. Execute requested action
3. Update petition document
4. Log audit event
5. Return updated pin data

## 4. Component Design

### 4.1 PinPetitionButton Component

**Location:** `src/components/petitions/PinPetitionButton.tsx`

**Props:**

```typescript
interface PinPetitionButtonProps {
  petition: Petition;
  isCreator: boolean;
}
```

**Features:**

- Shows "Feature This Petition" button
- Displays current pin status if active
- Opens pricing modal on click
- Handles payment flow
- Shows success/error messages

**States:**

- Not pinned (show button)
- Currently pinned (show status + expiry)
- Payment in progress (loading)
- Payment success (confirmation)
- Payment failed (error)

### 4.2 PinPricingModal Component

**Location:** `src/components/petitions/PinPricingModal.tsx`

**Props:**

```typescript
interface PinPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  petitionId: string;
  petitionTitle: string;
  onSuccess: (pinData: PetitionPinData) => void;
}
```

**Features:**

- Displays 4 pricing tiers
- Highlights recommended option
- Shows terms agreement checkbox
- Integrates Stripe payment
- Handles payment confirmation

**Pricing Tiers:**

```typescript
const PIN_PRICING_TIERS = [
  { days: 3, price: 99, recommended: false },
  { days: 7, price: 199, recommended: true },
  { days: 14, price: 349, recommended: false },
  { days: 30, price: 599, recommended: false },
];
```

### 4.3 FeaturedPetitionsSection Component

**Location:** `src/components/home/FeaturedPetitionsSection.tsx`

**Features:**

- Queries pinned petitions from Firestore
- Displays up to 3 pinned petitions
- Shows "Featured" badge on cards
- Responsive grid layout
- Hides section if no pins

**Query Logic:**

```typescript
const pinnedPetitions = await db
  .collection('petitions')
  .where('isPinned', '==', true)
  .where('pinnedEndDate', '>', new Date())
  .orderBy('pinnedBy', 'desc') // admin first
  .orderBy('pinnedEndDate', 'asc') // earliest expiry first
  .limit(3)
  .get();
```

### 4.4 AdminPinManagement Component

**Location:** `src/components/admin/AdminPinManagement.tsx`

**Features:**

- Lists all currently pinned petitions
- Shows pin details (duration, expiry, payment)
- Quick actions: extend, unpin
- Manual pin button for any petition
- Pin history view

**Table Columns:**

- Petition title
- Pinned by (user/admin)
- Start date
- End date
- Duration
- Price paid
- Actions

### 4.5 PinBadge Component

**Location:** `src/components/petitions/PinBadge.tsx`

**Props:**

```typescript
interface PinBadgeProps {
  variant: 'featured' | 'pinned';
  size?: 'sm' | 'md' | 'lg';
}
```

**Variants:**

- `featured`: Gold/yellow badge with star icon
- `pinned`: Green badge with pin icon

## 5. Utility Functions

### 5.1 Pin Pricing Utilities

**Location:** `src/lib/pin-utils.ts`

```typescript
export const PIN_PRICING_TIERS = [
  { days: 3, price: 99 },
  { days: 7, price: 199 },
  { days: 14, price: 349 },
  { days: 30, price: 599 },
] as const;

export function calculatePinPrice(days: number): number {
  const tier = PIN_PRICING_TIERS.find((t) => t.days === days);
  if (!tier) throw new Error('Invalid pin duration');
  return tier.price;
}

export function calculatePinEndDate(startDate: Date, days: number): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  return endDate;
}

export function isPinActive(pin: PetitionPinData): boolean {
  if (!pin.isPinned || !pin.pinnedEndDate) return false;
  return pin.pinnedEndDate.toDate() > new Date();
}

export function getPinTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return 'Expired';
  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day remaining';
  return `${days} days remaining`;
}
```

### 5.2 Pin Query Utilities

**Location:** `src/lib/pin-queries.ts`

```typescript
export async function getPinnedPetitions(
  limit: number = 3,
): Promise<Petition[]> {
  const now = new Date();

  const snapshot = await db
    .collection('petitions')
    .where('isPinned', '==', true)
    .where('pinnedEndDate', '>', now)
    .where('status', '==', 'published')
    .orderBy('pinnedBy', 'desc') // admin pins first
    .orderBy('pinnedEndDate', 'asc') // earliest expiry first
    .limit(limit)
    .get();

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Petition,
  );
}

export async function checkPinEligibility(
  petitionId: string,
  userId: string,
): Promise<{ eligible: boolean; reason?: string }> {
  const petition = await getPetitionById(petitionId);

  if (!petition) {
    return { eligible: false, reason: 'Petition not found' };
  }

  if (petition.creatorId !== userId) {
    return { eligible: false, reason: 'Not petition creator' };
  }

  if (petition.status !== 'published') {
    return { eligible: false, reason: 'Petition not published' };
  }

  if (petition.isPinned && isPinActive(petition)) {
    return { eligible: false, reason: 'Already pinned' };
  }

  return { eligible: true };
}
```

## 6. State Management

### 6.1 Pin State Hook

**Location:** `src/hooks/usePinState.ts`

```typescript
export function usePinState(petitionId: string) {
  const [pinData, setPinData] = useState<PetitionPinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = db
      .collection('petitions')
      .doc(petitionId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const data = doc.data();
            setPinData({
              isPinned: data.isPinned || false,
              pinnedStartDate: data.pinnedStartDate,
              pinnedEndDate: data.pinnedEndDate,
              pinnedBy: data.pinnedBy,
              pinPaymentId: data.pinPaymentId,
              pinDuration: data.pinDuration,
              pinPrice: data.pinPrice,
            });
          }
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [petitionId]);

  return { pinData, loading, error };
}
```

## 7. Security Rules

### 7.1 Firestore Security Rules

```javascript
// Petitions collection - pin fields
match /petitions/{petitionId} {
  // Allow read for all
  allow read: if true;

  // Pin fields can only be updated by:
  // 1. Admins (manual pin)
  // 2. Server (via webhook)
  allow update: if request.auth != null && (
    // Admin can update pin fields
    (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin') ||
    // Creator can update other fields but NOT pin fields
    (resource.data.creatorId == request.auth.uid &&
     !request.resource.data.diff(resource.data).affectedKeys().hasAny([
       'isPinned', 'pinnedStartDate', 'pinnedEndDate', 'pinnedBy',
       'pinPaymentId', 'pinDuration', 'pinPrice'
     ]))
  );
}

// Pin purchases collection
match /pinPurchases/{purchaseId} {
  // Users can read their own purchases
  allow read: if request.auth != null && (
    resource.data.userId == request.auth.uid ||
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
  );

  // Only server can create/update
  allow create, update: if false;
}
```

## 8. Translation Keys

### 8.1 Pin-Related Translations

Add to `src/hooks/useTranslation.ts`:

```typescript
// English
'pin.featureThisPetition': 'Feature This Petition',
'pin.currentlyFeatured': 'Currently Featured',
'pin.expiresIn': 'Expires in {days} days',
'pin.expired': 'Pin Expired',
'pin.chooseDuration': 'Choose Feature Duration',
'pin.pricingTier.3days': '3 Days',
'pin.pricingTier.7days': '7 Days',
'pin.pricingTier.14days': '14 Days',
'pin.pricingTier.30days': '30 Days',
'pin.recommended': 'Recommended',
'pin.bestValue': 'Best Value',
'pin.perDay': 'per day',
'pin.agreeToTerms': 'I agree to the Terms of Service and acknowledge the No-Refund policy for pin purchases',
'pin.paymentSuccess': 'Your petition is now featured!',
'pin.paymentFailed': 'Payment failed. Please try again.',
'pin.notEligible': 'This petition cannot be pinned',
'pin.alreadyPinned': 'This petition is already featured',
'pin.featured': 'Featured',
'pin.pinned': 'Pinned',

// Arabic
'pin.featureThisPetition': 'تمييز هذه العريضة',
'pin.currentlyFeatured': 'مميزة حاليًا',
'pin.expiresIn': 'تنتهي خلال {days} أيام',
'pin.expired': 'انتهى التمييز',
'pin.chooseDuration': 'اختر مدة التمييز',
'pin.pricingTier.3days': '3 أيام',
'pin.pricingTier.7days': '7 أيام',
'pin.pricingTier.14days': '14 يومًا',
'pin.pricingTier.30days': '30 يومًا',
'pin.recommended': 'موصى به',
'pin.bestValue': 'أفضل قيمة',
'pin.perDay': 'في اليوم',
'pin.agreeToTerms': 'أوافق على شروط الخدمة وأقر بسياسة عدم الاسترداد لعمليات التمييز',
'pin.paymentSuccess': 'عريضتك الآن مميزة!',
'pin.paymentFailed': 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.',
'pin.notEligible': 'لا يمكن تمييز هذه العريضة',
'pin.alreadyPinned': 'هذه العريضة مميزة بالفعل',
'pin.featured': 'مميزة',
'pin.pinned': 'مثبتة',

// French
'pin.featureThisPetition': 'Mettre en avant cette pétition',
'pin.currentlyFeatured': 'Actuellement en vedette',
'pin.expiresIn': 'Expire dans {days} jours',
'pin.expired': 'Épinglage expiré',
'pin.chooseDuration': 'Choisir la durée de mise en avant',
'pin.pricingTier.3days': '3 jours',
'pin.pricingTier.7days': '7 jours',
'pin.pricingTier.14days': '14 jours',
'pin.pricingTier.30days': '30 jours',
'pin.recommended': 'Recommandé',
'pin.bestValue': 'Meilleur rapport qualité-prix',
'pin.perDay': 'par jour',
'pin.agreeToTerms': 'J\'accepte les Conditions d\'utilisation et reconnais la politique de non-remboursement pour les achats d\'épinglage',
'pin.paymentSuccess': 'Votre pétition est maintenant en vedette!',
'pin.paymentFailed': 'Le paiement a échoué. Veuillez réessayer.',
'pin.notEligible': 'Cette pétition ne peut pas être épinglée',
'pin.alreadyPinned': 'Cette pétition est déjà en vedette',
'pin.featured': 'En vedette',
'pin.pinned': 'Épinglé',
```

## 9. Testing Strategy

### 9.1 Unit Tests

**Test Files:**

- `src/lib/pin-utils.test.ts`
- `src/lib/pin-queries.test.ts`
- `src/components/petitions/PinPetitionButton.test.tsx`

**Test Cases:**

- Price calculation for each tier
- End date calculation
- Pin eligibility checks
- Time remaining formatting
- Pin status validation

### 9.2 Integration Tests

**Test Scenarios:**

1. Complete pin purchase flow
2. Webhook processing
3. Expiry check execution
4. Admin manual pin/unpin
5. Display of pinned petitions

### 9.3 E2E Tests

**User Flows:**

1. User pins petition → payment → confirmation → display on home
2. Admin manually pins petition → immediate display
3. Pin expires → removed from home page
4. User attempts to pin already-pinned petition → error

## 10. Performance Considerations

### 10.1 Query Optimization

- Use composite indexes for pin queries
- Limit pinned petitions query to 3 results
- Cache pinned petitions on home page (5 min TTL)

### 10.2 Webhook Processing

- Process webhooks asynchronously
- Implement retry logic for failed updates
- Log all webhook events for debugging

### 10.3 Expiry Checks

- Run expiry check hourly (not per request)
- Batch update expired pins
- Use Firestore transactions for consistency

## 11. Monitoring and Analytics

### 11.1 Metrics to Track

- Pin purchase conversion rate
- Average pin duration selected
- Revenue per pin tier
- Pin expiry rate
- Admin manual pin frequency

### 11.2 Logging

Log the following events:

- Pin purchase initiated
- Pin payment succeeded/failed
- Pin activated
- Pin expired
- Admin pin action
- Webhook received

## 12. Correctness Properties

### Property 1: Pin Exclusivity

**Validates: AC-21**

A petition can have at most one active pin at any given time.

```typescript
// Property: For any petition, isPinned implies exactly one active pin period
∀ petition:
  petition.isPinned === true
  ⟹
  (petition.pinnedEndDate > now() ∧
   ∄ otherPin: (otherPin.petitionId === petition.id ∧
                 otherPin.status === 'active' ∧
                 otherPin.id !== petition.pinPaymentId))
```

### Property 2: Price Consistency

**Validates: AC-1, AC-2**

Pin prices must match the defined pricing tiers exactly.

```typescript
// Property: All pin purchases have prices matching their duration tier
∀ purchase:
  purchase.price === PIN_PRICING_TIERS.find(t => t.days === purchase.duration).price
```

### Property 3: Automatic Expiry

**Validates: AC-13, AC-14**

Pins must be automatically unpinned when their end date is reached.

```typescript
// Property: No petition should be pinned past its end date
∀ petition:
  (petition.isPinned === true ∧ petition.pinnedEndDate < now())
  ⟹
  eventually(petition.isPinned === false)
```

### Property 4: Payment Linkage

**Validates: AC-23**

Every user-initiated pin must have a valid payment record.

```typescript
// Property: User pins must have associated payment
∀ petition:
  (petition.isPinned === true ∧ petition.pinnedBy === 'user')
  ⟹
  ∃ purchase: (purchase.id === petition.pinPaymentId ∧
               purchase.paymentStatus === 'succeeded')
```

### Property 5: Display Limit

**Validates: AC-9, AC-11**

The home page must display at most 3 pinned petitions.

```typescript
// Property: Featured section shows max 3 pins
∀ homePageLoad:
  count(displayedPinnedPetitions) ≤ 3
```

### Property 6: Eligibility Enforcement

**Validates: BR-1, BR-2**

Only published petitions can be pinned by users.

```typescript
// Property: User-pinned petitions must be published
∀ petition:
  (petition.isPinned === true ∧ petition.pinnedBy === 'user')
  ⟹
  petition.status === 'published'
```

### Property 7: Admin Override

**Validates: AC-17, BR-4**

Admins can pin any petition regardless of status.

```typescript
// Property: Admin pins bypass status checks
∀ petition:
  (petition.pinnedBy === 'admin')
  ⟹
  petition.status ∈ {'draft', 'pending', 'published', 'rejected'}
```

### Property 8: No Refunds

**Validates: BR-5, BR-7**

Pin purchases are never refunded, even if petition is deleted.

```typescript
// Property: No pin purchase should have refunded status
∀ purchase:
  purchase.status ≠ 'refunded'
```

## 13. Implementation Notes

### 13.1 Reuse Existing Components

- Reuse `StripePayment` component structure
- Reuse existing modal patterns
- Reuse admin dashboard layout
- Reuse translation system

### 13.2 Incremental Rollout

**Phase 1:** Database schema + API endpoints
**Phase 2:** User-facing pin purchase flow
**Phase 3:** Home page featured section
**Phase 4:** Admin management interface
**Phase 5:** Automated expiry system

### 13.3 Feature Flags

Consider adding feature flag for gradual rollout:

```typescript
const PIN_FEATURE_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_PIN_FEATURE === 'true';
```

## 14. Future Enhancements

- Email notifications before pin expires
- Pin analytics dashboard
- Bulk pin discounts
- Scheduled pins (future start date)
- Pin renewal automation
- A/B testing for pricing tiers
