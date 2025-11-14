'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PricingPlan {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
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
    emoji: '🟩',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
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
    emoji: '🟦',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
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
    emoji: '🟨',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
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
    emoji: '🟧',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
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
    emoji: '🟥',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
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

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('free');

  const currentPlan = pricingPlans.find(plan => plan.id === selectedPlan) || pricingPlans[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your petition. Start with our free plan and upgrade as your movement grows.
          </p>
        </div>

        {/* Plan Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {pricingPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? `${plan.bgColor} ${plan.color} ${plan.borderColor} border-2 shadow-md`
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{plan.emoji}</span>
                {plan.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Plan Details */}
        <div className="max-w-4xl mx-auto">
          <Card className={`${currentPlan.borderColor} border-2 shadow-lg`}>
            <CardHeader className={`${currentPlan.bgColor} rounded-t-lg`}>
              <div className="text-center">
                <div className="text-6xl mb-4">{currentPlan.emoji}</div>
                <CardTitle className={`text-3xl ${currentPlan.color} mb-2`}>
                  {currentPlan.name}
                </CardTitle>
                <div className="text-gray-600 mb-4">
                  <span className="text-lg font-medium">{currentPlan.signatureRange}</span> signatures
                </div>
                <div className={`text-5xl font-bold ${currentPlan.color} mb-4`}>
                  {currentPlan.price}
                </div>
                <Button 
                  size="lg" 
                  className={`${currentPlan.color.replace('text-', 'bg-')} hover:opacity-90 text-white px-8 py-3`}
                  asChild
                >
                  <Link href="/petitions/create">
                    {currentPlan.price === '0 MAD' ? 'Get Started Free' : 'Choose This Plan'}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Main Features */}
                <div className="md:col-span-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Main Features
                  </h3>
                  <ul className="space-y-3">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* QR Code */}
                <div className="md:col-span-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    QR Code
                  </h3>
                  <div className="flex items-start">
                    {currentPlan.qrCode.included ? (
                      <>
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700 font-medium">Included</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <span className="text-gray-700 font-medium">Not included</span>
                          {currentPlan.qrCode.note && (
                            <div className="text-sm text-gray-500 mt-1">
                              ({currentPlan.qrCode.note})
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Messaging */}
                <div className="md:col-span-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Messaging (to signees)
                  </h3>
                  <div className="flex items-start">
                    {currentPlan.messaging.available ? (
                      <>
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <span className="text-gray-700 font-medium">Available</span>
                          {currentPlan.messaging.details && (
                            <div className="text-sm text-gray-600 mt-1">
                              {currentPlan.messaging.details}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700 font-medium">Not available</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-600 mb-4">
                  Ready to start your petition with the {currentPlan.name}?
                </p>
                <Button 
                  size="lg" 
                  className={`${currentPlan.color.replace('text-', 'bg-')} hover:opacity-90 text-white px-12 py-3`}
                  asChild
                >
                  <Link href="/petitions/create">
                    Create Your Petition
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Compare All Plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Plan Name
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Signatures Range
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Price (MAD)
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    QR Code
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Messaging
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pricingPlans.map((plan, index) => (
                  <tr key={plan.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{plan.emoji}</span>
                        <span className={`font-semibold ${plan.color}`}>
                          {plan.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      {plan.signatureRange}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-lg ${plan.color}`}>
                        {plan.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {plan.qrCode.included ? (
                        <span className="text-green-600 font-medium">✅ Included</span>
                      ) : (
                        <span className="text-red-600 font-medium">❌ Not included</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {plan.messaging.available ? (
                        <span className="text-green-600 font-medium">✅ Available</span>
                      ) : (
                        <span className="text-red-600 font-medium">❌ Not available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        size="sm"
                        variant={selectedPlan === plan.id ? "default" : "outline"}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={selectedPlan === plan.id ? `${plan.color.replace('text-', 'bg-')} text-white` : ''}
                      >
                        {selectedPlan === plan.id ? 'Selected' : 'Select'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions?
          </h2>
          <p className="text-gray-600 mb-8">
            Need help choosing the right plan? We're here to help.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}