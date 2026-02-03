#!/bin/bash

echo "🧪 Testing Coupon Validation API..."
echo ""

# Test with invalid coupon (should return 404)
echo "Test 1: Invalid coupon code"
curl -X POST http://localhost:3004/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"INVALID123"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "---"
echo ""

# Test with empty code (should return 400)
echo "Test 2: Empty coupon code"
curl -X POST http://localhost:3004/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":""}' \
  -w "\nStatus: %{http_code}\n\n"
