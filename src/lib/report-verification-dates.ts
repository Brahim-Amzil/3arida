export function coerceFirestoreDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object') {
    const record = value as {
      toDate?: () => Date;
      _seconds?: number;
      seconds?: number;
    };
    if (typeof record.toDate === 'function') {
      const parsed = record.toDate();
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const seconds = record._seconds ?? record.seconds;
    if (typeof seconds === 'number') {
      return new Date(seconds * 1000);
    }
  }
  return null;
}

export function formatReportDate(value: unknown): string {
  const date = coerceFirestoreDate(value);
  if (!date) {
    return '—';
  }
  return date.toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
