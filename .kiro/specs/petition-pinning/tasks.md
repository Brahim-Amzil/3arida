# Petition Pinning Feature - Implementation Tasks

## Phase 1: Foundation & Database Setup

- [ ] 1. Update Petition Type Definition
  - [ ] 1.1 Add pin-related fields to Petition interface in `src/types/petition.ts`
  - [ ] 1.2 Create PinPurchase interface
  - [ ] 1.3 Add pin-related audit event types

- [ ] 2. Create Pin Utility Functions
  - [ ] 2.1 Create `src/lib/pin-utils.ts` with pricing and date utilities
  - [ ] 2.2 Create `src/lib/pin-queries.ts` with Firestore query helpers
  - [ ] 2.3 Add unit tests for pin utilities

- [ ] 3. Update Firestore Indexes
  - [ ] 3.1 Add composite index for petitions: `isPinned (ASC), pinnedEndDate (ASC)`
  - [ ] 3.2 Add composite index for petitions: `isPinned (ASC), pinnedBy (ASC), pinnedEndDate (ASC)`
  - [ ] 3.3 Add indexes for pinPurchases collection
  - [ ] 3.4 Deploy indexes to Firestore

- [ ] 4. Update Firestore Security Rules
  - [ ] 4.1 Add pin field protection rules to petitions collection
  - [ ] 4.2 Add security rules for pinPurchases collection
  - [ ] 4.3 Test security rules with emulator
  - [ ] 4.4 Deploy security rules to production

## Phase 2: API Endpoints

- [ ] 5. Create Pin Payment Intent API
  - [ ] 5.1 Create `src/app/api/pins/create-payment-intent/route.ts`
  - [ ] 5.2 Implement eligibility checks
  - [ ] 5.3 Implement price calculation
  - [ ] 5.4 Integrate with Stripe API
  - [ ] 5.5 Add error handling and validation
  - [ ] 5.6 Test with Stripe test mode

- [ ] 6. Create Pin Webhook Handler
  - [ ] 6.1 Create `src/app/api/pins/webhook/route.ts`
  - [ ] 6.2 Implement Stripe signature verification
  - [ ] 6.3 Handle `payment_intent.succeeded` event
  - [ ] 6.4 Handle `payment_intent.payment_failed` event
  - [ ] 6.5 Update petition document with pin data
  - [ ] 6.6 Create pin purchase record
  - [ ] 6.7 Add audit logging
  - [ ] 6.8 Test webhook with Stripe CLI

- [ ] 7. Create Pin Expiry Check API
  - [ ] 7.1 Create `src/app/api/pins/check-expiry/route.ts`
  - [ ] 7.2 Implement query for expired pins
  - [ ] 7.3 Implement batch update logic
  - [ ] 7.4 Add transaction handling
  - [ ] 7.5 Add audit logging
  - [ ] 7.6 Test expiry logic

- [ ] 8. Create Admin Pin Management API
  - [ ] 8.1 Create `src/app/api/admin/pins/manage/route.ts`
  - [ ] 8.2 Implement admin authentication check
  - [ ] 8.3 Implement manual pin action
  - [ ] 8.4 Implement manual unpin action
  - [ ] 8.5 Implement extend duration action
  - [ ] 8.6 Add audit logging
  - [ ] 8.7 Test admin actions

## Phase 3: User-Facing Components

- [ ] 9. Add Translation Keys
  - [ ] 9.1 Add English pin translations to `src/hooks/useTranslation.ts`
  - [ ] 9.2 Add Arabic pin translations
  - [ ] 9.3 Add French pin translations
  - [ ] 9.4 Test all translations display correctly

- [ ] 10. Create Pin State Hook
  - [ ] 10.1 Create `src/hooks/usePinState.ts`
  - [ ] 10.2 Implement real-time pin data subscription
  - [ ] 10.3 Add loading and error states
  - [ ] 10.4 Test hook with different pin states

- [ ] 11. Create Pin Badge Component
  - [ ] 11.1 Create `src/components/petitions/PinBadge.tsx`
  - [ ] 11.2 Implement featured variant styling
  - [ ] 11.3 Implement pinned variant styling
  - [ ] 11.4 Add size variants (sm, md, lg)
  - [ ] 11.5 Test badge display in different contexts

- [ ] 12. Create Pin Pricing Modal
  - [ ] 12.1 Create `src/components/petitions/PinPricingModal.tsx`
  - [ ] 12.2 Implement pricing tier display
  - [ ] 12.3 Add tier selection logic
  - [ ] 12.4 Integrate Stripe payment component
  - [ ] 12.5 Add terms agreement checkbox
  - [ ] 12.6 Implement payment success/error handling
  - [ ] 12.7 Add loading states
  - [ ] 12.8 Test modal flow end-to-end

- [ ] 13. Create Pin Petition Button
  - [ ] 13.1 Create `src/components/petitions/PinPetitionButton.tsx`
  - [ ] 13.2 Implement eligibility checks
  - [ ] 13.3 Display current pin status
  - [ ] 13.4 Show expiry countdown
  - [ ] 13.5 Handle modal open/close
  - [ ] 13.6 Add success/error notifications
  - [ ] 13.7 Test button states and interactions

- [ ] 14. Update Petition Detail Page
  - [ ] 14.1 Import and add PinPetitionButton to `src/app/petitions/[id]/page.tsx`
  - [ ] 14.2 Add pin status display for creators
  - [ ] 14.3 Show pin badge on petition card
  - [ ] 14.4 Test display for creators vs visitors
  - [ ] 14.5 Test mobile responsiveness

## Phase 4: Home Page Featured Section

- [ ] 15. Create Featured Petitions Section
  - [ ] 15.1 Create `src/components/home/FeaturedPetitionsSection.tsx`
  - [ ] 15.2 Implement pinned petitions query
  - [ ] 15.3 Add sorting logic (admin first, then by expiry)
  - [ ] 15.4 Limit to 3 petitions
  - [ ] 15.5 Add loading state
  - [ ] 15.6 Add empty state (hide section)
  - [ ] 15.7 Style featured section distinctly
  - [ ] 15.8 Test with different numbers of pins

- [ ] 16. Update Petition Card Component
  - [ ] 16.1 Update `src/components/petitions/PetitionCard.tsx`
  - [ ] 16.2 Add pin badge display
  - [ ] 16.3 Add featured variant styling
  - [ ] 16.4 Test badge positioning
  - [ ] 16.5 Test mobile responsiveness

- [ ] 17. Update Home Page
  - [ ] 17.1 Import FeaturedPetitionsSection in `src/app/page.tsx`
  - [ ] 17.2 Add featured section above regular petitions
  - [ ] 17.3 Adjust spacing and layout
  - [ ] 17.4 Test section visibility logic
  - [ ] 17.5 Test mobile responsiveness

## Phase 5: Admin Dashboard

- [ ] 18. Create Admin Pin Management Component
  - [ ] 18.1 Create `src/components/admin/AdminPinManagement.tsx`
  - [ ] 18.2 Implement pinned petitions list
  - [ ] 18.3 Display pin details table
  - [ ] 18.4 Add manual pin button
  - [ ] 18.5 Add unpin action
  - [ ] 18.6 Add extend duration action
  - [ ] 18.7 Add pin history view
  - [ ] 18.8 Test all admin actions

- [ ] 19. Update Admin Dashboard
  - [ ] 19.1 Add "Pinned Petitions" tab to admin navigation
  - [ ] 19.2 Import AdminPinManagement component
  - [ ] 19.3 Add route for pin management page
  - [ ] 19.4 Test admin access control
  - [ ] 19.5 Test mobile responsiveness

## Phase 6: Automation & Monitoring

- [ ] 20. Setup Automated Expiry Checks
  - [ ] 20.1 Configure cron job or scheduled function
  - [ ] 20.2 Set to run hourly
  - [ ] 20.3 Add error handling and retries
  - [ ] 20.4 Add monitoring/alerting
  - [ ] 20.5 Test scheduled execution

- [ ] 21. Add Audit Logging
  - [ ] 21.1 Log pin purchase events
  - [ ] 21.2 Log pin activation events
  - [ ] 21.3 Log pin expiry events
  - [ ] 21.4 Log admin pin actions
  - [ ] 21.5 Test audit log entries

- [ ] 22. Add Analytics Tracking
  - [ ] 22.1 Track pin purchase conversions
  - [ ] 22.2 Track tier selection distribution
  - [ ] 22.3 Track pin view impressions
  - [ ] 22.4 Track revenue metrics
  - [ ] 22.5 Create analytics dashboard (optional)

## Phase 7: Testing & Quality Assurance

- [ ] 23. Write Unit Tests
  - [ ] 23.1 Test pin utility functions
  - [ ] 23.2 Test pin query functions
  - [ ] 23.3 Test component rendering
  - [ ] 23.4 Test hook behavior
  - [ ] 23.5 Achieve >80% code coverage

- [ ] 24. Write Integration Tests
  - [ ] 24.1 Test complete pin purchase flow
  - [ ] 24.2 Test webhook processing
  - [ ] 24.3 Test expiry check execution
  - [ ] 24.4 Test admin actions
  - [ ] 24.5 Test display logic

- [ ] 25. Write Property-Based Tests
  - [ ] 25.1 Test Property 1: Pin Exclusivity
  - [ ] 25.2 Test Property 2: Price Consistency
  - [ ] 25.3 Test Property 3: Automatic Expiry
  - [ ] 25.4 Test Property 4: Payment Linkage
  - [ ] 25.5 Test Property 5: Display Limit
  - [ ] 25.6 Test Property 6: Eligibility Enforcement
  - [ ] 25.7 Test Property 7: Admin Override
  - [ ] 25.8 Test Property 8: No Refunds

- [ ] 26. Manual Testing
  - [ ] 26.1 Test pin purchase flow (all tiers)
  - [ ] 26.2 Test payment success scenarios
  - [ ] 26.3 Test payment failure scenarios
  - [ ] 26.4 Test pin display on home page
  - [ ] 26.5 Test pin expiry behavior
  - [ ] 26.6 Test admin manual pin/unpin
  - [ ] 26.7 Test eligibility checks
  - [ ] 26.8 Test mobile experience
  - [ ] 26.9 Test RTL (Arabic) layout
  - [ ] 26.10 Test all translations

## Phase 8: Documentation & Deployment

- [ ] 27. Update Documentation
  - [ ] 27.1 Create user guide for pin feature
  - [ ] 27.2 Create admin guide for pin management
  - [ ] 27.3 Update API documentation
  - [ ] 27.4 Document pricing tiers
  - [ ] 27.5 Document troubleshooting steps

- [ ] 28. Update Terms of Service
  - [ ] 28.1 Add section about pin purchases
  - [ ] 28.2 Clarify no-refund policy for pins
  - [ ] 28.3 Explain pin duration and expiry
  - [ ] 28.4 Get legal review (if needed)

- [ ] 29. Staging Deployment
  - [ ] 29.1 Deploy to staging environment
  - [ ] 29.2 Test with Stripe test mode
  - [ ] 29.3 Verify Firestore rules
  - [ ] 29.4 Test webhook integration
  - [ ] 29.5 Verify expiry automation
  - [ ] 29.6 Perform smoke tests

- [ ] 30. Production Deployment
  - [ ] 30.1 Update Stripe webhook URL in production
  - [ ] 30.2 Deploy Firestore indexes
  - [ ] 30.3 Deploy security rules
  - [ ] 30.4 Deploy application code
  - [ ] 30.5 Configure scheduled functions
  - [ ] 30.6 Monitor for errors
  - [ ] 30.7 Verify first pin purchase

## Phase 9: Post-Launch

- [ ] 31. Monitor & Optimize
  - [ ] 31.1 Monitor pin purchase metrics
  - [ ] 31.2 Monitor error rates
  - [ ] 31.3 Monitor performance
  - [ ] 31.4 Gather user feedback
  - [ ] 31.5 Optimize queries if needed

- [ ] 32. Iterate Based on Feedback
  - [ ] 32.1 Review analytics data
  - [ ] 32.2 Identify improvement opportunities
  - [ ] 32.3 Plan future enhancements
  - [ ] 32.4 Update pricing if needed

---

## Task Dependencies

**Critical Path:**
1 → 2 → 5 → 6 → 9 → 12 → 13 → 14 → 26 → 29 → 30

**Parallel Tracks:**

- Database (1-4) can be done independently
- API endpoints (5-8) depend on utilities (2)
- Components (9-14) depend on API (5-6) and utilities (2)
- Home page (15-17) depends on components (11, 16)
- Admin (18-19) depends on API (8)
- Testing (23-26) can start after components are built

## Estimated Timeline

- **Phase 1-2:** 2-3 days (Foundation + APIs)
- **Phase 3-4:** 3-4 days (User components + Home page)
- **Phase 5:** 1-2 days (Admin dashboard)
- **Phase 6:** 1 day (Automation)
- **Phase 7:** 2-3 days (Testing)
- **Phase 8-9:** 1-2 days (Deployment + monitoring)

**Total:** ~10-15 days for complete implementation

## Notes

- Start with Phase 1-2 to establish foundation
- Test each API endpoint thoroughly before moving to UI
- Use existing Stripe integration as reference
- Reuse modal and payment component patterns
- Test with Stripe test mode throughout development
- Deploy to staging before production
