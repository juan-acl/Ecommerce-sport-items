import { describe, it, expect } from 'vitest';
import { buildAuditParams } from '../utils/auditApiParams';

describe('buildAuditParams', () => {
  // Scenario: Each filter maps to the correct query parameter name
  it('maps action filter to action param', () => {
    expect(buildAuditParams({ action: 'ORDER_APPROVED' }).action).toBe('ORDER_APPROVED');
  });

  it('maps userId filter to userId param', () => {
    expect(buildAuditParams({ userId: 'user-123' }).userId).toBe('user-123');
  });

  it('maps userEmail filter to userEmail param', () => {
    expect(buildAuditParams({ userEmail: 'admin@example.com' }).userEmail).toBe('admin@example.com');
  });

  it('maps entityType filter to entityType param', () => {
    expect(buildAuditParams({ entityType: 'order' }).entityType).toBe('order');
  });

  it('maps fromDate filter to fromDate param', () => {
    expect(buildAuditParams({ fromDate: '2026-10-01' }).fromDate).toBe('2026-10-01');
  });

  it('maps toDate filter to toDate param', () => {
    expect(buildAuditParams({ toDate: '2026-10-31' }).toDate).toBe('2026-10-31');
  });

  // Scenario: Undefined filters are omitted from the request
  it('omits action when undefined', () => {
    expect(buildAuditParams({})).not.toHaveProperty('action');
  });

  it('omits userId when undefined', () => {
    expect(buildAuditParams({})).not.toHaveProperty('userId');
  });

  it('omits userEmail when undefined', () => {
    expect(buildAuditParams({})).not.toHaveProperty('userEmail');
  });

  it('omits entityType when undefined', () => {
    expect(buildAuditParams({})).not.toHaveProperty('entityType');
  });

  it('omits fromDate when undefined', () => {
    expect(buildAuditParams({})).not.toHaveProperty('fromDate');
  });

  it('omits toDate when undefined', () => {
    expect(buildAuditParams({})).not.toHaveProperty('toDate');
  });

  // Scenario: Changing any filter clears the cursor
  it('does not include cursor when no cursor is provided', () => {
    expect(buildAuditParams({ action: 'ORDER_APPROVED' })).not.toHaveProperty('cursor');
  });

  it('always includes limit defaulting to 20', () => {
    expect(buildAuditParams({}).limit).toBe(20);
  });
});
