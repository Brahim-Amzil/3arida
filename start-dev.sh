#!/bin/bash

# Load environment variables from .env.local
set -a
source .env.local
set +a

# Start Next.js dev server on port 3001
PORT=3001 npm run dev
