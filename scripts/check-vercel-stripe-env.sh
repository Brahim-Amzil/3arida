#!/usr/bin/env bash
# List Stripe-related Vercel env vars (names only). Requires: vercel login && vercel link
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v vercel >/dev/null 2>&1; then
  echo "Install Vercel CLI: npm i -g vercel"
  exit 1
fi

echo "=== Stripe env on Vercel (production) ==="
vercel env ls production 2>/dev/null | grep -i stripe || echo "(none or not logged in)"

echo ""
echo "=== Stripe env on Vercel (preview) ==="
vercel env ls preview 2>/dev/null | grep -i stripe || echo "(none)"

echo ""
echo "=== Pull production env to .env.local (optional) ==="
echo "Run: vercel env pull .env.local --environment=production"
echo "Then restart: npm run dev"
