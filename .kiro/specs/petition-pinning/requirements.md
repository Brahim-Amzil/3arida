# Petition Pinning Feature - Requirements

## 1. Feature Overview

**Feature Name**: Paid Petition Pinning

**Description**: Allow petition creators to pay to feature (pin) their petition on the home page for a specified duration. Admins have full control to manage, extend, or override any pinned petitions.

**Business Value**:

- Generate additional revenue for the platform
- Provide petition creators with a way to increase visibility
- Give admins control over featured content
- Enhance home page with curated/promoted content

## 2. User Stories

### 2.1 Petition Creator Stories

**US-1**: As a petition creator, I want to pin my petition to the home page so that it gets more visibility and signatures.

**US-2**: As a petition creator, I want to choose how long my petition stays pinned (3, 7, 14, or 30 days) so that I can control my budget.

**US-3**: As a petition creator, I want to see the pricing options clearly before purchasing so that I can make an informed decision.

**US-4**: As a petition creator, I want to pay securely using Stripe so that my payment information is protected.

**US-5**: As a petition creator, I want to see when my pin expires so that I know how long my petition will remain featured.

### 2.2 Admin Stories

**US-6**: As an admin, I want to view all pinned petitions in one place so that I can manage featured content.

**US-7**: As an admin, I want to manually pin/unpin any petition without payment so that I can feature important petitions.

**US-8**: As an admin, I want to extend or shorten pin durations so that I can adjust featured content as needed.

**US-9**: As an admin, I want to see pin payment history so that I can track revenue and verify transactions.

**US-10**: As an admin, I want pinned petitions to automatically expire so that the system manages itself.

### 2.3 Visitor Stories

**US-11**: As a visitor, I want to see pinned petitions prominently on the home page so that I can discover important campaigns.

**US-12**: As a visitor, I want to distinguish pinned petitions from regular ones so that I understand they are featured content.

## 3. Acceptance Criteria

### 3.1 Pricing Tiers

**AC-1**: The system MUST offer 4 pricing tiers:

- 3 days: 99 MAD
- 7 days: 199 MAD
- 14 days: 349 MAD
- 30 days: 599 MAD

**AC-2**: Pricing MUST be displayed clearly before purchase with no hidden fees.

**AC-3**: The no-refund policy MUST apply to pin purchases.

### 3.2 Payment Flow

**AC-4**: Users MUST be able to purchase a pin from their petition detail page.

**AC-5**: Payment MUST be processed through Stripe (same integration as petition creation).

**AC-6**: Users MUST agree to terms before completing pin purchase.

**AC-7**: Upon successful payment, the petition MUST be immediately pinned.

**AC-8**: Users MUST receive confirmation of their pin purchase with expiry date.

### 3.3 Display Rules

**AC-9**: The home page MUST display up to 3 pinned petitions in a dedicated "Featured" section.

**AC-10**: Pinned petitions MUST be visually distinct (e.g., badge, border, or special styling).

**AC-11**: If more than 3 petitions are pinned, display the ones with the earliest expiry date first.

**AC-12**: Pinned petitions MUST show a "Featured" or "Pinned" badge.

### 3.4 Expiry Management

**AC-13**: Pinned petitions MUST automatically unpin when their duration expires.

**AC-14**: The system MUST check for expired pins at least once per hour.

**AC-15**: Users MUST be able to see their pin expiry date on their petition page.

### 3.5 Admin Controls

**AC-16**: Admins MUST be able to view all currently pinned petitions.

**AC-17**: Admins MUST be able to manually pin/unpin any petition.

**AC-18**: Admins MUST be able to extend or modify pin durations.

**AC-19**: Admins MUST be able to see pin payment history for each petition.

**AC-20**: Admin actions MUST be logged in the audit trail.

### 3.6 Data Integrity

**AC-21**: Each petition can only have one active pin at a time.

**AC-22**: Pin data MUST be stored in Firestore with the petition document.

**AC-23**: Payment records MUST be linked to pin purchases.

**AC-24**: The system MUST prevent duplicate pin purchases for the same active period.

## 4. Business Rules

### 4.1 Pin Eligibility

**BR-1**: Only published petitions can be pinned.

**BR-2**: Rejected or deleted petitions cannot be pinned.

**BR-3**: A petition can be re-pinned after its previous pin expires.

**BR-4**: Admins can pin any petition regardless of status.

### 4.2 Payment Rules

**BR-5**: All pin purchases are non-refundable (same as petition creation).

**BR-6**: Pin duration starts immediately upon successful payment.

**BR-7**: If a petition is deleted while pinned, the pin is removed but no refund is issued.

### 4.3 Display Priority

**BR-8**: Admin-pinned petitions take priority over paid pins.

**BR-9**: Among paid pins, earlier expiry dates are displayed first.

**BR-10**: If no pinned petitions exist, the section is hidden.

## 5. Technical Requirements

### 5.1 Database Schema

**TR-1**: Add the following fields to the `petitions` collection:

```typescript
{
  isPinned: boolean;
  pinnedStartDate: Timestamp | null;
  pinnedEndDate: Timestamp | null;
  pinnedBy: 'user' | 'admin' | null;
  pinPaymentId: string | null;
  pinDuration: number | null; // in days
  pinPrice: number | null; // in MAD
}
```

**TR-2**: Create a `pinPurchases` collection to track all pin transactions:

```typescript
{
  id: string;
  petitionId: string;
  userId: string;
  duration: number; // days
  price: number; // MAD
  paymentIntentId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: Timestamp;
}
```

### 5.2 API Endpoints

**TR-3**: Create `/api/pins/create-payment-intent` for pin purchases.

**TR-4**: Create `/api/pins/webhook` for Stripe webhook handling.

**TR-5**: Create `/api/pins/check-expiry` for automated expiry checks.

**TR-6**: Create admin endpoints for manual pin management.

### 5.3 Security

**TR-7**: Only petition creators can purchase pins for their own petitions.

**TR-8**: Only admins can manually pin/unpin petitions.

**TR-9**: Firestore rules MUST prevent unauthorized pin modifications.

### 5.4 Performance

**TR-10**: Pinned petitions query MUST be optimized with proper indexing.

**TR-11**: Expiry checks MUST run efficiently without impacting site performance.

## 6. UI/UX Requirements

### 6.1 Petition Detail Page

**UX-1**: Show a "Feature This Petition" button for petition creators.

**UX-2**: Display current pin status and expiry date if pinned.

**UX-3**: Show pricing options in a modal when clicking the feature button.

### 6.2 Home Page

**UX-4**: Display pinned petitions in a dedicated section above regular petitions.

**UX-5**: Add visual indicators (badge, border) to distinguish pinned petitions.

**UX-6**: Ensure mobile-responsive design for pinned section.

### 6.3 Admin Dashboard

**UX-7**: Add a "Pinned Petitions" tab in the admin panel.

**UX-8**: Show list of all pinned petitions with expiry dates.

**UX-9**: Provide quick actions to extend, modify, or remove pins.

## 7. Localization

**L-1**: All pin-related text MUST be translated to Arabic and French.

**L-2**: Pricing MUST be displayed in MAD (Moroccan Dirham).

**L-3**: Dates MUST be formatted according to locale.

## 8. Out of Scope (Future Enhancements)

- Email notifications when pin is about to expire
- Analytics dashboard for pin performance
- Bulk pin purchases or discounts
- Pin scheduling (start date in the future)
- Pin renewal reminders

## 9. Success Metrics

- Number of pin purchases per month
- Revenue generated from pins
- Conversion rate from petition view to pin purchase
- Average pin duration selected
- User satisfaction with pin visibility

## 10. Dependencies

- Existing Stripe integration (already implemented)
- Admin dashboard (already exists)
- Firestore database (already configured)
- Translation system (already implemented)

## 11. Risks and Mitigations

**Risk 1**: Too many petitions pinned at once

- **Mitigation**: Limit to 3 visible pins, queue others by expiry date

**Risk 2**: Abuse of pinning system

- **Mitigation**: Admin review and ability to remove pins

**Risk 3**: Payment failures during pin purchase

- **Mitigation**: Proper error handling and retry mechanisms

**Risk 4**: Expired pins not being removed

- **Mitigation**: Automated expiry checks + manual admin oversight
