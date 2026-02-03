# Payment Terms Inline Validation Implementation

## Issue

When users tried to pay without accepting terms, the system used:

- Browser's default validation (HTML `required` attribute)
- Generic error message in a separate error box
- Not visually clear which field had the issue

## Solution

Implemented inline validation with visual feedback directly on the terms checkbox:

### Visual Changes

1. **Red checkbox border** - When terms not accepted and user tries to pay
2. **Red ring around checkbox** - Additional visual emphasis
3. **Red text** - Terms text turns red to draw attention
4. **Inline error message** - Red text with icon appears directly under the checkbox
5. **Auto-clear** - Error clears immediately when user checks the box

### Implementation Details

#### StripePayment Component

- Added `termsError` state to track validation
- Removed HTML `required` attribute (no more browser validation)
- Added conditional styling based on `termsError` state
- Validation happens in `handleSubmit` before payment processing
- Error message appears inline with icon

#### PayPalPayment Component

- Added terms checkbox (was missing entirely)
- Added `termsError` state
- Validation happens in `createOrder` before PayPal flow starts
- Same visual treatment as Stripe
- Checkbox placed in bordered gray box for emphasis

### User Experience Flow

**Before clicking Pay:**

- Checkbox appears normal (gray border)
- No error message visible

**After clicking Pay without accepting:**

- Checkbox border turns red with red ring
- Terms text turns red
- Error message appears below: "يجب الموافقة على شروط الخدمة و سياسة الإستخذام !" (Arabic)
- Payment does NOT proceed

**After checking the box:**

- Red styling disappears immediately
- Error message hides
- User can proceed with payment

## Files Modified

1. `src/components/petitions/StripePayment.tsx`
   - Added `termsError` state
   - Updated checkbox styling with conditional classes
   - Added inline error message component
   - Modified validation logic

2. `src/components/petitions/PayPalPayment.tsx`
   - Added `agreedToTerms` and `termsError` states
   - Added terms checkbox UI (new feature)
   - Added validation in `createOrder`
   - Added inline error message component

## Translation Keys Used

- `payment.agreeToTerms` - "أوافق على"
- `payment.termsOfService` - "شروط الخدمة"
- `payment.andAcknowledge` - "وأقر بـ"
- `payment.noRefundPolicy` - "سياسة عدم الاسترداد"
- `payment.mustAgreeToTerms` - "يجب الموافقة على شروط الخدمة و سياسة الإستخذام !"

## Testing Checklist

- [ ] Stripe: Try to pay without accepting terms - see red validation
- [ ] Stripe: Check the box - validation clears immediately
- [ ] Stripe: Uncheck and try again - validation reappears
- [ ] PayPal: Try to pay without accepting terms - see red validation
- [ ] PayPal: Check the box - validation clears immediately
- [ ] PayPal: Verify checkbox is visible and functional
- [ ] Test in both Arabic (RTL) and French (LTR) layouts
- [ ] Verify error message is properly translated

## Status

✅ Complete - Inline validation implemented for both payment methods
