import { formatReportDate } from '../report-verification-dates';

describe('formatReportDate', () => {
  it('formats Firestore Timestamp-like objects', () => {
    const formatted = formatReportDate({
      _seconds: 1704067200,
      _nanoseconds: 0,
    });
    expect(formatted).not.toBe('—');
    expect(formatted).toMatch(/\d/);
  });

  it('formats ISO strings', () => {
    const formatted = formatReportDate('2024-01-01T00:00:00.000Z');
    expect(formatted).not.toBe('—');
  });

  it('returns em dash for invalid values', () => {
    expect(formatReportDate(null)).toBe('—');
    expect(formatReportDate({})).toBe('—');
  });
});
