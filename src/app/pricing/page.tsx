'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, X, QrCode, MessageSquare } from 'lucide-react';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/hooks/useTranslation';

// Define the colors for subtle accents (Tailwind CSS classes)
const planColors: {
  [key: string]: { accent: string; button: string; hover: string };
} = {
  free: {
    accent: 'text-green-500',
    button: 'bg-green-500 hover:bg-green-600',
    hover: 'hover:bg-green-50',
  },
  starter: {
    accent: 'text-blue-500',
    button: 'bg-blue-500 hover:bg-blue-600',
    hover: 'hover:bg-blue-50',
  },
  pro: {
    accent: 'text-yellow-500',
    button: 'bg-yellow-500 hover:bg-yellow-600',
    hover: 'hover:bg-yellow-50',
  },
  advanced: {
    accent: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600',
    hover: 'hover:bg-orange-50',
  },
  enterprise: {
    accent: 'text-red-500',
    button: 'bg-red-500 hover:bg-red-600',
    hover: 'hover:bg-red-50',
  },
};

interface PricingPlan {
  id: string;
  name: string;
  signatureRange: string;
  price: string;
  features: string[];
  qrCode: {
    included: boolean;
    note?: string;
  };
  messaging: {
    available: boolean;
    details?: string;
  };
}

// Helper component for feature list items in organized rows
const FeatureRow: React.FC<{
  icon?: React.ElementType;
  title: string;
  description?: string;
  isIncluded?: boolean;
  accentClass?: string;
}> = ({
  icon: Icon,
  title,
  description,
  isIncluded = true,
  accentClass = 'text-gray-700',
}) => (
  <div className="flex items-start p-4 border-b border-gray-100 hover:bg-gray-50">
    <div className="flex-shrink-0 mr-4">
      {isIncluded ? (
        <Check className="w-5 h-5 text-green-500 mt-0.5" />
      ) : (
        <X className="w-5 h-5 text-red-500 mt-0.5" />
      )}
    </div>
    <div className="flex-1">
      <div className="flex items-center mb-1">
        {Icon && <Icon className={`w-4 h-4 mr-2 ${accentClass}`} />}
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  </div>
);

export default function PricingPage() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('advanced'); // Default to a paid plan for better visibility

  const pricingPlans: PricingPlan[] = [
    {
      id: 'free',
      name: t('pricing.page.freePlan'),
      signatureRange: t('pricing.page.upTo', { count: '2,500' }),
      price: `0 ${t('common.moroccanDirham')}`,
      features: [
        t('pricing.features.createPublish'),
        t('pricing.features.basicSharing'),
        t('pricing.features.basicAnalytics'),
        t('pricing.features.publicListing'),
      ],
      qrCode: {
        included: false,
        note: t('pricing.page.optionalAddon', { price: '19' }),
      },
      messaging: {
        available: false,
      },
    },
    {
      id: 'starter',
      name: t('pricing.page.starterPlan'),
      signatureRange: t('pricing.page.upTo', { count: '10,000' }),
      price: `69 ${t('common.moroccanDirham')}`,
      features: [
        t('pricing.features.allFreeFeatures'),
        t('pricing.features.customCoverImage'),
        t('pricing.features.enhancedSocialSharing'),
        t('pricing.features.basicAnalyticsDashboard'),
        t('pricing.features.fasterApproval'),
      ],
      qrCode: {
        included: true,
      },
      messaging: {
        available: true,
        details: t('pricing.page.messagingAddon', { count: '3', price: '19' }),
      },
    },
    {
      id: 'pro',
      name: t('pricing.page.proPlan'),
      signatureRange: t('pricing.page.upTo', { count: '30,000' }),
      price: `129 ${t('common.moroccanDirham')}`,
      features: [
        t('pricing.features.allStarterFeatures'),
        t('pricing.features.regionalTargeting'),
        t('pricing.features.petitionBranding'),
        t('pricing.features.priorityVisibility'),
      ],
      qrCode: {
        included: true,
      },
      messaging: {
        available: true,
        details: t('pricing.page.freeMessages', {
          count: '3',
          extraCount: '3',
          price: '19',
        }),
      },
    },
    {
      id: 'advanced',
      name: t('pricing.page.advancedPlan'),
      signatureRange: t('pricing.page.upTo', { count: '75,000' }),
      price: `229 ${t('common.moroccanDirham')}`,
      features: [
        t('pricing.features.allProFeatures'),
        t('pricing.features.advancedAnalytics'),
        t('pricing.features.exportSigneesData'),
        t('pricing.features.featuredListing'),
        t('pricing.features.emailSupport'),
      ],
      qrCode: {
        included: true,
      },
      messaging: {
        available: true,
        details: t('pricing.page.freeMessages', {
          count: '5',
          extraCount: '5',
          price: '29',
        }),
      },
    },
    {
      id: 'enterprise',
      name: t('pricing.page.enterprisePlan'),
      signatureRange: t('pricing.page.upTo', { count: '100,000' }),
      price: `369 ${t('common.moroccanDirham')}`,
      features: [
        t('pricing.features.allAdvancedFeatures'),
        t('pricing.features.apiAccess'),
        t('pricing.features.customDomain'),
        t('pricing.features.dedicatedSupport'),
        t('pricing.features.organizationBadge'),
        t('pricing.features.highestVisibility'),
      ],
      qrCode: {
        included: true,
      },
      messaging: {
        available: true,
        details: t('pricing.page.freeMessages', {
          count: '50',
          extraCount: '10',
          price: '29',
        }),
      },
    },
  ];

  const currentPlan =
    pricingPlans.find((plan) => plan.id === selectedPlan) || pricingPlans[0];
  const colors = planColors[currentPlan.id];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <br />
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {t('pricing.page.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricing.page.subtitle')}
          </p>
        </div>

        {/* Plan Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-3 p-1 bg-white rounded-xl shadow-inner max-w-fit mx-auto">
            {pricingPlans.map((plan) => {
              const tabColors = planColors[plan.id];
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? `${tabColors.button} text-white shadow-md`
                      : `text-gray-600 ${tabColors.hover}`
                  }`}
                >
                  {plan.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Plan Details Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="shadow-2xl border-none overflow-hidden">
            {/* Header Section with Subtle Gradient Accent */}
            <CardHeader className="p-8 bg-white border-b border-gray-100">
              <div className="flex flex-col items-center">
                <div
                  className={`text-sm font-semibold uppercase tracking-wider mb-2 ${colors.accent}`}
                >
                  {currentPlan.name}
                </div>
                <CardTitle className="text-5xl font-extrabold text-gray-900 mb-1">
                  {currentPlan.price}
                </CardTitle>
                <div className="text-lg text-gray-500 mb-6">
                  {currentPlan.signatureRange} {t('pricing.page.signatures')}
                </div>

                <Button
                  size="lg"
                  className={`${colors.button} text-white font-bold px-10 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]`}
                  asChild
                >
                  <Link href="/petitions/create">
                    {currentPlan.price.startsWith('0')
                      ? t('pricing.page.getStartedFree')
                      : t('pricing.page.chooseThisPlan')}
                  </Link>
                </Button>
              </div>
            </CardHeader>

            {/* Content Section - Organized Feature Rows */}
            <CardContent className="p-0">
              <div className="bg-white">
                {/* Section Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900">
                    {t('pricing.page.features')}
                  </h3>
                </div>

                {/* Main Features */}
                <div className="divide-y divide-gray-100">
                  {currentPlan.features.map((feature, index) => (
                    <FeatureRow
                      key={index}
                      title={feature}
                      isIncluded={true}
                      accentClass={colors.accent}
                    />
                  ))}
                </div>

                {/* Special Features Section */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {t('pricing.page.qrCode')} & {t('pricing.page.messaging')}
                  </h3>
                </div>

                {/* QR Code Feature */}
                <FeatureRow
                  icon={QrCode}
                  title={t('pricing.page.qrCode')}
                  description={
                    currentPlan.qrCode.note ||
                    (currentPlan.qrCode.included
                      ? t('pricing.page.includedWithPlan')
                      : t('pricing.page.notIncluded'))
                  }
                  isIncluded={currentPlan.qrCode.included}
                  accentClass={colors.accent}
                />

                {/* Messaging Feature */}
                <FeatureRow
                  icon={MessageSquare}
                  title={t('pricing.page.messaging')}
                  description={
                    currentPlan.messaging.details ||
                    (currentPlan.messaging.available
                      ? t('pricing.page.available')
                      : t('pricing.page.notAvailable'))
                  }
                  isIncluded={currentPlan.messaging.available}
                  accentClass={colors.accent}
                />
              </div>
            </CardContent>

            {/* Footer */}
            <div className="p-6 bg-gray-50 text-center border-t">
              <p className="text-gray-600 font-medium">
                {t('pricing.page.readyToStart')}{' '}
                <span className={colors.accent}>{currentPlan.name} </span> ؟
              </p>
            </div>
          </Card>
        </div>

        {/* Enterprise Contact Info Box */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/20 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-center">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  {t('pricing.enterprise.title', 'Expecting 100K+ signatures?')}
                </h3>
                <p className="text-red-800 dark:text-red-200 mb-4">
                  {t(
                    'pricing.enterprise.description',
                    'We offer custom enterprise plans with dedicated support, SLA guarantees, and volume pricing.',
                  )}
                </p>
                <Link href="/contact">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    {t('pricing.enterprise.cta', 'Contact Us')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
