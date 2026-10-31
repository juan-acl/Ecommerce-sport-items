import { describe, it, expect } from 'vitest';
import { computeStockDistribution } from '../utils/stockDistribution';
import type { InventoryReport } from '@shared/types/common';

function makeReport(overrides: Partial<InventoryReport> = {}): InventoryReport {
  return {
    totalProducts: 10,
    totalStockValue: 5000,
    lowStockProducts: [],
    recentMovements: [],
    ...overrides,
  };
}

describe('computeStockDistribution', () => {
  it('all in stock when no low-stock products', () => {
    const dist = computeStockDistribution(makeReport({ totalProducts: 10, lowStockProducts: [] }));
    expect(dist.inStock).toBe(10);
    expect(dist.lowStock).toBe(0);
    expect(dist.outOfStock).toBe(0);
  });

  it('counts isCritical entries as outOfStock', () => {
    const report = makeReport({
      totalProducts: 5,
      lowStockProducts: [
        { id: 'p1', name: 'A', stock: 0, minStock: 5, isCritical: true },
        { id: 'p2', name: 'B', stock: 0, minStock: 5, isCritical: true },
      ],
    });
    const dist = computeStockDistribution(report);
    expect(dist.outOfStock).toBe(2);
    expect(dist.lowStock).toBe(0);
    expect(dist.inStock).toBe(3);
  });

  it('counts non-critical entries as lowStock', () => {
    const report = makeReport({
      totalProducts: 5,
      lowStockProducts: [
        { id: 'p1', name: 'A', stock: 2, minStock: 5, isCritical: false },
      ],
    });
    const dist = computeStockDistribution(report);
    expect(dist.lowStock).toBe(1);
    expect(dist.outOfStock).toBe(0);
    expect(dist.inStock).toBe(4);
  });

  it('total always equals totalProducts', () => {
    const report = makeReport({
      totalProducts: 8,
      lowStockProducts: [
        { id: 'p1', name: 'A', stock: 0, minStock: 5, isCritical: true },
        { id: 'p2', name: 'B', stock: 2, minStock: 5, isCritical: false },
        { id: 'p3', name: 'C', stock: 1, minStock: 5, isCritical: false },
      ],
    });
    const dist = computeStockDistribution(report);
    expect(dist.inStock + dist.lowStock + dist.outOfStock).toBe(8);
  });
});
