'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/HeaderWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PetitionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [petitionId, setPetitionId] = useState<string | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPetitionId(searchParams?.get('id'));
    setNeedsPayment(searchParams?.get('payment') === 'true');
  }, [searchParams]);

  useEffect(() => {
    if (!mounted) return;

    if (!petitionId) {
      router.push('/petitions');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect after countdown
          if (needsPayment) {
            router.push(`/petitions/${petitionId}/payment`);
          } else {
            router.push(`/petitions/${petitionId}`);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [petitionId, needsPayment, router]);

  const handleViewNow = () => {
    if (needsPayment) {
      router.push(`/petitions/${petitionId}/payment`);
    } else {
      router.push(`/petitions/${petitionId}`);
    }
  };

  const handleBrowsePetitions = () => {
    router.push('/petitions');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">
              {needsPayment ? 'Petition Created!' : 'Petition Published!'}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-gray-600 mb-4">
                {needsPayment
                  ? 'Your petition has been created successfully. Complete the payment to publish it and start collecting signatures.'
                  : 'Your petition has been published successfully and is now live! People can start signing it right away.'}
              </p>

              {countdown > 0 && (
                <p className="text-sm text-gray-500">
                  {needsPayment
                    ? `Redirecting to payment in ${countdown} seconds...`
                    : `Redirecting to your petition in ${countdown} seconds...`}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleViewNow}
                className="bg-green-600 hover:bg-green-700"
              >
                {needsPayment ? 'Complete Payment' : 'View Petition'}
              </Button>

              <Button variant="outline" onClick={handleBrowsePetitions}>
                Browse Petitions
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {needsPayment ? (
                  <>
                    <li>• Complete the payment to publish your petition</li>
                    <li>• Share your petition with friends and family</li>
                    <li>• Monitor signatures and engagement</li>
                  </>
                ) : (
                  <>
                    <li>• Share your petition with friends and family</li>
                    <li>• Promote it on social media</li>
                    <li>• Monitor signatures and engagement</li>
                    <li>• Respond to comments and supporters</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
