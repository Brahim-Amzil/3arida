#!/bin/bash

echo "🧪 Testing Contact Form Email..."
echo ""

# Test influencer coupon request
curl -X POST http://localhost:3004/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Influencer",
    "email": "test@example.com",
    "reason": "influencer-coupon",
    "subject": "Test Coupon Request",
    "message": "This is a test message",
    "platform": "instagram",
    "accountUrl": "https://instagram.com/testuser",
    "followerCount": "50000",
    "discountTier": "15"
  }' | jq .

echo ""
echo "---"
echo "Check the response above:"
echo "✅ If success: true - Email was sent"
echo "❌ If error - Check the error message"
echo ""
echo "Email should be sent to: ${CONTACT_EMAIL:-3aridapp@gmail.com}"
