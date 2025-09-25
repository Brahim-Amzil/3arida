#!/bin/bash

# 3arida Petition Platform - Production Deployment Script
# This script handles the complete deployment process with safety checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="3arida-petition-platform"
FIREBASE_PROJECT_ID="your-project-id"  # Update this
PRODUCTION_URL="https://3arida.ma"

echo -e "${BLUE}🚀 Starting deployment for ${PROJECT_NAME}${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI not found. Please install it: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    print_error "Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ required. Current version: $(node --version)"
    exit 1
fi

print_status "Environment checks passed"

# Check if production environment file exists
if [ ! -f ".env.production.local" ]; then
    print_warning "Production environment file not found"
    echo "Please create .env.production.local with your production values"
    echo "You can copy from .env.production as a template"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci
print_status "Dependencies installed"

# Run linting
echo -e "${BLUE}🔍 Running linter...${NC}"
npm run lint
print_status "Linting passed"

# Run type checking
echo -e "${BLUE}📝 Running type check...${NC}"
npm run type-check
print_status "Type checking passed"

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm run test
print_status "Tests passed"

# Build the application
echo -e "${BLUE}🏗️  Building application...${NC}"
npm run build:export
print_status "Build completed"

# Check if build output exists
if [ ! -d "out" ]; then
    print_error "Build output directory 'out' not found"
    exit 1
fi

# Deploy Firestore rules and indexes first
echo -e "${BLUE}🔐 Deploying Firestore rules and indexes...${NC}"
firebase deploy --only firestore --project "$FIREBASE_PROJECT_ID"
print_status "Firestore rules and indexes deployed"

# Deploy Storage rules
echo -e "${BLUE}📁 Deploying Storage rules...${NC}"
firebase deploy --only storage --project "$FIREBASE_PROJECT_ID"
print_status "Storage rules deployed"

# Deploy hosting
echo -e "${BLUE}🌐 Deploying to Firebase Hosting...${NC}"
firebase deploy --only hosting --project "$FIREBASE_PROJECT_ID"
print_status "Hosting deployed"

# Wait a moment for deployment to propagate
echo -e "${BLUE}⏳ Waiting for deployment to propagate...${NC}"
sleep 10

# Test the deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"

# Check if the site is accessible
if curl -f -s "$PRODUCTION_URL" > /dev/null; then
    print_status "Site is accessible at $PRODUCTION_URL"
else
    print_warning "Site may not be fully accessible yet. DNS propagation can take time."
fi

# Run performance audit (optional)
read -p "Run performance audit? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📊 Running performance audit...${NC}"
    if command -v lighthouse &> /dev/null; then
        lighthouse "$PRODUCTION_URL" --output=html --output-path=./performance-audit-production.html --chrome-flags="--headless"
        print_status "Performance audit completed. Check performance-audit-production.html"
    else
        print_warning "Lighthouse not installed. Skipping performance audit."
    fi
fi

# Deployment summary
echo -e "${GREEN}"
echo "🎉 Deployment completed successfully!"
echo "=================================="
echo "🌐 Production URL: $PRODUCTION_URL"
echo "📊 Firebase Console: https://console.firebase.google.com/project/$FIREBASE_PROJECT_ID"
echo "💳 Stripe Dashboard: https://dashboard.stripe.com/"
echo "📈 Analytics: https://analytics.google.com/"
echo -e "${NC}"

# Post-deployment checklist
echo -e "${YELLOW}📋 Post-deployment checklist:${NC}"
echo "□ Test user registration and login"
echo "□ Test petition creation and signing"
echo "□ Test payment processing (QR upgrades)"
echo "□ Test admin dashboard functionality"
echo "□ Verify email notifications (if enabled)"
echo "□ Check mobile responsiveness"
echo "□ Monitor error logs for 24 hours"
echo "□ Update team and stakeholders"

# Optional: Open the site
read -p "Open the production site in browser? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "$PRODUCTION_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$PRODUCTION_URL"
    else
        echo "Please open $PRODUCTION_URL in your browser"
    fi
fi

print_status "Deployment script completed!"