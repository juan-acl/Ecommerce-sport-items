export interface TrendBar {
  label: string;
  revenue: number;
  orders: number;
}

interface OrderSlice {
  status: string;
  total: number;
  createdAt: string;
}

function isCounted(status: string): boolean {
  return status === 'paid' || status === 'shipped';
}

export function buildTrendBars(
  orders: OrderSlice[],
  period: 'day' | 'week' | 'month',
  now: Date = new Date(),
): TrendBar[] {
  if (period === 'day') {
    return Array.from({ length: 24 }, (_, h) => {
      const dayOrders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getUTCFullYear() === now.getUTCFullYear() &&
          d.getUTCMonth() === now.getUTCMonth() &&
          d.getUTCDate() === now.getUTCDate() &&
          d.getUTCHours() === h
        );
      });
      return {
        label: `${String(h).padStart(2, '0')}h`,
        revenue: dayOrders.filter((o) => isCounted(o.status)).reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      };
    });
  }

  const barCount = period === 'week' ? 7 : 30;
  return Array.from({ length: barCount }, (_, i) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - (barCount - 1 - i));
    const date = d.toISOString().split('T')[0];
    const dayOrders = orders.filter((o) => o.createdAt.startsWith(date));
    return {
      label: d.toLocaleDateString('es-GT', { weekday: 'short', timeZone: 'UTC' }),
      revenue: dayOrders.filter((o) => isCounted(o.status)).reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    };
  });
}
