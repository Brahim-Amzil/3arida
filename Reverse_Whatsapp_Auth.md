The "Official" Way (WhatsApp Cloud API)
You use the official Meta Cloud API, but rely on the "User-Initiated" pricing model.

How it works: You set up the Official API. When the user sends the message, Meta sends a Webhook (JSON data) to your Firebase Function. You verify the code in the database. You do not reply to the user (or you reply with a simple "Verified").

Cost:

First 1,000 users/month: FREE. (Meta gives 1,000 free "Service" conversations per month).

After 1,000 users: You pay the "Service" rate for Morocco (approx $0.008).

Pros: 100% Legal, 100% Reliable, No risk of banning.

Cons: Requires Business Verification.

Verdict: This is the winner. It is free for your first 1,000 monthly active users and cheap afterwards.

How to implement the "Smart" Flow (Option B)
To make this user-friendly and not annoying, you must use Deep Links. Don't make the user type the number manually.

Step 1: The Client Side (Your App) When the user clicks "Verify", generate the code and open WhatsApp automatically using this URL scheme:

JavaScript

// Generate a random code, e.g., "5921"
const uniqueCode = "5921";
const myBusinessNumber = "212600000000"; // Your Verified Business Number

// Create the Deep Link
// Text is pre-filled. User just hits Send.
const url = `https://wa.me/${myBusinessNumber}?text=Verify code: ${uniqueCode}`;

// Open it
Linking.openURL(url); // (React Native example)
Step 2: The Backend (Firebase Cloud Function) You need a function to listen for the incoming Webhook from Meta.

JavaScript

exports.whatsappWebhook = onRequest(async (req, res) => {
if (req.method === "POST") {
const entry = req.body.entry?.[0];
const changes = entry?.changes?.[0];
const value = changes?.value;
const message = value?.messages?.[0];

    if (message) {
      const userPhone = message.from; // e.g. "2126..."
      const textBody = message.text.body; // "Verify code: 5921"

      // 1. Extract code from textBody
      const code = textBody.split(":")[1].trim();

      // 2. Check Database for this code
      // If match -> Update User Profile to { emailVerified: true }
      await verifyUserInFirestore(userPhone, code);
    }
    res.sendStatus(200);

} else {
// Required for Verification Token setup
// ... logic to echo back verify_token
}
});
Step 3: The User Experience

User clicks button.

WhatsApp opens.

User hits "Send".

User switches back to your app.

Your app (listening to the database) sees the status change to "Verified" and lets them in.

Summary
If you want Free, use Option B (Official API). It utilizes the 1,000 free service conversations quota per month. It is professional, robust, and safe.

#UPDATE #############
For the "Reverse OTP" method (Option B), you do not need Business Verification, and you do not need a Verified Business Account to get started.

This is why this specific "User-Initiated" strategy is so powerful for indie hackers: it bypasses the two biggest hurdles of the official API.

Why It Works Without Verification

It is a "Service" Conversation:

When the user sends you the message first, WhatsApp classifies this as a "Service Conversation."

Rule: Unverified businesses are allowed to have Service conversations.1 The "250 messages/day" limit you see online applies to Business-Initiated messages (marketing/utility).2 It does not strictly apply to replying to users who messaged you first.3

You Don't Need "Auth Templates":

Official "Authentication Templates" (the ones that look like Your code is 1234) often require business verification.

The Hack: Since the user sent you the code, you don't need to send a fancy template back. You can reply with a standard Free Form Text Message (e.g., "✅ Verified! return to the app.") because the user opened the 24-hour support window.4

The "Lite" Limits (Unverified Account)

While you don't need full verification, an unverified "Sandbox" or "Limited" account does have some invisible ceilings to prevent spam.

FeatureVerified BusinessUnverified BusinessUser-Initiated MsgsUnlimitedUnlimited (Functionally)\*Business-Initiated1,000 - Unlimited / day250 / day (Hard limit)Phone Number NameYour Brand Name (e.g. "PizzaApp")Phone Number (+212 6...)Green CheckmarkYesNo

\*Note on "Unlimited": If you suddenly go from 0 to 10,000 incoming messages in one hour, Meta's automated spam filters might flag your number. For a normal growing app, you are fine.

Critical Setup Detail: The Display Name

Since you are unverified, users will not see your app name ("MyCoolApp") at the top of the chat.

They will see: Your Phone Number (+212 6 XX XX XX XX).

They see your name only if: They click your profile info.

Fix: In your deep link text, make it clear.

Bad: Verify code: 1234

Good: Send this message to verify your MyCoolApp account: 1234

Summary of the Strategy

Get a clean number (a fresh SIM or virtual number).

Connect it to Meta Cloud API (create an app in developers.facebook.com).

Do NOT verify the business. Just leave it as an "Unverified" business account.

Implement the Deep Link method I showed above.

Cost: Free for the first 1,000 active users every month. After that, roughly ~$0.008 per user (Service rate).

Sources

Meta for Developers
developers.facebook.com
Cloud API Archive - WhatsApp Business Platform - Meta for Developers
Added POST /<BUSINESS_PORTFOLIO_ID>/self_certify_whatsapp_business endpoint for partner-led business verifiation. November 1, 2024. Cloud API, Pricing. Service ...

SleekFlow Help Center
help.sleekflow.io
Managing a WhatsApp Business API account - SleekFlow Help Center
Message limit. Messaging limits refer to the maximum number of business-initiated conversations (conversations opened as a result of sending a marketing, ...

Medium
medium.com
Understanding WhatsApp Business messaging limits | by Pepper Cloud - Medium
\*Note: - The messaging limit pertains to the number of users you plan to message, not the total number of messages your business can send. - The limit does ...

AiSensy
m.aisensy.com
New WhatsApp API Pricing Explained – Starting July 1, 2025 - AiSensy
When a user sends you a message, a 24-hour support window begins. Each new message from the user resets this window. During this window, you can respond freely ...
