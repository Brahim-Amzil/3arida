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

      <div className="max-w-4xl mx-auto px-4 lg:px-6 lg:px-8 py-12">
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

            {/* Original Mission Text */}
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {t('about.mission.paragraph1')}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {t('about.mission.paragraph2')}
            </p>

            {/* Why 3arida is not free - Exact copy from Help page */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              هل #منصة_عريضة مجانية؟
            </h3>

            {/* Commitment to Free lgall Petitions - FIRST */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-900 font-semibold mb-2">
                ✅ نعم! إلتزامنا الدائم
              </p>
              <p className="text-blue-800 text-lg">
                <strong>نحن ملتزمون بإبقاء </strong>#منصة_عريضة{' '}
                <strong>مجانية دائماً</strong> للعرائض الصغيرة التي تستهدف حتى{' '}
                <strong>2500 توقيع</strong>. هدفنا هو دعم القضايا المحلية
                والمبادرات المجتمعية.
              </p>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {' '}
              <strong> #منصة_عريضة</strong> هي <strong>مبادرة مستقلة</strong>{' '}
              غير مدعومة من أي منظمة أو مؤسسة جهة عمومية أو خاصة. و لضمان
              إستمرارية المنصة في أداء مهمتها الإجتماعية، فهي بحاجة لفريق عمل
              للتطوير و الدعم الفني و الإشراف فضلا عن توفير بيئة تقنية لإستضافة
              و تدبير آلاف العرائض التي ستحتضن أعداداً جد ضخمة من التوقيعات، و
              كل هذا مُكلِّف جداً مادياً. و لهذا نحن نعتمد على رسوم رمزية عن
              الخدمة للمساعدة و لو نسبياً في تغطية تكاليف التشغيل والتطوير.{' '}
            </p>
            <p className="text-black-900 font-semibold mb-2 text-lg">
              ما يميزنا:
            </p>
            <ul className="list-disc list-inside space-y-1 text-black-800 text-lg">
              <li>لا نعرض إعلانات على المنصة</li>
              <li>لا نبيع بيانات المستخدمين</li>
              <li>استقلالية كاملة في القرارات</li>
              <li>شفافية في التسعير</li>
            </ul>
            <br />
            <div className=" border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-gray-600 text-lg">
                <strong>ملاحظة:</strong> منصات العرائض الأجنبية مدعومة من منظمات
                كبيرة وتتلقى تمويلاً من مؤسسات عامة وخاصة بالإضافة إلى إكراميات
                المستخدمين، مما يسمح لها بتقديم خدمات مجانية.
              </p>
            </div>
            <br />
            {/* Beta Launch Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-900 text-lg mb-2">
                <strong>
                  🎉 فترة الإطلاق التجريبي - يمكنك إستخذام منصة #عريضة مجاناً
                  بالكامل
                </strong>
              </p>
              <p className="text-green-800 text-lg">
                خلال فترة الإطلاق التجريبي (Beta)، يمكنك إنشاء عرائض مجانية
                بنسبة 100%. يتم تطبيق كوبون BETA100 تلقائياً على جميع العرائض.
                استفد من هذه الفرصة المحدودة!
              </p>
            </div>
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
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center me-4">
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
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center me-4">
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
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center me-4">
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
          <div className="flex flex-col lg:flex-row gap-4 justify-center">
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
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">{t('about.contact.question')}</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <svg
              className="w-5 h-5"
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
            {t('about.contact.link')}
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
