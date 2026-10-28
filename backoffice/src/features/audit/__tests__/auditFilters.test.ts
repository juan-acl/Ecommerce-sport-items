import { describe, it, expect } from 'vitest';
import {
  setFilter,
  buildAuditQueryParams,
  hasActiveFilters,
  clearAllFilters,
} from '../utils/auditFilters';

describe('setFilter', () => {
  it('sets action filter', () => {
    expect(setFilter({}, 'action', 'ORDER_APPROVED').action).toBe('ORDER_APPROVED');
  });

  it('sets entityType filter', () => {
    expect(setFilter({}, 'entityType', 'order').entityType).toBe('order');
  });

  it('sets userEmail filter', () => {
    expect(setFilter({}, 'userEmail', 'admin@example.com').userEmail).toBe('admin@example.com');
  });

  it('sets fromDate filter', () => {
    expect(setFilter({}, 'fromDate', '2026-10-01').fromDate).toBe('2026-10-01');
  });

  it('sets toDate filter', () => {
    expect(setFilter({}, 'toDate', '2026-10-31').toDate).toBe('2026-10-31');
  });

  it('preserves existing filters when adding a new one', () => {
    const result = setFilter({ action: 'ORDER_APPROVED' }, 'entityType', 'order');
    expect(result.action).toBe('ORDER_APPROVED');
    expect(result.entityType).toBe('order');
  });

  it('clears a filter when value is undefined', () => {
    const result = setFilter({ action: 'ORDER_APPROVED' }, 'action', undefined);
    expect(result.action).toBeUndefined();
  });
});

describe('buildAuditQueryParams', () => {
  // Scenario: Selecting a single filter sends it to the API
  it('sends action filter to API', () => {
    const params = buildAuditQueryParams({ action: 'ORDER_APPROVED' }, { limit: 20 });
    expect(params.action).toBe('ORDER_APPROVED');
  });

  it('sends entityType filter to API', () => {
    const params = buildAuditQueryParams({ entityType: 'order' }, { limit: 20 });
    expect(params.entityType).toBe('order');
  });

  it('sends userEmail filter to API', () => {
    const params = buildAuditQueryParams({ userEmail: 'admin@example.com' }, { limit: 20 });
    expect(params.userEmail).toBe('admin@example.com');
  });

  // Scenario: Setting a date range sends fromDate and toDate to the API
  it('sends fromDate and toDate for a date range', () => {
    const params = buildAuditQueryParams({ fromDate: '2026-10-01', toDate: '2026-10-31' }, { limit: 20 });
    expect(params.fromDate).toBe('2026-10-01');
    expect(params.toDate).toBe('2026-10-31');
  });

  // Scenario: Combining filters sends all active params to the API
  it('sends all active filters combined', () => {
    const params = buildAuditQueryParams(
      { action: 'ORDER_APPROVED', entityType: 'order', fromDate: '2026-10-01', toDate: '2026-10-31' },
      { limit: 20 },
    );
    expect(params.action).toBe('ORDER_APPROVED');
    expect(params.entityType).toBe('order');
    expect(params.fromDate).toBe('2026-10-01');
    expect(params.toDate).toBe('2026-10-31');
  });

  // Scenario: Changing a filter resets pagination to the first page
  it('does not include cursor when cursor is undefined (filter changed)', () => {
    const params = buildAuditQueryParams({ action: 'PRODUCT_UPDATED' }, { limit: 20, cursor: undefined });
    expect(params).not.toHaveProperty('cursor');
  });

  it('includes cursor when cursor is provided (load more)', () => {
    const params = buildAuditQueryParams({}, { limit: 20, cursor: 'tok-abc' });
    expect(params.cursor).toBe('tok-abc');
  });

  // Scenario: Clearing all filters restores the unfiltered view
  it('sends no filter params when filters are empty', () => {
    const params = buildAuditQueryParams({}, { limit: 20 });
    expect(params).not.toHaveProperty('action');
    expect(params).not.toHaveProperty('entityType');
    expect(params).not.toHaveProperty('userEmail');
    expect(params).not.toHaveProperty('fromDate');
    expect(params).not.toHaveProperty('toDate');
  });

  it('always includes limit in params', () => {
    expect(buildAuditQueryParams({}, { limit: 20 }).limit).toBe(20);
    expect(buildAuditQueryParams({ action: 'X' }, { limit: 50 }).limit).toBe(50);
  });
});

describe('hasActiveFilters', () => {
  it('returns false when no filters are set', () => {
    expect(hasActiveFilters({})).toBe(false);
  });

  it('returns true when action is set', () => {
    expect(hasActiveFilters({ action: 'ORDER_APPROVED' })).toBe(true);
  });

  it('returns true when any filter is set', () => {
    expect(hasActiveFilters({ userEmail: 'admin@example.com' })).toBe(true);
  });

  it('returns false when all values are empty strings', () => {
    expect(hasActiveFilters({ action: '', entityType: '' })).toBe(false);
  });
});

describe('clearAllFilters', () => {
  it('returns an empty filters object', () => {
    expect(clearAllFilters()).toEqual({});
  });

  it('clears all active filters so hasActiveFilters returns false', () => {
    const cleared = clearAllFilters();
    expect(hasActiveFilters(cleared)).toBe(false);
  });
});
