import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerAuditSearchUiSteps } from '../steps/audit-search-ui.steps';

describe("Audit Search UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerAuditSearchUiSteps(rt);
  });

  it("Filter panel shows a control for each searchable field [field=action]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the page displays a filter control for "action"`);
  });

  it("Filter panel shows a control for each searchable field [field=entityType]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the page displays a filter control for "entityType"`);
  });

  it("Filter panel shows a control for each searchable field [field=userEmail]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the page displays a filter control for "userEmail"`);
  });

  it("Filter panel shows a control for each searchable field [field=fromDate]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the page displays a filter control for "fromDate"`);
  });

  it("Filter panel shows a control for each searchable field [field=toDate]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the page displays a filter control for "toDate"`);
  });

  it("Selecting a single filter sends it to the API [filter=action, value=ORDER_APPROVED]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin sets the "action" filter to "ORDER_APPROVED"`);
    await rt.run(`the audit API is called with parameter "action" equal to "ORDER_APPROVED"`);
    await rt.run(`the results table shows only matching records`);
  });

  it("Selecting a single filter sends it to the API [filter=action, value=ORDER_STATUS_CHANGED]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin sets the "action" filter to "ORDER_STATUS_CHANGED"`);
    await rt.run(`the audit API is called with parameter "action" equal to "ORDER_STATUS_CHANGED"`);
    await rt.run(`the results table shows only matching records`);
  });

  it("Selecting a single filter sends it to the API [filter=entityType, value=order]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin sets the "entityType" filter to "order"`);
    await rt.run(`the audit API is called with parameter "entityType" equal to "order"`);
    await rt.run(`the results table shows only matching records`);
  });

  it("Selecting a single filter sends it to the API [filter=entityType, value=product]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin sets the "entityType" filter to "product"`);
    await rt.run(`the audit API is called with parameter "entityType" equal to "product"`);
    await rt.run(`the results table shows only matching records`);
  });

  it("Selecting a single filter sends it to the API [filter=userEmail, value=admin@example.com]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin sets the "userEmail" filter to "admin@example.com"`);
    await rt.run(`the audit API is called with parameter "userEmail" equal to "admin@example.com"`);
    await rt.run(`the results table shows only matching records`);
  });

  it("Setting a date range sends fromDate and toDate to the API", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin sets "fromDate" to "2026-10-01" and "toDate" to "2026-10-31"`);
    await rt.run(`the audit API is called with fromDate "2026-10-01" and toDate "2026-10-31"`);
  });

  it("Combining filters sends all active params to the API", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin sets the "action" filter to "ORDER_APPROVED"`);
    await rt.run(`the admin sets the "entityType" filter to "order"`);
    await rt.run(`the admin sets "fromDate" to "2026-10-01" and "toDate" to "2026-10-31"`);
    await rt.run(`the audit API is called with parameters action "ORDER_APPROVED", entityType "order", fromDate "2026-10-01", toDate "2026-10-31"`);
  });

  it("Changing a filter resets pagination to the first page", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`audit results are showing a second page`);
    await rt.run(`the admin sets the "action" filter to "PRODUCT_UPDATED"`);
    await rt.run(`the API is called without a cursor parameter`);
  });

  it("Clearing all filters restores the unfiltered view", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Auditoría page`);
    await rt.run(`the admin has active filters set`);
    await rt.run(`the admin clicks the clear filters button`);
    await rt.run(`the audit API is called with no filter parameters`);
    await rt.run(`the results table shows all records`);
  });

});
