'use client';

/**
 * PetitionCard with Report Button
 *
 * Wrapper around PetitionCard that adds report download functionality
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Petition, PricingTier } from '@/types/petition';
import PetitionCard from './PetitionCard';
import { ReportDownloadButton } from './ReportDownloadButton';
import { PetitionUpgradeModal } from './PetitionUpgradeModal';
import { UpgradePaymentModal } from './UpgradePaymentModal';
import { useAuth } from '@/components/auth/AuthProvider';

interface PetitionCardWithReportProps {
  petition: Petition;
  variant?: 'grid' | 'list';
  showProgress?: boolean;
  showCreator?: boolean;
  showActions?: boolean;
  className?: string;
}

export default function PetitionCardWithReport({
  petition,
  variant = 'grid',
  showProgress = true,
  showCreator = true,
  showActions = false,
  className = '',
}: PetitionCardWithReportProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    clientSecret?: string;
    selectedTier: PricingTier;
    upgradePrice: number;
    originalPrice?: number;
    betaMode?: boolean;
    couponCode?: string;
  } | null>(null);

  const handleUpgrade = () => {
    setShowUpgradeModal(true);
  };

  const handlePayment = () => {
    alert('Payment required: 19 MAD for additional report download');
    // TODO: Implement payment modal
  };

  const handleTierSelect = async (
    selectedTier: PricingTier,
    upgradePrice: number,
  ) => {
    try {
      // Call upgrade API to create payment intent
      const response = await fetch('/api/petitions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petitionId: petition.id,
          currentTier: petition.pricingTier,
          selectedTier,
          userId: user?.uid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowUpgradeModal(false);

        // Show payment modal with all the data including beta info
        setPaymentData({
          clientSecret: data.clientSecret,
          selectedTier,
          upgradePrice: data.upgradePrice,
          originalPrice: data.originalPrice,
          betaMode: data.betaMode,
          couponCode: data.couponCode,
        });
        setShowPaymentModal(true);
      } else {
        throw new Error(data.error || 'فشلت الترقية');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert(
        'فشلت الترقية: ' +
          (error instanceof Error ? error.message : 'خطأ غير معروف'),
      );
    }
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setPaymentData(null);
    
    // Wait a moment for Firestore to update
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Force a hard reload to clear all caches
    window.location.href = window.location.href;
  };

  return (
    <div className="relative">
      <PetitionCard
        petition={petition}
        variant={variant}
        showProgress={showProgress}
        showCreator={showCreator}
        showActions={showActions}
        className={className}
      />
      
      {/* Report Download Button - positioned absolutely or as overlay */}
      <div className="mt-4">
        <ReportDownloadButton
          petition={petition}
          userId={user?.uid ?? ''}
          onUpgrade={handleUpgrade}
          onPayment={handlePayment}
        />
      </div>

      <PetitionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        petitionId={petition.id}
        currentTier={petition.pricingTier}
        onTierSelect={handleTierSelect}
      />

      {paymentData && (
        <UpgradePaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentData(null);
          }}
          clientSecret={paymentData.clientSecret}
          selectedTier={paymentData.selectedTier}
          upgradePrice={paymentData.upgradePrice}
          originalPrice={paymentData.originalPrice}
          betaMode={paymentData.betaMode}
          couponCode={paymentData.couponCode}
          petitionId={petition.id}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
