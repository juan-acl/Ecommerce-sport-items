import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerAuditSteps } from '../steps/audit-advanced-search.steps';

describe("Audit Advanced Search", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerAuditSteps(rt);
  });

  it("Filter audit logs by action [action=ORDER_APPROVED]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_APPROVED"`);
    await rt.run(`the response contains only logs with action "ORDER_APPROVED"`);
  });

  it("Filter audit logs by action [action=ORDER_REJECTED]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_REJECTED"`);
    await rt.run(`the response contains only logs with action "ORDER_REJECTED"`);
  });

  it("Filter audit logs by action [action=ORDER_STATUS_CHANGED]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_STATUS_CHANGED"`);
    await rt.run(`the response contains only logs with action "ORDER_STATUS_CHANGED"`);
  });

  it("Filter audit logs by action [action=PRODUCT_UPDATED]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter action "PRODUCT_UPDATED"`);
    await rt.run(`the response contains only logs with action "PRODUCT_UPDATED"`);
  });

  it("Filter audit logs by userId [userId=user-1]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter userId "user-1"`);
    await rt.run(`the response contains only logs with userId "user-1"`);
  });

  it("Filter audit logs by userId [userId=user-2]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter userId "user-2"`);
    await rt.run(`the response contains only logs with userId "user-2"`);
  });

  it("Filter audit logs by userId [userId=user-3]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter userId "user-3"`);
    await rt.run(`the response contains only logs with userId "user-3"`);
  });

  it("Filter audit logs by date range [from=2026-10-01T00:00:00Z, to=2026-10-01T23:59:59Z]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs from "2026-10-01T00:00:00Z" to "2026-10-01T23:59:59Z"`);
    await rt.run(`the response contains only logs created between "2026-10-01T00:00:00Z" and "2026-10-01T23:59:59Z"`);
  });

  it("Filter audit logs by date range [from=2026-10-02T00:00:00Z, to=2026-10-02T23:59:59Z]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs from "2026-10-02T00:00:00Z" to "2026-10-02T23:59:59Z"`);
    await rt.run(`the response contains only logs created between "2026-10-02T00:00:00Z" and "2026-10-02T23:59:59Z"`);
  });

  it("Filter audit logs by date range [from=2026-10-01T00:00:00Z, to=2026-10-03T23:59:59Z]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs from "2026-10-01T00:00:00Z" to "2026-10-03T23:59:59Z"`);
    await rt.run(`the response contains only logs created between "2026-10-01T00:00:00Z" and "2026-10-03T23:59:59Z"`);
  });

  it("Filter audit logs by action and date range combined [action=ORDER_STATUS_CHANGED, from=2026-10-02T00:00:00Z, to=2026-10-03T23:59:59Z]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_STATUS_CHANGED" from "2026-10-02T00:00:00Z" to "2026-10-03T23:59:59Z"`);
    await rt.run(`the response contains only logs with action "ORDER_STATUS_CHANGED" created between "2026-10-02T00:00:00Z" and "2026-10-03T23:59:59Z"`);
  });

  it("Filter audit logs by action and date range combined [action=ORDER_APPROVED, from=2026-10-01T00:00:00Z, to=2026-10-01T23:59:59Z]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_APPROVED" from "2026-10-01T00:00:00Z" to "2026-10-01T23:59:59Z"`);
    await rt.run(`the response contains only logs with action "ORDER_APPROVED" created between "2026-10-01T00:00:00Z" and "2026-10-01T23:59:59Z"`);
  });

  it("No audit logs match the filter returns empty list", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter action "NONEXISTENT_ACTION"`);
    await rt.run(`the response contains an empty list of audit logs`);
  });

  it("Filter audit logs by entityType [entityType=order]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter entityType "order"`);
    await rt.run(`the response contains only logs with entityType "order"`);
  });

  it("Filter audit logs by entityType [entityType=product]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter entityType "product"`);
    await rt.run(`the response contains only logs with entityType "product"`);
  });

  it("Filter audit logs by userEmail [userEmail=admin@example.com]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter userEmail "admin@example.com"`);
    await rt.run(`the response contains only logs with userEmail "admin@example.com"`);
  });

  it("Filter audit logs by userEmail [userEmail=operator@example.com]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`the admin requests audit logs with filter userEmail "operator@example.com"`);
    await rt.run(`the response contains only logs with userEmail "operator@example.com"`);
  });

  it("Pagination applies when filtering by action [total=5, limit=2]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`there are "5" audit logs with action "ORDER_STATUS_CHANGED"`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_STATUS_CHANGED" and limit "2"`);
    await rt.run(`the response contains at most "2" logs`);
    await rt.run(`the response includes a cursor when more results exist`);
  });

  it("Pagination applies when filtering by action [total=3, limit=3]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`there are "3" audit logs with action "ORDER_STATUS_CHANGED"`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_STATUS_CHANGED" and limit "3"`);
    await rt.run(`the response contains at most "3" logs`);
    await rt.run(`the response includes a cursor when more results exist`);
  });

  it("Pagination applies when filtering by action [total=1, limit=5]", async () => {
    rt.reset();
    await rt.run(`the user is authenticated as an admin with permission "audit:view"`);
    await rt.run(`the following audit logs exist:`);
    await rt.run(`there are "1" audit logs with action "ORDER_STATUS_CHANGED"`);
    await rt.run(`the admin requests audit logs with filter action "ORDER_STATUS_CHANGED" and limit "5"`);
    await rt.run(`the response contains at most "5" logs`);
    await rt.run(`the response includes a cursor when more results exist`);
  });

});
