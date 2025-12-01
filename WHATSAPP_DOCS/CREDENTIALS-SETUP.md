# WhatsApp API Credentials Setup

## Your WhatsApp Business Credentials

```
Phone Number ID: 955517827633887
WhatsApp Business Account ID: 186877493784901
Test Phone Number: +1 555 173 8972
```

## Next Steps

### 1. Generate Access Token

- Click "Generate access token" button in the Meta Dashboard
- Copy the token (it will be a long string starting with "EAA...")
- Add to `.env.local` as `WHATSAPP_ACCESS_TOKEN`

### 2. Add Test Recipient

- In the "To" field, add your personal phone number (with country code)
- Format: +212XXXXXXXXX (for Morocco)
- You can test with up to 5 phone numbers for free

### 3. Test Send Message

- Click "Send message" button to test
- You should receive a "Hello world" message on WhatsApp
- This confirms your API is working

### 4. Configure Webhook

Your webhook URL will be:

```
https://your-app.vercel.app/api/whatsapp/webhook
```

Webhook Verify Token (create your own secure string):

```
WHATSAPP_VERIFY_TOKEN=your_secure_random_string_here
```

### 5. Update .env.local

Add these to your `3arida-app/.env.local`:

```bash
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=955517827633887
WHATSAPP_ACCESS_TOKEN=<your_generated_token>
WHATSAPP_VERIFY_TOKEN=<your_secure_random_string>
WHATSAPP_BUSINESS_ACCOUNT_ID=186877493784901
```

## Testing Flow

1. User enters phone number in your app
2. Your app generates 6-digit code
3. Your app sends code via WhatsApp API
4. User receives code on WhatsApp
5. User enters code in your app
6. Your app verifies and marks user as verified

## Important Notes

- Test phone number is free for 90 days
- Can send to 5 phone numbers during testing
- First 1,000 conversations/month are FREE in production
- After that: ~$0.005-0.01 per conversation (vs $0.05 for SMS)
