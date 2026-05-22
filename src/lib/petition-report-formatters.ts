import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { formatReportDate } from '@/lib/report-verification-dates';

export { formatReportDate };

export function formatPetitionLongDate(
  iso: string | null | undefined,
): string {
  if (!iso) return '—';
  return format(new Date(iso), 'dd MMMM yyyy', { locale: ar });
}

export function formatReportGeneratedAt(): string {
  return format(new Date(), 'dd MMMM yyyy - HH:mm', { locale: ar });
}

export function formatPetitionNumber(value: number): string {
  return value.toLocaleString('ar-MA');
}
