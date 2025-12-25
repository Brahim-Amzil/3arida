'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/HeaderWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

function PetitionSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [petitionId, setPetitionId] = useState<string | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPetitionId(searchParams?.get('id'));
    const paymentParam = searchParams?.get('payment') === 'true';
    const paymentId = searchParams?.get('paymentId');

    // If paymentId exists, payment was completed successfully
    if (paymentId) {
      setPaymentCompleted(true);
      setNeedsPayment(false);
    } else {
      // If payment=true but no paymentId, payment is still needed
      setNeedsPayment(paymentParam);
      setPaymentCompleted(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!mounted) return;

    if (!petitionId) {
      router.push('/petitions');
      return;
    }

    // No automatic redirect - user must click buttons manually
  }, [petitionId, mounted, router]);

  const handleViewNow = () => {
    if (needsPayment && !paymentCompleted) {
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
              {paymentCompleted
                ? t('success.paymentSuccessful')
                : needsPayment
                  ? t('success.petitionCreated')
                  : t('success.petitionPublished')}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div>
              <p className=" text-lg text-gray-600 mb-4">
                {paymentCompleted
                  ? t('success.paymentSuccessMessage')
                  : needsPayment
                    ? t('success.needsPaymentMessage')
                    : t('success.publishedMessage')}
              </p>
            </div>
            <br />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleViewNow}
                className=" text-base bg-green-600 hover:bg-green-700"
              >
                {needsPayment
                  ? t('success.completePayment')
                  : t('success.viewPetition')}
              </Button>

              <Button
                variant="outline"
                onClick={handleBrowsePetitions}
                className=" text-base bg-gray-200 hover:bg-gray-300"
              >
                {t('success.browsePetitions')}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-2 text-right">
                {t('success.whatsNext')}
              </h3>
              <ul className="text-base text-gray-600 space-y-1 text-right">
                {paymentCompleted ? (
                  <>
                    <li>{t('success.petitionUnderReview')}</li>
                    <li>{t('success.approvalTimeframe')}</li>
                    <li>{t('success.notificationOnApproval')}</li>
                    <li>{t('success.shareWithFriends')}</li>
                    <li>{t('success.promoteOnSocial')}</li>
                  </>
                ) : needsPayment ? (
                  <>
                    <li>{t('success.completePaymentStep')}</li>
                    <li>{t('success.shareWithFriends')}</li>
                    <li>{t('success.monitorSignatures')}</li>
                  </>
                ) : (
                  <>
                    <li>{t('success.petitionUnderReview')}</li>
                    <li>{t('success.approvalTimeframe')}</li>
                    <li>{t('success.notificationOnApproval')}</li>
                    <li>{t('success.shareWithFriends')}</li>
                    <li>{t('success.promoteOnSocial')}</li>
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
export default function PetitionSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PetitionSuccessPageContent />
    </Suspense>
  );
}
