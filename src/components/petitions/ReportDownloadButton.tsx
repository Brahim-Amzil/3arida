'use client';

/**
 * Report Download Button Component
 *
 * Displays a button to download petition reports with:
 * - Different states based on tier and download count
 * - Badge showing free/paid/beta status
 * - Handles upgrade modal and payment modal
 * - Loading animation during generation
 */

import { useState } from 'react';
import { Download, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Petition } from '@/types/petition';
import { getButtonState } from '@/lib/report-access-control';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReportDownloadButtonProps {
  petition: Petition;
  userId: string;
  onUpgrade?: () => void;
  onPayment?: () => void;
}

export function ReportDownloadButton({
  petition,
  userId,
  onUpgrade,
  onPayment,
}: ReportDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const buttonState = getButtonState(petition);

  const handleClick = async () => {
    // Clear any previous error
    setError('');

    if (buttonState.onClick === 'upgrade') {
      // Show inline error message instead of modal
      setError('تحميل التقارير غير متاح للعرائض المجانية');
      return;
    }

    if (buttonState.onClick === 'payment') {
      onPayment?.();
      return;
    }

    // Generate and download
    setIsGenerating(true);
    setProgress('جاري إنشاء التقرير...');

    try {
      // Call generate API
      const response = await fetch(
        `/api/petitions/${petition.referenceCode || petition.id}/report/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        if (data.requiresPayment) {
          onPayment?.();
          return;
        }

        if (data.requiresUpgrade) {
          setError('تحميل التقارير غير متاح للعرائض المجانية');
          return;
        }

        throw new Error(data.error?.message || 'فشل إنشاء التقرير');
      }

      // Download the report
      setProgress('جاري تحميل التقرير...');
      const downloadResponse = await fetch(data.downloadUrl, {
        headers: {
          'x-user-id': userId,
        },
      });

      if (!downloadResponse.ok) {
        throw new Error('فشل تحميل التقرير');
      }

      // Create blob and download
      setProgress('جاري حفظ الملف...');
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `petition-report-${petition.referenceCode || petition.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setProgress('تم التحميل بنجاح!');
      setTimeout(() => setProgress(''), 2000);
    } catch (error) {
      console.error('Error downloading report:', error);
      setError(
        'فشل إنشاء التقرير: ' +
          (error instanceof Error ? error.message : 'خطأ في الشبكة'),
      );
      setProgress('');
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProgress('');
      }, 2000);
    }
  };

  const getBadgeVariant = () => {
    switch (buttonState.badge) {
      case 'free':
      case 'beta':
        return 'default';
      case 'paid':
        return 'secondary';
      case 'locked':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleClick}
        disabled={isGenerating}
        variant={buttonState.disabled ? 'outline' : 'default'}
        className="gap-2 w-full"
        size="sm"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : buttonState.disabled ? (
          <Lock className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isGenerating ? 'جاري الإنشاء...' : 'تحميل التقرير'}
        <Badge variant={getBadgeVariant()} className="ml-2">
          {buttonState.badgeText}
        </Badge>
      </Button>

      {/* Error message with upgrade button */}
      {error && (
        <div className="flex items-start gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 flex items-center justify-between gap-3">
            <span>{error}</span>
            {buttonState.onClick === 'upgrade' && onUpgrade && (
              <Button
                onClick={() => {
                  setError('');
                  onUpgrade();
                }}
                size="sm"
                variant="destructive"
                className="flex-shrink-0"
              >
                يجب الترقية
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {isGenerating && progress && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{progress}</span>
        </div>
      )}
    </div>
  );
}
