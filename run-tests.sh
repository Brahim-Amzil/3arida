#!/bin/bash

# 3arida Platform Test Runner
# This script runs all types of tests for the platform

set -e

echo "🚀 3arida Platform - Comprehensive Test Suite"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ to continue."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm to continue."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Run TypeScript type checking
print_status "Running TypeScript type checking..."
if npm run type-check; then
    print_success "TypeScript type checking passed"
else
    print_error "TypeScript type checking failed"
    exit 1
fi

# Run linting
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
else
    print_warning "Linting issues found (not blocking)"
fi

# Run unit tests
print_status "Running unit tests..."
if npm test -- --passWithNoTests --coverage; then
    print_success "Unit tests passed"
else
    print_error "Unit tests failed"
    exit 1
fi

# Check if Firebase emulators are available for integration tests
print_status "Checking Firebase CLI availability..."
if command -v firebase &> /dev/null; then
    print_success "Firebase CLI found"
    
    print_status "Running integration tests with Firebase emulators..."
    # Start emulators in background
    firebase emulators:start --only auth,firestore,storage &
    EMULATOR_PID=$!
    
    # Wait for emulators to start
    sleep 10
    
    # Run integration tests
    if npm run test:integration; then
        print_success "Integration tests passed"
    else
        print_warning "Integration tests failed (may require Firebase setup)"
    fi
    
    # Stop emulators
    kill $EMULATOR_PID 2>/dev/null || true
else
    print_warning "Firebase CLI not found. Skipping integration tests."
    print_warning "Install Firebase CLI with: npm install -g firebase-tools"
fi

# Check if development server is running for E2E tests
print_status "Checking if development server is available..."
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Development server is running"
    
    # Run E2E tests
    print_status "Running end-to-end tests..."
    if npm run test:e2e; then
        print_success "End-to-end tests passed"
    else
        print_warning "End-to-end tests failed (may require running dev server)"
    fi
else
    print_warning "Development server not running on localhost:3000"
    print_warning "Start dev server with: npm run dev"
    print_warning "Skipping end-to-end tests"
fi

# Generate test report
print_status "Generating test coverage report..."
if [ -d "coverage" ]; then
    print_success "Coverage report available in ./coverage/lcov-report/index.html"
else
    print_warning "No coverage report generated"
fi

echo ""
echo "=============================================="
print_success "Test suite completed!"
echo ""
echo "📊 Test Summary:"
echo "  ✅ TypeScript compilation"
echo "  ✅ Unit tests"
echo "  ⚠️  Integration tests (requires Firebase emulators)"
echo "  ⚠️  E2E tests (requires dev server)"
echo ""
echo "🚀 Next steps:"
echo "  1. Start development server: npm run dev"
echo "  2. Start Firebase emulators: firebase emulators:start"
echo "  3. Run full test suite: ./run-tests.sh"
echo ""
echo "📖 For more testing information, see TESTING.md"