'use client';

/**
 * Report Download Button Component
 *
 * Displays a button to download petition reports with:
 * - Tier-based free download quotas
 * - Badge showing remaining free / paid price
 * - Limit-choice modal (free tier) or payment modal (paid tier)
 */

import { useEffect, useState } from 'react';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { Petition } from '@/types/petition';
import { getButtonState } from '@/lib/report-access-control';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReportDownloadButtonProps {
  petition: Petition;
  userId: string;
  onUpgrade?: () => void;
  onPayment?: () => void;
  onLimitChoice?: () => void;
  onDownloadComplete?: (newDownloadCount: number) => void;
}

export function ReportDownloadButton({
  petition,
  userId,
  onUpgrade,
  onPayment,
  onLimitChoice,
  onDownloadComplete,
}: ReportDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [reportDownloads, setReportDownloads] = useState(
    petition.reportDownloads || 0,
  );

  useEffect(() => {
    setReportDownloads(petition.reportDownloads || 0);
  }, [petition.id, petition.reportDownloads]);

  const petitionWithCount = { ...petition, reportDownloads };
  const buttonState = getButtonState(petitionWithCount);

  const handleClick = async () => {
    setError('');

    if (buttonState.onClick === 'limit_choice') {
      onLimitChoice?.();
      return;
    }

    if (buttonState.onClick === 'payment') {
      onPayment?.();
      return;
    }

    if (buttonState.onClick === 'upgrade') {
      onUpgrade?.();
      return;
    }

    setIsGenerating(true);
    setProgress('جاري إنشاء التقرير...');

    try {
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
          if (petition.pricingTier === 'free') {
            onLimitChoice?.();
          } else {
            onPayment?.();
          }
          return;
        }

        if (data.requiresUpgrade) {
          onUpgrade?.();
          return;
        }

        throw new Error(data.error?.message || 'فشل إنشاء التقرير');
      }

      setProgress('جاري تحميل التقرير...');
      const downloadResponse = await fetch(data.downloadUrl, {
        headers: {
          'x-user-id': userId,
        },
      });

      if (!downloadResponse.ok) {
        const errData = await downloadResponse.json().catch(() => null);
        if (errData?.requiresPayment) {
          if (petition.pricingTier === 'free') {
            onLimitChoice?.();
          } else {
            onPayment?.();
          }
          return;
        }
        const detail =
          errData?.error?.details || errData?.error?.message || 'فشل تحميل التقرير';
        throw new Error(detail);
      }

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

      const countHeader = downloadResponse.headers.get('X-Report-Download-Count');
      const newCount = countHeader
        ? Number.parseInt(countHeader, 10)
        : reportDownloads + 1;
      if (Number.isFinite(newCount)) {
        setReportDownloads(newCount);
        onDownloadComplete?.(newCount);
      }

      setProgress('تم التحميل بنجاح!');
      setTimeout(() => setProgress(''), 2000);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError(
        'فشل إنشاء التقرير: ' +
          (err instanceof Error ? err.message : 'خطأ في الشبكة'),
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
        return 'default';
      case 'paid':
        return 'secondary';
      case 'choice':
        return 'outline';
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
        disabled={isGenerating || buttonState.disabled}
        variant={buttonState.disabled ? 'outline' : 'default'}
        className="gap-2 w-full"
        size="sm"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isGenerating ? 'جاري الإنشاء...' : 'تحميل التقرير'}
        <Badge variant={getBadgeVariant()} className="ml-2">
          {buttonState.badgeText}
        </Badge>
      </Button>

      {error && (
        <div className="flex items-start gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isGenerating && progress && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{progress}</span>
        </div>
      )}
    </div>
  );
}
