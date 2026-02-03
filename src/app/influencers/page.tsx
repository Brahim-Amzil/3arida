'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

export default function InfluencersPage() {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Discount tiers based on follower count
  const discountTiers = [
    {
      id: '30k',
      followers: '30,000+',
      discount: '10%',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      id: '50k',
      followers: '50,000+',
      discount: '15%',
      color: 'bg-green-50 border-green-200 text-green-800',
      badge: 'bg-green-100 text-green-800',
    },
    {
      id: '100k',
      followers: '100,000+',
      discount: '20%',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      badge: 'bg-purple-100 text-purple-800',
    },
    {
      id: '500k',
      followers: '500,000+',
      discount: '30%',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      badge: 'bg-orange-100 text-orange-800',
    },
  ];

  // Sample petition ideas for different causes
  const petitionIdeas = [
    {
      id: 1,
      category: 'Environment',
      title: 'حماية الغابات المغربية من التصحر',
      description: 'مبادرة لحماية الغابات المغربية وزراعة مليون شجرة جديدة',
      targetSignatures: 10000,
      urgency: 'high',
    },
    {
      id: 2,
      category: 'Education',
      title: 'توفير الإنترنت المجاني في المدارس الريفية',
      description: 'ضمان وصول جميع الطلاب للتعليم الرقمي',
      targetSignatures: 5000,
      urgency: 'medium',
    },
    {
      id: 3,
      category: 'Healthcare',
      title: 'تحسين خدمات الصحة النفسية للشباب',
      description: 'توفير الدعم النفسي المجاني للشباب المغربي',
      targetSignatures: 7500,
      urgency: 'high',
    },
    {
      id: 4,
      category: 'Social Justice',
      title: 'دعم حقوق الأشخاص ذوي الإعاقة',
      description: 'تحسين إمكانية الوصول في الأماكن العامة',
      targetSignatures: 3000,
      urgency: 'medium',
    },
    {
      id: 5,
      category: 'Infrastructure',
      title: 'تطوير النقل العمومي في المدن الكبرى',
      description: 'نظام نقل عمومي صديق للبيئة وفعال',
      targetSignatures: 15000,
      urgency: 'low',
    },
    {
      id: 6,
      category: 'Culture',
      title: 'الحفاظ على التراث الثقافي المغربي',
      description: 'حماية المواقع التاريخية والتراث الشعبي',
      targetSignatures: 2500,
      urgency: 'medium',
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'عاجل';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'منخفض';
      default:
        return 'عادي';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('influencers.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('influencers.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/petitions/create">
              <Button size="lg" className="px-8">
                {t('influencers.startPetition')}
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8">
              {t('influencers.learnMore')}
            </Button>
          </div>
        </div>

        {/* Impact Statement */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('influencers.impact.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              {t('influencers.impact.description')}
            </p>
          </div>
        </div>

        {/* Discount Tiers */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('influencers.discounts.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('influencers.discounts.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountTiers.map((tier) => (
              <Link
                key={tier.id}
                href={`/contact?reason=influencer-coupon&tier=${tier.discount.replace('%', '')}`}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${tier.color}`}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${tier.badge} mb-2`}
                    >
                      {tier.followers} {t('influencers.followers')}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {tier.discount} {t('influencers.discount')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm opacity-80 mb-2">
                      {t('influencers.onAllTiers')}
                    </p>
                    <p className="text-xs font-semibold text-purple-600">
                      {t('influencers.clickToRequest')} ←
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              {t('influencers.verificationNote')}
            </p>
          </div>
        </div>

        {/* Petition Ideas */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('influencers.petitionIdeas.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('influencers.petitionIdeas.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petitionIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-600">
                      {idea.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(idea.urgency)}`}
                    >
                      {getUrgencyText(idea.urgency)}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {idea.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    {idea.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {t('influencers.targetSignatures')}:{' '}
                      {idea.targetSignatures.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/petitions/create?template=${idea.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        {t('influencers.adoptPetition')}
                      </Button>
                    </Link>
                    <Link href="/petitions/create" className="flex-1">
                      <Button size="sm" className="w-full">
                        {t('influencers.startNew')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('influencers.howItWorks.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('influencers.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('influencers.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('influencers.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('influencers.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t('influencers.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('influencers.step3.description')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-400 rounded-2xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('influencers.cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('influencers.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/petitions/create">
              <Button size="lg" variant="secondary" className="px-8">
                {t('influencers.cta.startPetition')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white text-white bg-green-100 text-gray-800 hover:bg-white hover:text-gray-900"
              >
                {t('influencers.cta.contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
