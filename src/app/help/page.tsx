'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export default function HelpPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sections based on search query
  const filterContent = (translationKeys: string[]) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    // Check if any of the translation keys contain the search query
    return translationKeys.some((key) => {
      const translatedText = t(key).toLowerCase();
      return translatedText.includes(query);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('help.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{t('help.subtitle')}</p>

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
                placeholder={t('help.searchPlaceholder')}
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
                {t('help.showingResults', { query: searchQuery })}
              </p>
            )}
          </div>
        </div>

        {/* Getting Started */}
        {filterContent([
          'help.gettingStarted.title',
          'help.gettingStarted.createPetition.title',
          'help.gettingStarted.signPetition.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.gettingStarted.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.gettingStarted.createPetition.title')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('help.gettingStarted.createPetition.intro')}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                  <li>{t('help.gettingStarted.createPetition.step1')}</li>
                  <li>{t('help.gettingStarted.createPetition.step2')}</li>
                  <li>{t('help.gettingStarted.createPetition.step3')}</li>
                  <li>{t('help.gettingStarted.createPetition.step4')}</li>
                  <li>{t('help.gettingStarted.createPetition.step5')}</li>
                  <li>{t('help.gettingStarted.createPetition.step6')}</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.gettingStarted.signPetition.title')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('help.gettingStarted.signPetition.intro')}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
                  <li>{t('help.gettingStarted.signPetition.step1')}</li>
                  <li>{t('help.gettingStarted.signPetition.step2')}</li>
                  <li>{t('help.gettingStarted.signPetition.step3')}</li>
                  <li>{t('help.gettingStarted.signPetition.step4')}</li>
                  <li>{t('help.gettingStarted.signPetition.step5')}</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account & Profile */}
        {filterContent([
          'help.account.title',
          'help.account.createAccount.title',
          'help.account.editProfile.title',
          'help.account.resetPassword.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.account.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.account.createAccount.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.account.createAccount.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.account.editProfile.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.account.editProfile.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.account.resetPassword.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.account.resetPassword.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Managing Petitions */}
        {filterContent([
          'help.managing.title',
          'help.managing.approval.title',
          'help.managing.edit.title',
          'help.managing.delete.title',
          'help.managing.updates.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.managing.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.managing.approval.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.managing.approval.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.managing.edit.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.managing.edit.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.managing.delete.title')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('help.managing.delete.intro')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>{t('help.managing.delete.condition1')}</li>
                  <li>{t('help.managing.delete.condition2')}</li>
                  <li>{t('help.managing.delete.condition3')}</li>
                </ul>
                <p className="text-gray-600 mt-2">
                  {t('help.managing.delete.note')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.managing.updates.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.managing.updates.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sharing & Promotion */}
        {filterContent([
          'help.sharing.title',
          'help.sharing.howToShare.title',
          'help.sharing.qrCode.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.sharing.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.sharing.howToShare.title')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('help.sharing.howToShare.intro')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>{t('help.sharing.howToShare.social')}</li>
                  <li>{t('help.sharing.howToShare.link')}</li>
                  <li>{t('help.sharing.howToShare.email')}</li>
                  <li>{t('help.sharing.howToShare.qr')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.sharing.qrCode.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.sharing.qrCode.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy & Security */}
        {filterContent([
          'help.privacy.title',
          'help.privacy.safe.title',
          'help.privacy.phoneVerification.title',
          'help.privacy.anonymous.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.privacy.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.privacy.safe.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.privacy.safe.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.privacy.phoneVerification.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.privacy.phoneVerification.description')}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.privacy.anonymous.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.privacy.anonymous.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing & Payments */}
        {filterContent([
          'help.pricing.title',
          'help.pricing.free.title',
          'help.pricing.payment.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.pricing.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.pricing.free.title')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('help.pricing.free.intro')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>{t('help.pricing.free.tier1')}</li>
                  <li>{t('help.pricing.free.tier2')}</li>
                  <li>{t('help.pricing.free.tier3')}</li>
                  <li>{t('help.pricing.free.tier4')}</li>
                  <li>{t('help.pricing.free.tier5')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.pricing.payment.title')}
                </h3>
                <p className="text-gray-600">
                  {t('help.pricing.payment.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Issues */}
        {filterContent([
          'help.technical.title',
          'help.technical.upload.title',
          'help.technical.loading.title',
        ]) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t('help.technical.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.technical.upload.title')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('help.technical.upload.intro')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>{t('help.technical.upload.format')}</li>
                  <li>{t('help.technical.upload.size')}</li>
                  <li>{t('help.technical.upload.dimensions')}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('help.technical.loading.title')}
                </h3>
                <p className="text-gray-600 mb-2">
                  {t('help.technical.loading.intro')}
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>{t('help.technical.loading.cache')}</li>
                  <li>{t('help.technical.loading.browser')}</li>
                  <li>{t('help.technical.loading.connection')}</li>
                  <li>{t('help.technical.loading.extensions')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        {filterContent([
          'help.contact.title',
          'help.contact.supportTitle',
          'help.contact.intro',
        ]) && (
          <Card className="mb-8">
            <CardHeader></CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  لا تزال تحتاج مساعدة؟
                </h3>
                <p className="text-gray-600 mb-4">{t('help.contact.intro')}</p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  <svg
                    className="w-4 h-4"
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
                  {t('help.contact.link')}
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results Message */}
        {searchQuery &&
          !filterContent([
            'help.gettingStarted.title',
            'help.gettingStarted.createPetition.title',
            'help.gettingStarted.signPetition.title',
          ]) &&
          !filterContent([
            'help.account.title',
            'help.account.createAccount.title',
            'help.account.editProfile.title',
            'help.account.resetPassword.title',
          ]) &&
          !filterContent([
            'help.managing.title',
            'help.managing.approval.title',
            'help.managing.edit.title',
            'help.managing.delete.title',
            'help.managing.updates.title',
          ]) &&
          !filterContent([
            'help.sharing.title',
            'help.sharing.howToShare.title',
            'help.sharing.qrCode.title',
          ]) &&
          !filterContent([
            'help.privacy.title',
            'help.privacy.safe.title',
            'help.privacy.phoneVerification.title',
            'help.privacy.anonymous.title',
          ]) &&
          !filterContent([
            'help.pricing.title',
            'help.pricing.free.title',
            'help.pricing.payment.title',
          ]) &&
          !filterContent([
            'help.technical.title',
            'help.technical.upload.title',
            'help.technical.loading.title',
          ]) &&
          !filterContent([
            'help.contact.title',
            'help.contact.supportTitle',
            'help.contact.intro',
          ]) && (
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
                {t('help.noResults.title')}
              </h3>
              <p className="mt-1 text-gray-500">
                {t('help.noResults.description')}{' '}
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t('help.noResults.clearSearch')}
                </button>
              </p>
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
}
