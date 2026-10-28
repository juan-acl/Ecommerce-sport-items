import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerAuditApiParamsSteps } from '../steps/audit-api-params.steps';

describe("Audit API Query Parameters", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerAuditApiParamsSteps(rt);
  });

  it("Each filter maps to the correct query parameter name [field=action, value=ORDER_APPROVED, param=action]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with filter "action" set to "ORDER_APPROVED"`);
    await rt.run(`the HTTP request includes query parameter "action" equal to "ORDER_APPROVED"`);
  });

  it("Each filter maps to the correct query parameter name [field=userId, value=user-123, param=userId]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with filter "userId" set to "user-123"`);
    await rt.run(`the HTTP request includes query parameter "userId" equal to "user-123"`);
  });

  it("Each filter maps to the correct query parameter name [field=userEmail, value=admin@example.com, param=userEmail]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with filter "userEmail" set to "admin@example.com"`);
    await rt.run(`the HTTP request includes query parameter "userEmail" equal to "admin@example.com"`);
  });

  it("Each filter maps to the correct query parameter name [field=entityType, value=order, param=entityType]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with filter "entityType" set to "order"`);
    await rt.run(`the HTTP request includes query parameter "entityType" equal to "order"`);
  });

  it("Each filter maps to the correct query parameter name [field=fromDate, value=2026-10-01, param=fromDate]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with filter "fromDate" set to "2026-10-01"`);
    await rt.run(`the HTTP request includes query parameter "fromDate" equal to "2026-10-01"`);
  });

  it("Each filter maps to the correct query parameter name [field=toDate, value=2026-10-31, param=toDate]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with filter "toDate" set to "2026-10-31"`);
    await rt.run(`the HTTP request includes query parameter "toDate" equal to "2026-10-31"`);
  });

  it("Undefined filters are omitted from the request", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with no filters`);
    await rt.run(`the HTTP request does not include parameters action, userId, userEmail, entityType, fromDate, toDate`);
  });

  it("Changing any filter clears the cursor", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests audit logs with filter "action" set to "ORDER_APPROVED"`);
    await rt.run(`the HTTP request does not include the cursor parameter`);
  });

});
