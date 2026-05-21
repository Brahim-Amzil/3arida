import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const REPORT_LEGAL_NOTICE_ITEMS = [
  'أنتم الآن على صفحة التحقّق الخاصة بالتقرير المُسلَّم إليكم بنسخته الورقية.',
  'جميع التوقيعات الواردة في هذه العريضة تم التحقّق من صحتها عبر المنصّة.',
  'لكي تُعتبر النسخة الورقية المُسلَّمة إليكم أصلية وصحيحة ومعتمدة، يجب أن تكون بياناتها مطابقةً تماماً للبيانات المعروضة في صفحة التحقّق هذه، وأي اختلاف بينها وبين ما هو معروض يُعدّ تزويراً أو تحريفاً.',
  'أي اختلاف أو تعديل أو تغيير في محتوى النسخة الورقية المُسلَّمة إليكم يُعتبر تزويراً مُعاقباً عليه قانونياً.',
  'يتحمّل مُنشئ العريضة كامل المسؤولية القانونية عن أي نسخة ورقية أو رقمية مُسلَّمة إلى أي جهة رسمية أو غير رسمية وتتضمّن بيانات مغايرة لما هو معروض في صفحة التحقّق.',
] as const;

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
