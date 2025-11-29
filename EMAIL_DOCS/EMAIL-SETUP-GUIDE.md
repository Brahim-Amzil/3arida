# Email Notification System Setup Guide

## 📧 Overview

The 3arida platform now has a complete email notification system using **Resend** - a modern, developer-friendly email service.

## 🎯 Features Implemented

### 5 Key Email Types:

1. **Welcome Email** - Sent after user registration
2. **Petition Approved** - When admin approves a petition
3. **Signature Confirmation** - After signing a petition
4. **Petition Update** - When creator posts an update
5. **Milestone Reached** - At 25%, 50%, 75%, 100% of goal

## 🚀 Setup Instructions

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for free account (3,000 emails/month free)
3. Verify your email address

### Step 2: Get API Key

1. Go to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Name it "3arida Production"
4. Copy the API key (starts with `re_`)

### Step 3: Configure Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain: `3arida.ma`
4. Add the DNS records they provide:
   - SPF record
   - DKIM record
   - DMARC record (optional)
5. Wait for verification (usually 5-10 minutes)

### Step 4: Add Environment Variables

Add to your `.env.local` file:

\`\`\`bash

# Email Service (Resend)

RESEND_API_KEY=re_your_actual_api_key_here
EMAIL_FROM=noreply@3arida.ma
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

For production (`.env.production`):

\`\`\`bash
RESEND_API_KEY=re_your_production_api_key
EMAIL_FROM=noreply@3arida.ma
NEXT_PUBLIC_APP_URL=https://3arida.ma
\`\`\`

### Step 5: Test Email Sending

Run the test script:

\`\`\`bash
node test-email.js
\`\`\`

Or test via API:

\`\`\`bash
curl -X POST http://localhost:3000/api/email/welcome \\
-H "Content-Type: application/json" \\
-d '{"userName":"Test User","userEmail":"your-email@example.com"}'
\`\`\`

## 📝 Email Templates

All email templates are bilingual (Arabic/English) and include:

- Responsive design (mobile-friendly)
- Brand colors and styling
- Clear call-to-action buttons
- Unsubscribe links
- Professional footer

### Template Files:

- `src/lib/email-templates.ts` - HTML email templates
- `src/lib/email-service.ts` - Email sending logic
- `src/lib/email-notifications.ts` - Helper functions

## 🔌 Integration Points

### 1. User Registration

In `src/lib/auth.ts` or registration handler:

\`\`\`typescript
import { sendWelcomeEmail } from '@/lib/email-notifications';

// After successful registration
await sendWelcomeEmail(user.name, user.email);
\`\`\`

### 2. Petition Approval

In admin approval handler:

\`\`\`typescript
import { sendPetitionApprovedEmail } from '@/lib/email-notifications';

// After approving petition
await sendPetitionApprovedEmail(
creator.name,
creator.email,
petition.title,
petition.id
);
\`\`\`

### 3. Signature Confirmation

In petition signing handler:

\`\`\`typescript
import { sendSignatureConfirmationEmail } from '@/lib/email-notifications';

// After signing petition
await sendSignatureConfirmationEmail(
user.name,
user.email,
petition.title,
petition.id
);
\`\`\`

### 4. Petition Updates

In update creation handler:

\`\`\`typescript
import { sendBatchPetitionUpdateEmails } from '@/lib/email-notifications';

// Get all signers
const signers = await getPetitionSigners(petitionId);

// Send to all signers
await sendBatchPetitionUpdateEmails(
signers,
petition.title,
petition.id,
update.title,
update.content
);
\`\`\`

### 5. Milestone Tracking

In signature handler:

\`\`\`typescript
import { sendMilestoneEmail } from '@/lib/email-notifications';

// Check if milestone reached
const percentage = (currentSignatures / targetSignatures) \* 100;
const milestones = [25, 50, 75, 100];

for (const milestone of milestones) {
if (percentage >= milestone && !petition.milestones[milestone]) {
await sendMilestoneEmail(
creator.name,
creator.email,
petition.title,
petition.id,
milestone,
currentSignatures,
targetSignatures
);

    // Mark milestone as sent
    await updatePetitionMilestone(petition.id, milestone);

}
}
\`\`\`

## 🧪 Testing Checklist

- [ ] Welcome email sends after registration
- [ ] Petition approved email sends to creator
- [ ] Signature confirmation sends to signer
- [ ] Update emails send to all signers
- [ ] Milestone emails send at correct percentages
- [ ] Emails not in spam folder
- [ ] Links in emails work correctly
- [ ] Unsubscribe link works
- [ ] Mobile responsive design
- [ ] Arabic text displays correctly (RTL)

## 📊 Monitoring

### Resend Dashboard

Monitor email delivery in Resend dashboard:

- **Emails** - View all sent emails
- **Logs** - Check delivery status
- **Analytics** - Open rates, click rates
- **Bounces** - Failed deliveries

### Error Handling

All email functions return success/failure:

\`\`\`typescript
const success = await sendWelcomeEmail(name, email);
if (!success) {
console.error('Failed to send welcome email');
// Handle error (retry, log, notify admin)
}
\`\`\`

## 🔒 Security Best Practices

1. **Never expose API key** - Keep in environment variables
2. **Validate email addresses** - Check format before sending
3. **Rate limiting** - Prevent abuse (already implemented)
4. **Unsubscribe** - Honor unsubscribe requests
5. **GDPR compliance** - Include privacy policy link

## 💰 Cost Estimation

### Resend Free Tier:

- 3,000 emails/month
- 100 emails/day
- Perfect for launch and early growth

### Paid Plans (if needed):

- **Pro**: $20/month - 50,000 emails
- **Business**: $80/month - 250,000 emails

### Estimated Usage:

- 100 users/day × 1 welcome email = 100 emails/day
- 50 petitions/day × 1 approval email = 50 emails/day
- 200 signatures/day × 1 confirmation = 200 emails/day
- **Total**: ~350 emails/day = ~10,500/month

**Recommendation**: Start with free tier, upgrade to Pro after 100 daily active users.

## 🐛 Troubleshooting

### Emails not sending?

1. Check API key is correct
2. Verify environment variables loaded
3. Check Resend dashboard for errors
4. Ensure domain is verified (for production)

### Emails in spam?

1. Verify domain with SPF/DKIM records
2. Add DMARC policy
3. Warm up sending (start slow)
4. Avoid spam trigger words

### Template not rendering?

1. Check HTML syntax
2. Test in email client preview
3. Validate inline CSS
4. Check for missing variables

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [Email Best Practices](https://resend.com/docs/best-practices)
- [SPF/DKIM Setup](https://resend.com/docs/dashboard/domains/introduction)

## ✅ Next Steps

1. Set up Resend account
2. Add API key to environment
3. Test all 5 email types
4. Integrate with existing flows
5. Monitor delivery rates
6. Optimize templates based on feedback

---

**Status**: ✅ Email system implemented and ready for testing
**Estimated Setup Time**: 30 minutes
**Ready for Production**: Yes (after domain verification)
