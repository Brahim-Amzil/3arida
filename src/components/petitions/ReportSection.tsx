'use client';

/**
 * Report Section Component
 *
 * Complete integration example showing how to use report components
 * Can be added to petition management dashboard
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Petition } from '@/types/petition';
import { PricingTier } from '@/types/petition';
import { ReportDownloadButton } from './ReportDownloadButton';
import { ReportPaymentModal } from './ReportPaymentModal';
import { PetitionUpgradeModal } from './PetitionUpgradeModal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ReportSectionProps {
  petition: Petition;
  userId: string;
}

export function ReportSection({ petition, userId }: ReportSectionProps) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handlePaymentSuccess = () => {
    // Refresh petition data or trigger download
    window.location.reload();
  };

  const handleTierSelect = async (
    selectedTier: PricingTier,
    upgradePrice: number,
  ) => {
    try {
      setIsUpgrading(true);

      // Call upgrade API to create payment intent
      const response = await fetch('/api/petitions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petitionId: petition.id,
          currentTier: petition.pricingTier,
          selectedTier,
          userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Close modal
        setShowUpgradeModal(false);

        // If beta mode (amount is 0), just refresh to show updated tier
        if (data.amount === 0) {
          alert('تمت الترقية بنجاح! (وضع البيتا - مجاني)');
          // In production, the webhook would handle the upgrade
          // For now, just refresh
          window.location.reload();
        } else {
          // Redirect to payment page with client secret
          // You'll need to create a payment page that accepts clientSecret
          router.push(
            `/checkout?clientSecret=${data.clientSecret}&upgrade=true&petitionId=${petition.id}`,
          );
        }
      } else {
        throw new Error(data.error || 'فشلت الترقية');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert(
        'فشلت الترقية: ' +
          (error instanceof Error ? error.message : 'خطأ غير معروف'),
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تقرير العريضة
          </CardTitle>
          <CardDescription>
            إنشاء تقرير PDF رسمي لتقديمه إلى المعنيين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  التحميلات: {petition.reportDownloads || 0}
                </p>
                {petition.reportDownloadHistory &&
                  petition.reportDownloadHistory.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      آخر تحميل:{' '}
                      {new Date(
                        petition.reportDownloadHistory[
                          petition.reportDownloadHistory.length - 1
                        ].downloadedAt,
                      ).toLocaleDateString('ar-MA')}
                    </p>
                  )}
              </div>
              <ReportDownloadButton
                petition={petition}
                userId={userId}
                onUpgrade={() => setShowUpgradeModal(true)}
                onPayment={() => setShowPaymentModal(true)}
              />
            </div>

            <div className="text-xs text-muted-foreground border-t pt-3">
              <p>• تقرير PDF رسمي مع رمز QR للتحقق</p>
              <p>• يتضمن جميع الإحصائيات وتفاصيل العريضة</p>
              <p>• صالح للتقديم الرسمي</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ReportPaymentModal
        petition={petition}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />

      <PetitionUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        petitionId={petition.id}
        currentTier={petition.pricingTier}
        onTierSelect={handleTierSelect}
      />
    </>
  );
}
