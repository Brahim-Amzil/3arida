'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * MVP Pricing Page
 *
 * Simple, free-focused pricing page for MVP launch.
 * Shows that all features are currently free during beta.
 */
export default function MVPPricingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Beta Banner */}
        <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">🎉</span>
            <h2 className="text-2xl font-bold text-green-900">
              {t('mvp.pricing.betaTitle') || 'نسخة تجريبية مجانية'}
            </h2>
            <span className="text-3xl">🎉</span>
          </div>
          <p className="text-lg text-green-800">
            {t('mvp.pricing.betaSubtitle') ||
              'جميع الميزات مجانية خلال فترة الإطلاق!'}
          </p>
        </div>

        {/* Main Pricing Card */}
        <Card className="shadow-2xl border-none overflow-hidden">
          {/* Header */}
          <CardHeader className="p-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="text-center">
              <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
                {t('mvp.pricing.freePlan') || 'خطة مجانية'}
              </div>
              <CardTitle className="text-4xl font-extrabold mb-2">
                0 {t('common.moroccanDirham') || 'درهم'}
              </CardTitle>
              <p className="text-xl text-white/90">
                {t('mvp.pricing.duringBeta') || 'خلال فترة التجريب'}
              </p>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-8">
            {/* What's Included */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {t('mvp.pricing.whatsIncluded') || 'ما المتضمن؟'}
              </h3>
              <div className="space-y-3">
                <FeatureItem
                  text={t('mvp.pricing.feature1') || 'إنشاء عرائض غير محدودة'}
                />
                <FeatureItem
                  text={
                    t('mvp.pricing.feature2') || 'حتى 10,000 توقيع لكل عريضة'
                  }
                />
                <FeatureItem
                  text={t('mvp.pricing.feature3') || 'رفع حتى 3 صور'}
                />
                <FeatureItem
                  text={
                    t('mvp.pricing.feature4') ||
                    'مشاركة على وسائل التواصل الاجتماعي'
                  }
                />
                <FeatureItem
                  text={t('mvp.pricing.feature5') || 'نظام التعليقات'}
                />
                <FeatureItem
                  text={t('mvp.pricing.feature6') || 'لوحة تحكم شخصية'}
                />
                <FeatureItem
                  text={t('mvp.pricing.feature7') || 'إحصائيات أساسية'}
                />
                <FeatureItem text={t('mvp.pricing.feature8') || 'دعم فني'} />
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mb-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-12 py-4 rounded-xl shadow-lg text-lg"
                asChild
              >
                <Link href="/petitions/create">
                  {t('mvp.pricing.startNow') || 'ابدأ الآن مجاناً'}
                </Link>
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800">
                {t('mvp.pricing.betaInfo') ||
                  'نحن في مرحلة الإطلاق التجريبي. جميع الميزات مجانية حالياً. ساعدنا في تحسين المنصة بملاحظاتك!'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Future Plans Notice */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-lg shadow-md p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('mvp.pricing.futureTitle') || 'ماذا عن المستقبل؟'}
            </h3>
            <p className="text-gray-700">
              {t('mvp.pricing.futureDesc') ||
                'نخطط لإضافة خطط مدفوعة في المستقبل مع ميزات إضافية. لكن لا تقلق - جميع العرائض التي تنشئها الآن ستبقى نشطة، وستحصل على مزايا خاصة كمستخدم مبكر!'}
            </p>
          </div>
        </div>

        {/* Contact Box */}
        <div className="mt-8">
          <div className="rounded-lg border-2 border-green-500 bg-green-50 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                {t('mvp.pricing.questionsTitle') || 'لديك أسئلة؟'}
              </h3>
              <p className="text-green-800 mb-4">
                {t('mvp.pricing.questionsDesc') ||
                  'نحن هنا للمساعدة! تواصل معنا في أي وقت.'}
              </p>
              <Link href="/contact">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
                  {t('mvp.pricing.contactUs') || 'تواصل معنا'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Helper component for feature list
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-green-600" />
        </div>
      </div>
      <span className="text-gray-800 font-medium">{text}</span>
    </div>
  );
}
