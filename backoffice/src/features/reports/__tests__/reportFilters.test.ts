import { describe, it, expect } from 'vitest';
import {
  filterMovementsByType,
  filterLowStockByName,
  filterOrdersByStatus,
} from '../utils/reportFilters';

const MOVEMENTS = [
  { id: '1', productName: 'Tenis Nike', type: 'purchase' as const, quantity: 10, createdAt: '2026-01-01' },
  { id: '2', productName: 'Balón Adidas', type: 'sale' as const, quantity: 2, createdAt: '2026-01-02' },
  { id: '3', productName: 'Guantes Box', type: 'return' as const, quantity: 1, createdAt: '2026-01-03' },
  { id: '4', productName: 'Camiseta Running', type: 'adjustment' as const, quantity: 5, createdAt: '2026-01-04' },
];

const LOW_STOCK = [
  { id: 'p1', name: 'Tenis Nike Air', stock: 2, minStock: 10 },
  { id: 'p2', name: 'Balón Fútbol', stock: 1, minStock: 5 },
  { id: 'p3', name: 'Casco Ciclismo', stock: 0, minStock: 3 },
];

describe('filterMovementsByType', () => {
  it('returns all movements when type is "all"', () => {
    expect(filterMovementsByType(MOVEMENTS, 'all')).toHaveLength(4);
  });

  it('filters to only purchase movements', () => {
    const result = filterMovementsByType(MOVEMENTS, 'purchase');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('purchase');
  });

  it('filters to only sale movements', () => {
    const result = filterMovementsByType(MOVEMENTS, 'sale');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('sale');
  });

  it('filters to only return movements', () => {
    const result = filterMovementsByType(MOVEMENTS, 'return');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('return');
  });

  it('filters to only adjustment movements', () => {
    const result = filterMovementsByType(MOVEMENTS, 'adjustment');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('adjustment');
  });

  it('returns empty array when no movements match the type', () => {
    expect(filterMovementsByType([], 'purchase')).toHaveLength(0);
  });
});

describe('filterLowStockByName', () => {
  it('returns all products when search is empty', () => {
    expect(filterLowStockByName(LOW_STOCK, '')).toHaveLength(3);
  });

  it('filters by exact name (case-insensitive)', () => {
    const result = filterLowStockByName(LOW_STOCK, 'tenis');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tenis Nike Air');
  });

  it('filters by partial name', () => {
    const result = filterLowStockByName(LOW_STOCK, 'ón');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Balón Fútbol');
  });

  it('is case-insensitive', () => {
    expect(filterLowStockByName(LOW_STOCK, 'CASCO')).toHaveLength(1);
    expect(filterLowStockByName(LOW_STOCK, 'casco')).toHaveLength(1);
  });

  it('returns empty array when no products match', () => {
    expect(filterLowStockByName(LOW_STOCK, 'xyz')).toHaveLength(0);
  });

  it('trims whitespace from search term', () => {
    expect(filterLowStockByName(LOW_STOCK, '  tenis  ')).toHaveLength(1);
  });
});

describe('filterOrdersByStatus', () => {
  const orders = { paid: 5, processing: 3, shipped: 2, delivered: 10, cancelled: 1 };

  it('returns all entries when filter is "all"', () => {
    expect(Object.keys(filterOrdersByStatus(orders, 'all'))).toHaveLength(5);
  });

  it('returns only the matching status when a specific status is given', () => {
    const result = filterOrdersByStatus(orders, 'paid');
    expect(Object.keys(result)).toHaveLength(1);
    expect(result.paid).toBe(5);
  });

  it('returns empty object when status does not exist', () => {
    expect(Object.keys(filterOrdersByStatus(orders, 'refunded'))).toHaveLength(0);
  });

  it('returns correct count for each known status', () => {
    expect(filterOrdersByStatus(orders, 'cancelled').cancelled).toBe(1);
    expect(filterOrdersByStatus(orders, 'shipped').shipped).toBe(2);
  });
});
