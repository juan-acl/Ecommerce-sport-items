import type { AuditFilters } from './auditFilters';

export type { AuditFilters };

export interface AuditFilterState {
  pendingFilters: AuditFilters;
  activeFilters: AuditFilters;
  cursor?: string;
}

export function initialAuditFilterState(): AuditFilterState {
  return { pendingFilters: {}, activeFilters: {} };
}

export function setPendingFilter(
  state: AuditFilterState,
  key: keyof AuditFilters,
  value: string | undefined,
): AuditFilterState {
  const updated = { ...state.pendingFilters, [key]: value };
  if (value === undefined) delete updated[key];
  return { ...state, pendingFilters: updated };
}

export function setPendingDateRange(
  state: AuditFilterState,
  fromDate: string,
  toDate: string,
): AuditFilterState {
  const pendingFilters = { ...state.pendingFilters };
  if (fromDate) {
    pendingFilters.fromDate = fromDate;
  } else {
    delete pendingFilters.fromDate;
  }
  if (toDate) {
    pendingFilters.toDate = toDate;
  } else {
    delete pendingFilters.toDate;
  }
  return { ...state, pendingFilters };
}

export function submitSearch(state: AuditFilterState): AuditFilterState {
  return { pendingFilters: { ...state.pendingFilters }, activeFilters: { ...state.pendingFilters }, cursor: undefined };
}

export function clearAndSearch(state: AuditFilterState): AuditFilterState {
  void state;
  return { pendingFilters: {}, activeFilters: {}, cursor: undefined };
}

export function loadMore(state: AuditFilterState, cursor: string): AuditFilterState {
  return { ...state, cursor };
}
