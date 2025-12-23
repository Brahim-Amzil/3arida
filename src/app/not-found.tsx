'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-xl">
          <CardContent className="p-8 md:p-12 text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="text-9xl font-bold text-green-600 mb-4">404</div>
              <div className="text-6xl mb-4">🔍</div>
            </div>

            {/* Bilingual Message */}
            <div className="space-y-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                الصفحة غير موجودة
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
                Page Not Found
              </h2>
              <p className="text-gray-600 text-lg">
                عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
              </p>
              <p className="text-gray-600">
                Sorry, the page you're looking for doesn't exist or has been
                moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Link href="/">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  الصفحة الرئيسية / Home
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Link href="/petitions">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  تصفح العرائض / Browse Petitions
                </Link>
              </Button>
            </div>

            {/* Help Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                هل تحتاج إلى مساعدة؟ / Need help?{' '}
                <Link
                  href="/contact"
                  className="text-green-600 hover:text-green-700 font-medium underline"
                >
                  تواصل معنا / Contact us
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
