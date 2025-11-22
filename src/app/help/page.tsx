'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections based on search query
  const filterContent = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 mb-6">
            Find answers to common questions and learn how to use 3arida
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 mt-2">
                Showing results for "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Getting Started */}
        {filterContent('getting started create petition sign petition') && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I create a petition?
                </h3>
                <p className="text-gray-600 mb-2">
                  Creating a petition on 3arida is simple:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                  <li>Sign up or log in to your account</li>
                  <li>Click "Start a Petition" button</li>
                  <li>
                    Fill in your petition details (title, description, category)
                  </li>
                  <li>Add images or videos to support your cause</li>
                  <li>Set your signature goal</li>
                  <li>Submit for review</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I sign a petition?
                </h3>
                <p className="text-gray-600 mb-2">To sign a petition:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                  <li>Browse petitions or search for a specific cause</li>
                  <li>Click on the petition to view details</li>
                  <li>Click "Sign This Petition" button</li>
                  <li>Verify your phone number (for security)</li>
                  <li>
                    Optionally add a comment explaining why you're signing
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account & Profile */}
        {filterContent('account profile password reset edit bio') && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Account & Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I create an account?
                </h3>
                <p className="text-gray-600">
                  You can sign up using your email address or Google account.
                  Click "Sign Up" in the top right corner and follow the
                  registration process.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I edit my profile?
                </h3>
                <p className="text-gray-600">
                  Yes! Go to your profile page and click "Edit Bio" to update
                  your information, including your name, bio, and profile
                  picture.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I reset my password?
                </h3>
                <p className="text-gray-600">
                  Click "Forgot Password" on the login page, enter your email
                  address, and we'll send you instructions to reset your
                  password.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Managing Petitions */}
        {filterContent('managing petition approval edit delete update') && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                Managing Your Petitions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How long does petition approval take?
                </h3>
                <p className="text-gray-600">
                  Our moderation team reviews petitions within 24-48 hours.
                  You'll receive a notification once your petition is approved
                  or if changes are needed.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I edit my petition after submitting?
                </h3>
                <p className="text-gray-600">
                  If your petition is rejected, you can edit and resubmit it (up
                  to 3 times). Once approved, major changes require contacting
                  support to maintain petition integrity.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I delete my petition?
                </h3>
                <p className="text-gray-600 mb-2">
                  You can delete your petition under certain conditions:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>If it has 10 or fewer signatures</li>
                  <li>If it's still pending approval</li>
                  <li>If it was created less than 24 hours ago</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  For petitions with more signatures, you can request deletion
                  from our moderation team.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What are petition updates?
                </h3>
                <p className="text-gray-600">
                  As a petition creator, you can post updates to keep supporters
                  informed about progress, victories, or next steps. Updates
                  appear on your petition page.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sharing & Promotion */}
        {filterContent('sharing promotion share qr code social media') && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Sharing & Promotion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I share my petition?
                </h3>
                <p className="text-gray-600 mb-2">
                  You can share your petition in multiple ways:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Social media (Facebook, Twitter, WhatsApp)</li>
                  <li>Direct link copying</li>
                  <li>Email sharing</li>
                  <li>QR code (download and print)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What is a QR code and how do I use it?
                </h3>
                <p className="text-gray-600">
                  A QR code is a scannable code that links directly to your
                  petition. You can download it from your petition page and
                  print it on flyers, posters, or share it digitally. People can
                  scan it with their phone camera to instantly access your
                  petition.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy & Security */}
        {filterContent(
          'privacy security phone verification anonymous safe'
        ) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is my personal information safe?
                </h3>
                <p className="text-gray-600">
                  Yes. We use industry-standard security measures to protect
                  your data. Your email and phone number are never shared
                  publicly. Only your name and optional comment appear when you
                  sign a petition.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Why do I need to verify my phone number?
                </h3>
                <p className="text-gray-600">
                  Phone verification ensures that each signature is from a real
                  person and prevents duplicate or fraudulent signatures. This
                  maintains the integrity of all petitions on our platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I sign anonymously?
                </h3>
                <p className="text-gray-600">
                  While we require phone verification for security, you can
                  choose not to display your full name publicly. However,
                  petition creators can see all signatures to verify support.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing & Payments */}
        {filterContent(
          'pricing payment free tier basic premium enterprise'
        ) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Pricing & Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is 3arida free to use?
                </h3>
                <p className="text-gray-600 mb-2">
                  Yes! Creating and signing petitions is free. We offer
                  different tiers based on your signature goal:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Free: Up to 2,500 signatures</li>
                  <li>Basic: Up to 5,000 signatures</li>
                  <li>Premium: Up to 10,000 signatures</li>
                  <li>Enterprise: Up to 100,000 signatures</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit and debit cards through our secure
                  payment processor Stripe. All transactions are encrypted and
                  secure.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Issues */}
        {filterContent(
          'technical issues upload image loading troubleshooting'
        ) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Technical Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  I'm having trouble uploading images
                </h3>
                <p className="text-gray-600 mb-2">
                  Make sure your images meet these requirements:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Format: JPG, PNG, or WebP</li>
                  <li>Size: Maximum 5MB per image</li>
                  <li>Dimensions: At least 800x600 pixels recommended</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  The website isn't loading properly
                </h3>
                <p className="text-gray-600 mb-2">
                  Try these troubleshooting steps:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Clear your browser cache and cookies</li>
                  <li>Try a different browser</li>
                  <li>Check your internet connection</li>
                  <li>Disable browser extensions temporarily</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        {filterContent('contact support help email') && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you couldn't find the answer to your question, our support
                team is here to help.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Contact Support
                </h3>
                <p className="text-gray-600 mb-4">
                  Email us at:{' '}
                  <a
                    href="mailto:support@3arida.ma"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    support@3arida.ma
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results Message */}
        {searchQuery &&
          !filterContent('getting started create petition sign petition') &&
          !filterContent('account profile password reset edit bio') &&
          !filterContent('managing petition approval edit delete update') &&
          !filterContent('sharing promotion share qr code social media') &&
          !filterContent(
            'privacy security phone verification anonymous safe'
          ) &&
          !filterContent(
            'pricing payment free tier basic premium enterprise'
          ) &&
          !filterContent(
            'technical issues upload image loading troubleshooting'
          ) &&
          !filterContent('contact support help email') && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No results found
              </h3>
              <p className="mt-1 text-gray-500">
                Try searching with different keywords or{' '}
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  clear your search
                </button>
              </p>
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
}
