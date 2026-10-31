import { describe, it, expect } from 'vitest';
import { buildTrendBars, isCounted } from '../trendBars';

const TODAY = new Date('2026-10-31T12:00:00.000Z');

function makeOrder(daysAgo: number, revenue: number) {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return {
    id: `o-${daysAgo}-${revenue}`,
    status: 'paid' as const,
    total: revenue,
    createdAt: d.toISOString(),
    items: [],
  };
}

describe('isCounted', () => {
  it('returns true for paid', () => {
    expect(isCounted('paid')).toBe(true);
  });

  it('returns true for shipped', () => {
    expect(isCounted('shipped')).toBe(true);
  });

  it('returns false for pending', () => {
    expect(isCounted('pending')).toBe(false);
  });

  it('counts shipped orders as revenue in buildTrendBars', () => {
    const shippedOrder = {
      id: 'shipped-1',
      status: 'shipped' as const,
      total: 150,
      createdAt: new Date(TODAY).toISOString(),
      items: [],
    };
    const bars = buildTrendBars([shippedOrder], 'week', TODAY);
    expect(bars[bars.length - 1].revenue).toBe(150);
  });

  it('excludes pending orders from revenue in buildTrendBars', () => {
    const pendingOrder = {
      id: 'pending-1',
      status: 'pending' as const,
      total: 200,
      createdAt: new Date(TODAY).toISOString(),
      items: [],
    };
    const bars = buildTrendBars([pendingOrder], 'week', TODAY);
    expect(bars[bars.length - 1].revenue).toBe(0);
  });
});

describe('buildTrendBars — week', () => {
  it('produces exactly 7 bars', () => {
    expect(buildTrendBars([], 'week', TODAY)).toHaveLength(7);
  });

  it('all bars have 0 revenue when orders list is empty', () => {
    const bars = buildTrendBars([], 'week', TODAY);
    expect(bars.every((b) => b.revenue === 0)).toBe(true);
  });

  it('counts paid/shipped revenue in the correct day bar', () => {
    const orders = [makeOrder(0, 100), makeOrder(1, 200), makeOrder(6, 50)];
    const bars = buildTrendBars(orders, 'week', TODAY);
    const todayBar = bars[bars.length - 1];
    expect(todayBar.revenue).toBe(100);
    const yesterdayBar = bars[bars.length - 2];
    expect(yesterdayBar.revenue).toBe(200);
    const oldestBar = bars[0];
    expect(oldestBar.revenue).toBe(50);
  });

  it('excludes orders older than 7 days', () => {
    const orders = [makeOrder(8, 999)];
    const bars = buildTrendBars(orders, 'week', TODAY);
    expect(bars.every((b) => b.revenue === 0)).toBe(true);
  });
});

describe('buildTrendBars — month', () => {
  it('produces exactly 30 bars', () => {
    expect(buildTrendBars([], 'month', TODAY)).toHaveLength(30);
  });

  it('includes orders up to 29 days ago', () => {
    const orders = [makeOrder(29, 500)];
    const bars = buildTrendBars(orders, 'month', TODAY);
    expect(bars[0].revenue).toBe(500);
  });

  it('excludes orders 30 or more days ago', () => {
    const orders = [makeOrder(30, 999)];
    const bars = buildTrendBars(orders, 'month', TODAY);
    expect(bars.every((b) => b.revenue === 0)).toBe(true);
  });
});

describe('buildTrendBars — day', () => {
  it('produces exactly 24 bars', () => {
    expect(buildTrendBars([], 'day', TODAY)).toHaveLength(24);
  });

  it('counts revenue from today in the correct hour bar', () => {
    const hourOrder = {
      id: 'h1',
      status: 'paid' as const,
      total: 75,
      createdAt: new Date('2026-10-31T09:00:00.000Z').toISOString(),
      items: [],
    };
    const bars = buildTrendBars([hourOrder], 'day', TODAY);
    expect(bars[9].revenue).toBe(75);
  });
});
