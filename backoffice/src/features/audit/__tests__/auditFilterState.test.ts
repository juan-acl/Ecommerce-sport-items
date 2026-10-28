import { describe, it, expect } from 'vitest';
import {
  initialAuditFilterState,
  setPendingFilter,
  setPendingDateRange,
  submitSearch,
  clearAndSearch,
  loadMore,
  type AuditFilterState,
} from '../utils/auditFilterState';

describe('initialAuditFilterState', () => {
  it('starts with empty pending and active filters and no cursor', () => {
    const s = initialAuditFilterState();
    expect(s.pendingFilters).toEqual({});
    expect(s.activeFilters).toEqual({});
    expect(s.cursor).toBeUndefined();
  });
});

describe('setPendingFilter', () => {
  // Scenario: Changing a filter value does not trigger a new API call
  it('updates pendingFilters but does not change activeFilters', () => {
    const s = initialAuditFilterState();
    const next = setPendingFilter(s, 'action', 'ORDER_APPROVED');
    expect(next.pendingFilters.action).toBe('ORDER_APPROVED');
    expect(next.activeFilters.action).toBeUndefined();
  });

  it('clears a filter when value is undefined', () => {
    const s: AuditFilterState = { ...initialAuditFilterState(), pendingFilters: { action: 'ORDER_APPROVED' } };
    const next = setPendingFilter(s, 'action', undefined);
    expect(next.pendingFilters.action).toBeUndefined();
  });

  it('does not reset cursor when pending filter changes', () => {
    const s: AuditFilterState = { ...initialAuditFilterState(), cursor: 'tok-123' };
    const next = setPendingFilter(s, 'action', 'ORDER_APPROVED');
    expect(next.cursor).toBe('tok-123');
  });
});

describe('setPendingDateRange', () => {
  // Scenario: Setting a date range does not trigger a new API call
  it('updates fromDate and toDate in pendingFilters but not activeFilters', () => {
    const s = initialAuditFilterState();
    const next = setPendingDateRange(s, '2026-10-01', '2026-10-31');
    expect(next.pendingFilters.fromDate).toBe('2026-10-01');
    expect(next.pendingFilters.toDate).toBe('2026-10-31');
    expect(next.activeFilters.fromDate).toBeUndefined();
    expect(next.activeFilters.toDate).toBeUndefined();
  });

  it('clears date fields when empty strings are provided', () => {
    const s: AuditFilterState = {
      ...initialAuditFilterState(),
      pendingFilters: { fromDate: '2026-10-01', toDate: '2026-10-31' },
    };
    const next = setPendingDateRange(s, '', '');
    expect(next.pendingFilters.fromDate).toBeUndefined();
    expect(next.pendingFilters.toDate).toBeUndefined();
  });
});

describe('submitSearch', () => {
  // Scenario: Clicking Buscar sends all active filters to the API
  it('copies pendingFilters to activeFilters', () => {
    const s: AuditFilterState = {
      ...initialAuditFilterState(),
      pendingFilters: { action: 'ORDER_APPROVED' },
    };
    const next = submitSearch(s);
    expect(next.activeFilters.action).toBe('ORDER_APPROVED');
  });

  // Scenario: Clicking Buscar resets pagination to the first page
  it('resets cursor to undefined', () => {
    const s: AuditFilterState = {
      ...initialAuditFilterState(),
      pendingFilters: { action: 'ORDER_APPROVED' },
      cursor: 'tok-page-2',
    };
    const next = submitSearch(s);
    expect(next.cursor).toBeUndefined();
  });

  it('submits combined filters when multiple are pending', () => {
    const s: AuditFilterState = {
      ...initialAuditFilterState(),
      pendingFilters: { action: 'ORDER_APPROVED', entityType: 'order', fromDate: '2026-10-01', toDate: '2026-10-31' },
    };
    const next = submitSearch(s);
    expect(next.activeFilters.action).toBe('ORDER_APPROVED');
    expect(next.activeFilters.entityType).toBe('order');
    expect(next.activeFilters.fromDate).toBe('2026-10-01');
    expect(next.activeFilters.toDate).toBe('2026-10-31');
  });

  it('submits date range when only dates are pending', () => {
    const s: AuditFilterState = {
      ...initialAuditFilterState(),
      pendingFilters: { fromDate: '2026-10-01', toDate: '2026-10-31' },
    };
    const next = submitSearch(s);
    expect(next.activeFilters.fromDate).toBe('2026-10-01');
    expect(next.activeFilters.toDate).toBe('2026-10-31');
  });
});

describe('clearAndSearch', () => {
  // Scenario: Clearing filters resets all values and immediately searches without filters
  it('clears both pendingFilters and activeFilters', () => {
    const s: AuditFilterState = {
      pendingFilters: { action: 'ORDER_APPROVED' },
      activeFilters: { action: 'ORDER_APPROVED' },
      cursor: 'tok-abc',
    };
    const next = clearAndSearch(s);
    expect(next.pendingFilters).toEqual({});
    expect(next.activeFilters).toEqual({});
  });

  it('resets cursor to undefined', () => {
    const s: AuditFilterState = {
      pendingFilters: { action: 'ORDER_APPROVED' },
      activeFilters: { action: 'ORDER_APPROVED' },
      cursor: 'tok-abc',
    };
    const next = clearAndSearch(s);
    expect(next.cursor).toBeUndefined();
  });
});

describe('loadMore', () => {
  it('sets the cursor for pagination', () => {
    const s = initialAuditFilterState();
    const next = loadMore(s, 'tok-next-page');
    expect(next.cursor).toBe('tok-next-page');
  });

  it('does not change active or pending filters', () => {
    const s: AuditFilterState = {
      ...initialAuditFilterState(),
      activeFilters: { action: 'ORDER_APPROVED' },
      pendingFilters: { action: 'ORDER_APPROVED' },
    };
    const next = loadMore(s, 'tok-next-page');
    expect(next.activeFilters.action).toBe('ORDER_APPROVED');
    expect(next.pendingFilters.action).toBe('ORDER_APPROVED');
  });
});
