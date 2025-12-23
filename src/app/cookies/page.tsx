'use client';

import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CookiesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {t('cookies.title')}
            </h1>

            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                {t('cookies.lastUpdated')}: ديسمبر 2024
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('cookies.whatAre.title')}
                </h2>
                <p className="text-gray-700 mb-4">
                  {t('cookies.whatAre.content')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('cookies.howWeUse.title')}
                </h2>
                <p className="text-gray-700 mb-4">
                  {t('cookies.howWeUse.content')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('cookies.control.title')}
                </h2>
                <p className="text-gray-700 mb-4">
                  {t('cookies.control.content')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t('cookies.contact.title')}
                </h2>
                <p className="text-gray-700">{t('cookies.contact.content')}</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
