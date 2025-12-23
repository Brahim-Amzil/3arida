# WhatsApp API Pricing and Limits

## Development Mode (Before App Review)

**Limitations:**

- Can only send to **5 test phone numbers**
- Must manually add each test number in Meta Dashboard
- Unlimited messages to those 5 numbers (FREE)
- Cannot send to any other numbers

**Use Case:**

- Testing and development only
- Verify the integration works
- Test with your team (up to 5 people)

## Production Mode (After App Review Approval)

**Free Tier:**

- **First 1,000 conversations per month: FREE**
- A "conversation" = 24-hour window of messages with a user
- Sending verification code = 1 conversation

**Paid Tier (After 1,000/month):**

- ~$0.005 - $0.01 per conversation (varies by country)
- Morocco: approximately $0.008 per conversation
- Still 80-90% cheaper than Firebase SMS ($0.05 per SMS)

## Cost Comparison

### Firebase SMS (Current)

- Cost: $0.05 per SMS
- 1,000 users/month: **$50**
- 10,000 users/month: **$500**

### WhatsApp (After Approval)

- First 1,000: **FREE**
- Next 9,000: ~$72 (at $0.008 each)
- 10,000 users/month: **$72 total**

**Savings: $428/month (85% reduction) for 10,000 users**

## App Review Requirements

### What You Need:

1. **Privacy Policy URL** (you likely already have this)
2. **Terms of Service URL** (you likely already have this)
3. **Simple description**: "We use WhatsApp to send verification codes to users when they create petitions"
4. **App must be published/live** (not in development mode)

### What You DON'T Need:

- ❌ Business verification (that's different and more complex)
- ❌ Official WhatsApp Business Account
- ❌ Green checkmark verification
- ❌ Complex documentation

### Timeline:

- Submission: 5-10 minutes
- Review: 2-5 business days typically
- Approval: Instant access to production

## Recommended Strategy

### Phase 1: Development (Now)

- Use 5 test numbers to verify system works
- Keep Firebase SMS active for production users
- Test thoroughly with your team

### Phase 2: Limited Beta

- Submit for app review
- Once approved, enable WhatsApp for new users
- Keep Firebase SMS as fallback
- Monitor costs and reliability

### Phase 3: Full Migration

- After 1-2 months of stable WhatsApp usage
- Migrate all users to WhatsApp
- Disable Firebase SMS
- Save 80-90% on verification costs

## Alternative: Selective Verification

**Only require phone verification for petition creators:**

- Reduces verification volume by 90%+
- Most users just sign/comment (no verification needed)
- Prevents spam petitions (main abuse vector)
- Much lower costs

**Example:**

- 10,000 total users
- Only 500 create petitions (5%)
- Verification cost: **FREE** (under 1,000/month)
- Savings: **100%** compared to verifying everyone

## Monitoring Usage

Check your usage in Meta Dashboard:

1. Go to WhatsApp > Analytics
2. View conversation counts
3. Monitor costs
4. Set up billing alerts

## Important Notes

- The 1,000 free conversations reset monthly
- Test mode (5 numbers) doesn't count toward the 1,000 limit
- Conversations are 24-hour windows (multiple messages = 1 conversation)
- Pricing varies slightly by country
- No hidden fees or setup costs

## Next Steps

1. ✅ Complete development testing (5 numbers)
2. ⏳ Submit for app review when ready
3. ⏳ Get approved (2-5 days)
4. ✅ Start with 1,000 free verifications/month
5. 📊 Monitor usage and costs
6. 💰 Save 80-90% on verification costs
