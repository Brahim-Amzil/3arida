'use client';

/**
 * Shown when a free-tier petition has used its 4 free report downloads.
 * Creator chooses: pay 19 MAD for one download, or upgrade for better quota.
 */

import { ArrowUpCircle, CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FREE_EXTRA_DOWNLOAD_PRICE_MAD } from '@/lib/report-access-control';

interface ReportDownloadLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: () => void;
  onUpgrade: () => void;
}

const UPGRADE_PERKS = [
  '10 تحميلات مجانية لكل عريضة (بدلاً من 4)',
  '10 درهم فقط لكل تحميل إضافي (بدلاً من 19)',
  'مزايا الخطة المدفوعة: QR، إحصائيات، ودعم التقديم الرسمي',
];

export function ReportDownloadLimitModal({
  isOpen,
  onClose,
  onPay,
  onUpgrade,
}: ReportDownloadLimitModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-limit-title"
        className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        dir="rtl"
      >
        <div className="mb-4 space-y-2">
          <h2 id="report-limit-title" className="text-lg font-semibold">
            انتهت التحميلات المجانية
          </h2>
          <p className="text-sm text-muted-foreground">
            استخدمت 4 تحميلات مجانية لهذه العريضة. اختر أحد الخيارين للمتابعة.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <p className="font-medium">الخيار 1 — تحميل واحد</p>
            <p className="text-2xl font-bold">{FREE_EXTRA_DOWNLOAD_PRICE_MAD} درهم</p>
            <p className="text-sm text-muted-foreground">
              دفع لمرة واحدة لتنزيل تقرير PDF إضافي لهذه العريضة.
            </p>
            <Button onClick={onPay} className="w-full gap-2">
              <CreditCard className="h-4 w-4" />
              دفع {FREE_EXTRA_DOWNLOAD_PRICE_MAD} درهم وتحميل
            </Button>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
            <p className="font-medium flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-primary" />
              الخيار 2 — ترقية الخطة (موصى به)
            </p>
            <ul className="space-y-2">
              {UPGRADE_PERKS.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Button onClick={onUpgrade} variant="default" className="w-full">
              ترقية العريضة
            </Button>
          </div>

          <Button onClick={onClose} variant="ghost" className="w-full">
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
}
