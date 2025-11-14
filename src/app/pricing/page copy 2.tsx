'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, X, QrCode, MessageSquare } from 'lucide-react';

// Define the colors for subtle accents (Tailwind CSS classes)
const planColors: { [key: string]: { accent: string; button: string; hover: string } } = {
  free: {
    accent: 'text-green-500',
    button: 'bg-green-500 hover:bg-green-600',
    hover: 'hover:bg-green-50'
  },
  starter: {
    accent: 'text-blue-500',
    button: 'bg-blue-500 hover:bg-blue-600',
    hover: 'hover:bg-blue-50'
  },
  pro: {
    accent: 'text-yellow-500',
    button: 'bg-yellow-500 hover:bg-yellow-600',
    hover: 'hover:bg-yellow-50'
  },
  advanced: {
    accent: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600',
    hover: 'hover:bg-orange-50'
  },
  enterprise: {
    accent: 'text-red-500',
    button: 'bg-red-500 hover:bg-red-600',
    hover: 'hover:bg-red-50'
  }
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

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    signatureRange: 'Up to 2,500',
    price: '0 MAD',
    features: [
      'Create and publish petitions',
      'Basic sharing tools (email/social)',
      'Basic analytics (views, signatures)',
      'Public listing on platform'
    ],
    qrCode: {
      included: false,
      note: 'Optional add-on: 19 MAD'
    },
    messaging: {
      available: false
    }
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    signatureRange: 'Up to 10,000',
    price: '49 MAD',
    features: [
      'All Free features',
      'Custom cover image',
      'Enhanced social sharing',
      'Basic analytics dashboard',
      'Faster approval'
    ],
    qrCode: {
      included: true
    },
    messaging: {
      available: true,
      details: 'Messaging addon: 3 messages for 19 MAD'
    }
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    signatureRange: 'Up to 25,000',
    price: '99 MAD',
    features: [
      'All Starter features',
      'Regional targeting',
      'Petition branding (logo, colors)',
      'Priority visibility on homepage'
    ],
    qrCode: {
      included: true
    },
    messaging: {
      available: true,
      details: '3 free messages + addon: 3 messages for 19 MAD'
    }
  },
  {
    id: 'advanced',
    name: 'Advanced Plan',
    signatureRange: 'Up to 70,000',
    price: '199 MAD',
    features: [
      'All Pro features',
      'Advanced analytics (demographics, locations)',
      'Export signees data (CSV)',
      'Featured listing in category pages',
      'Email support'
    ],
    qrCode: {
      included: true
    },
    messaging: {
      available: true,
      details: '5 free messages + addon: 5 messages for 29 MAD'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    signatureRange: 'Up to 100,000',
    price: '499 MAD',
    features: [
      'All Advanced features',
      'API access',
      'Custom domain option',
      'Dedicated support team',
      'Organization verification badge',
      'Highest visibility on platform'
    ],
    qrCode: {
      included: true
    },
    messaging: {
      available: true,
      details: '50 free messages + addon: 10 messages for 29 MAD'
    }
  }
];

// Helper component for feature list items
const FeatureItem: React.FC<{ text: string; isIncluded?: boolean }> = ({ text, isIncluded = true }) => (
  <li className="flex items-start text-gray-700">
    {isIncluded ? (
      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
    ) : (
      <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
    )}
    <span>{text}</span>
  </li>
);

// Helper component for the secondary feature columns (QR Code and Messaging)
const SecondaryFeatureColumn: React.FC<{
  title: string;
  icon: React.ElementType;
  included: boolean;
  details?: string;
  accentClass: string;
}> = ({ title, icon: Icon, included, details, accentClass }) => (
  <div className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white">
    <div className={`flex items-center mb-3 ${accentClass}`}>
      <Icon className="w-5 h-5 mr-2" />
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="flex items-center mb-1">
      {included ? (
        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
      ) : (
        <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
      )}
      <span className="text-sm text-gray-700 font-medium">
        {included ? 'Available' : 'Not Available'}
      </span>
    </div>
    {details && <p className="text-xs text-gray-500 mt-2">{details}</p>}
  </div>
);

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('advanced'); // Default to a paid plan for better visibility

  const currentPlan = pricingPlans.find(plan => plan.id === selectedPlan) || pricingPlans[0];
  const colors = planColors[currentPlan.id];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your petition. Start with our free plan and upgrade as your movement grows.
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
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-none overflow-hidden">
            {/* Header Section with Subtle Gradient Accent */}
            <CardHeader className="p-8 bg-white border-b border-gray-100">
              <div className="flex flex-col items-center">
                <div className={`text-sm font-semibold uppercase tracking-wider mb-2 ${colors.accent}`}>
                  {currentPlan.name}
                </div>
                <CardTitle className="text-5xl font-extrabold text-gray-900 mb-1">
                  {currentPlan.price}
                </CardTitle>
                <div className="text-lg text-gray-500 mb-6">
                  {currentPlan.signatureRange} signatures
                </div>
                
                <Button 
                  size="lg" 
                  className={`${colors.button} text-white font-bold px-10 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]`}
                  asChild
                >
                  <Link href="/petitions/create">
                    {currentPlan.price === '0 MAD' ? 'Get Started Free' : 'Choose This Plan'}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            
            {/* Content Section */}
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Features Column */}
                <div className="md:col-span-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
                    Features
                  </h3>
                  <ul className="space-y-3">
                    {currentPlan.features.map((feature, index) => (
                      <FeatureItem key={index} text={feature} />
                    ))}
                  </ul>
                </div>

                {/* Secondary Features Columns */}
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    {/* QR Code */}
                    <SecondaryFeatureColumn
                      title="QR Code"
                      icon={QrCode}
                      included={currentPlan.qrCode.included}
                      details={currentPlan.qrCode.note || (currentPlan.qrCode.included ? 'Included with plan' : 'Not included')}
                      accentClass={colors.accent}
                    />

                    {/* Messaging */}
                    <SecondaryFeatureColumn
                      title="Messaging (to signees)"
                      icon={MessageSquare}
                      included={currentPlan.messaging.available}
                      details={currentPlan.messaging.details || (currentPlan.messaging.available ? 'Available' : 'Not available')}
                      accentClass={colors.accent}
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Footer */}
            <div className="p-6 bg-gray-50 text-center border-t">
              <p className="text-gray-600 font-medium">
                Ready to start your petition with the <span className={colors.accent}>{currentPlan.name}</span>?
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}