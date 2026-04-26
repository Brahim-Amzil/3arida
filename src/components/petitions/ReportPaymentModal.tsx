'use client';

/**
 * Report Payment Modal Component
 *
 * Modal for purchasing additional report downloads (19 MAD)
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, Check } from 'lucide-react';
import { Petition } from '@/types/petition';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ReportPaymentModalProps {
  petition: Petition;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReportPaymentModal({
  petition,
  isOpen,
  onClose,
  onSuccess,
}: ReportPaymentModalProps) {
  const t = useTranslations('report.paymentModal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);

  const handlePayment = async (method: 'stripe' | 'paypal') => {
    setIsProcessing(true);
    setPaymentMethod(method);

    try {
      // TODO: Implement actual payment processing
      // For now, simulate payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(t('processing') + ' - ' + t('features.official'));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + (error instanceof Error ? error.message : 'Network error'));
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price */}
          <div className="text-center">
            <p className="text-3xl font-bold">19 MAD</p>
            <p className="text-sm text-muted-foreground">{t('price')}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <p className="font-semibold">{t('features.title')}</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('features.official')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('features.qr')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('features.stats')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">{t('features.valid')}</span>
              </li>
            </ul>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handlePayment('stripe')}
              disabled={isProcessing}
              className="w-full"
              variant="default"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isProcessing && paymentMethod === 'stripe' ? t('processing') : t('payStripe')}
            </Button>

            <Button
              onClick={() => handlePayment('paypal')}
              disabled={isProcessing}
              className="w-full"
              variant="outline"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {isProcessing && paymentMethod === 'paypal' ? t('processing') : t('payPayPal')}
            </Button>
          </div>

          {/* Cancel */}
          <Button onClick={onClose} variant="ghost" className="w-full" disabled={isProcessing}>
            {t('cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
