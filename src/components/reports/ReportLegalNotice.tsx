import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { REPORT_LEGAL_NOTICE_ITEMS } from '@/lib/report-legal-notice-items';

interface ReportLegalNoticeProps {
  className?: string;
}

export function ReportLegalNotice({ className }: ReportLegalNoticeProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-950',
        className,
      )}
    >
      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <p className="font-semibold text-red-900">إشعار قانوني</p>
      </div>
      <ul className="list-disc list-inside space-y-2 pr-1 text-red-900/90">
        {REPORT_LEGAL_NOTICE_ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
