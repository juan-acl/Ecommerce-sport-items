export type ReportPeriod = 'day' | 'week' | 'month';

export function getDateRange(input: {
  period?: ReportPeriod;
  from?: string;
  to?: string;
}): { start: Date; end: Date } {
  if (input.from && input.to) {
    return {
      start: new Date(input.from + 'T00:00:00.000Z'),
      end: new Date(input.to + 'T23:59:59.999Z'),
    };
  }
  const now = new Date();
  const start = new Date(now);
  const period = input.period ?? 'month';
  if (period === 'day') {
    start.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
}
