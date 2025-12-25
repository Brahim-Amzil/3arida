'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PetitionPayment from '@/components/petitions/PetitionPayment';
import { PetitionFormData } from '@/types/petition';

export default function TestPetitionPaymentPage() {
  const [showPayment, setShowPayment] = useState(false);

  // Sample petition data for testing
  const sampleFormData: PetitionFormData = {
    publisherType: 'Individual',
    publisherName: 'فاطمة الزهراء بنعلي',
    officialDocument: undefined,
    petitionType: 'Change',
    addressedToType: 'Government',
    addressedToSpecific: 'وزارة التجهيز والنقل واللوجستيك والماء',
    title: 'عريضة لإصلاح البنية التحتية للطرق في حي النهضة',
    description:
      'نحن سكان حي النهضة نطالب بإصلاح عاجل للبنية التحتية للطرق في منطقتنا. الطرق في حالة سيئة جداً وتحتاج إلى تدخل فوري من أجل سلامة المواطنين.',
    category: 'Infrastructure',
    subcategory: 'Transportation',
    targetSignatures: 5000, // This should trigger payment (Basic tier - 49 MAD)
    mediaUrls: [],
    youtubeVideoUrl: '',
    tags: 'البنية التحتية, الطرق, النقل, حي النهضة',
    location: {
      country: 'Morocco',
      city: 'Casablanca',
    },
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('✅ Payment successful:', paymentIntentId);
    alert(`Payment successful! Payment ID: ${paymentIntentId}`);
    setShowPayment(false);
  };

  const handlePaymentCancel = () => {
    console.log('❌ Payment cancelled');
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PetitionPayment
              formData={sampleFormData}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test Petition Payment Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Test Petition Details
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>
                  <strong>Title:</strong> {sampleFormData.title}
                </div>
                <div>
                  <strong>Target Signatures:</strong>{' '}
                  {sampleFormData.targetSignatures?.toLocaleString()}
                </div>
                <div>
                  <strong>Category:</strong> {sampleFormData.category}
                </div>
                <div>
                  <strong>Location:</strong> {sampleFormData.location?.city},{' '}
                  {sampleFormData.location?.country}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                💳 Payment Test
              </h3>
              <p className="text-green-700 text-sm mb-4">
                This petition has 5,000 signatures target, which requires the
                Basic plan (49 MAD). Click the button below to test the payment
                flow.
              </p>
              <Button onClick={() => setShowPayment(true)} className="w-full">
                Test Payment Flow (49 MAD)
              </Button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                🧪 Test Card Details
              </h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>
                  <strong>Card Number:</strong> 4242 4242 4242 4242
                </div>
                <div>
                  <strong>Expiry:</strong> Any future date (e.g., 12/25)
                </div>
                <div>
                  <strong>CVC:</strong> Any 3 digits (e.g., 123)
                </div>
                <div>
                  <strong>Name:</strong> Any name
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                📋 Test Instructions
              </h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Click "Test Payment Flow" button above</li>
                <li>Payment modal should open with petition details</li>
                <li>Enter the test card details provided</li>
                <li>Click "Create Petition - 49.00 MAD" button</li>
                <li>Payment should process successfully</li>
                <li>Success message should appear</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
