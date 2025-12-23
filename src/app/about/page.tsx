'use client';

import React from 'react';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {t('about.mission.paragraph1')}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {t('about.mission.paragraph2')}
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('about.howItWorks.title')}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('about.howItWorks.step1.title')}
                  </h3>
                  <p className="text-gray-700">
                    {t('about.howItWorks.step1.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('about.howItWorks.step2.title')}
                  </h3>
                  <p className="text-gray-700">
                    {t('about.howItWorks.step2.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold text-xl">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('about.howItWorks.step3.title')}
                  </h3>
                  <p className="text-gray-700">
                    {t('about.howItWorks.step3.description')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('about.features.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t('about.features.secureAuth.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.features.secureAuth.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {t('about.features.discussion.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.features.discussion.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  {t('about.features.sharing.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.features.sharing.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {t('about.features.analytics.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.features.analytics.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  {t('about.features.privacy.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.features.privacy.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {t('about.features.notifications.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.features.notifications.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('about.values.title')}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.values.voices.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.values.voices.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.values.community.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.values.community.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.values.transparency.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.values.transparency.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('about.values.impact.title')}
                </h3>
                <p className="text-gray-700">
                  {t('about.values.impact.description')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">{t('about.cta.title')}</h2>
          <p className="text-lg mb-6 text-green-50">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/petitions/create">
                {t('about.cta.startPetition')}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <Link href="/petitions">{t('about.cta.browsePetitions')}</Link>
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">{t('about.contact.question')}</p>
          <p>
            {t('about.contact.email')}{' '}
            <a
              href="mailto:support@3arida.ma"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              support@3arida.ma
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
