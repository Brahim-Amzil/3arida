# Petition Approval Email - Debugging Guide

## Issue

User created a petition, admin approved it, but the creator did NOT receive an approval email. However, when the user signed the petition, they DID receive a signature confirmation email.

## Debugging Steps Added

### 1. Enhanced Logging in PetitionAdminActions Component

Added detailed console logs to track the approval email flow:

```typescript
console.log('🔍 Starting approval email process...');
console.log('🔍 Getting creator info for petition:', petition.id);
console.log('🔍 Creator info:', { id, name, email, hasEmail });
console.log('🔍 Importing email notification function...');
console.log('🔍 Sending approval email to:', creator.email);
console.log('✅ Petition approved email result:', result);
```

**Location:** `src/components/admin/PetitionAdminActions.tsx` (lines ~192-230)

### 2. Enhanced Logging in Email Notification Function

Added logs to track server vs client execution:

```typescript
console.log('📧 sendPetitionApprovedEmail called with:', params);
console.log('📧 Running on:', isServer ? 'SERVER' : 'CLIENT');
console.log('📧 CLIENT: Calling API endpoint...');
console.log('📧 CLIENT: API response status:', response.status);
console.log('📧 CLIENT: API response data:', data);
```

**Location:** `src/lib/email-notifications.ts` (lines ~51-100)

### 3. Enhanced Logging in API Endpoint

Added comprehensive logging for the API route:

```typescript
console.log('🔔 API: petition-approved endpoint called');
console.log('🔔 API: Request body:', body);
console.log('🔔 API: Generating email HTML...');
console.log('🔔 API: Sending email to:', userEmail);
console.log('🔔 API: Email send result:', result);
```

**Location:** `src/app/api/email/petition-approved/route.ts`

## How to Debug

### Step 1: Open Browser Console

1. Open the admin dashboard
2. Open browser DevTools (F12)
3. Go to Console tab
4. Clear the console

### Step 2: Approve a Petition

1. Click the "Approve" button on a pending petition
2. Watch the console for logs

### Step 3: Check the Log Flow

**Expected Log Sequence:**

```
🔍 Starting approval email process...
🔍 Getting creator info for petition: [petition-id]
🔍 Creator info: { id: "...", name: "...", email: "...", hasEmail: true }
🔍 Importing email notification function...
🔍 Sending approval email to: user@example.com
📧 sendPetitionApprovedEmail called with: { userName, userEmail, petitionTitle, petitionId }
📧 Running on: CLIENT
📧 CLIENT: Calling API endpoint...
📧 CLIENT: API response status: 200
📧 CLIENT: API response data: { success: true }
✅ Petition approved email result: true
✅ Petition approved email sent successfully to creator
```

### Step 4: Check Server Logs (Vercel/Terminal)

If running locally, check the terminal for API logs:

```
🔔 API: petition-approved endpoint called
🔔 API: Request body: { userName, userEmail, petitionTitle, petitionId }
🔔 API: Generating email HTML...
🔔 API: Sending email to: user@example.com
🔔 API: Email send result: { success: true }
🔔 API: Email sent successfully
```

## Common Issues to Check

### Issue 1: Creator Email Not Found

**Log:** `⚠️ Creator email not found, skipping email notification`

**Solution:**

- Check if the user has an email in their profile
- Verify `getUserById` is returning the correct user data
- Check Firestore users collection

### Issue 2: API Endpoint Not Called

**Log:** No `📧 CLIENT: Calling API endpoint...` message

**Solution:**

- Check if the code is reaching the email sending block
- Verify the `action === 'approve'` condition is true
- Check if there's an error before reaching the email code

### Issue 3: API Returns Error

**Log:** `📧 CLIENT: API response status: 500`

**Solution:**

- Check server logs for the actual error
- Verify email service configuration (Resend API key)
- Check if email template is generating correctly

### Issue 4: Email Service Fails

**Log:** `🔔 API: Email send result: { success: false, error: "..." }`

**Solution:**

- Check Resend API key is valid
- Verify sender email is verified in Resend
- Check Resend dashboard for delivery status
- Verify email template HTML is valid

## Comparison with Signature Email

The signature confirmation email WORKS, which means:

- ✅ Email service (Resend) is configured correctly
- ✅ API key is valid
- ✅ Sender email is verified
- ✅ Email templates can be sent

This narrows down the issue to:

- ❓ Approval email code not being executed
- ❓ Different code path for approval vs signature
- ❓ Creator email not being found
- ❓ API endpoint not being called

## Testing Checklist

- [ ] Check browser console when approving petition
- [ ] Verify creator has email in Firestore
- [ ] Check server logs (Vercel/terminal)
- [ ] Verify API endpoint is being called
- [ ] Check Resend dashboard for email delivery
- [ ] Test with a different user email
- [ ] Compare with signature email flow

## Files Modified (for debugging)

- `src/components/admin/PetitionAdminActions.tsx` - Added detailed logging
- `src/lib/email-notifications.ts` - Added detailed logging
- `src/app/api/email/petition-approved/route.ts` - Added detailed logging

## Next Steps

1. **Approve a petition** and check the console logs
2. **Share the console output** to identify where the flow breaks
3. **Check server logs** if the API is being called
4. **Verify creator email** exists in Firestore

The detailed logging will help pinpoint exactly where the email sending process is failing.
