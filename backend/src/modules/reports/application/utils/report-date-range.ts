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
    start.setUTCHours(0, 0, 0, 0);
  } else if (period === 'week') {
    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
    start.setUTCHours(0, 0, 0, 0);
  } else if (period === 'month') {
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
  } else {
    const _exhaustive: never = period;
    throw new Error(`Unknown period: ${_exhaustive}`);
  }
  return { start, end: now };
}
