import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsDateRangeApiSteps } from '../steps/reports-date-range-api.steps';

describe("Reports Date Range API", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsDateRangeApiSteps(rt);
  });

  it("Sales report with explicit date range scopes totalOrders to that window [from=2026-01-01, to=2026-03-31]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the sales report with from "2026-01-01" and to "2026-03-31"`);
    await rt.run(`the response "totalOrders" counts only orders created from "2026-01-01" to "2026-03-31"`);
  });

  it("Sales report with explicit date range scopes totalOrders to that window [from=2026-07-01, to=2026-09-30]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the sales report with from "2026-07-01" and to "2026-09-30"`);
    await rt.run(`the response "totalOrders" counts only orders created from "2026-07-01" to "2026-09-30"`);
  });

  it("Sales report explicit date range takes precedence over period parameter", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the sales report with period "day" and from "2026-10-01" and to "2026-10-31"`);
    await rt.run(`the response "totalOrders" counts only orders created from "2026-10-01" to "2026-10-31"`);
  });

  it("Purchases report with explicit date range scopes totalPurchases to that window [from=2026-01-01, to=2026-03-31]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with from "2026-01-01" and to "2026-03-31"`);
    await rt.run(`the response "totalPurchases" counts only purchases created from "2026-01-01" to "2026-03-31"`);
  });

  it("Purchases report with explicit date range scopes totalPurchases to that window [from=2026-07-01, to=2026-09-30]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with from "2026-07-01" and to "2026-09-30"`);
    await rt.run(`the response "totalPurchases" counts only purchases created from "2026-07-01" to "2026-09-30"`);
  });

  it("Purchases report explicit date range takes precedence over period parameter", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "day" and from "2026-10-01" and to "2026-10-31"`);
    await rt.run(`the response "totalPurchases" counts only purchases created from "2026-10-01" to "2026-10-31"`);
  });

  it("Client analytics report with explicit date range scopes newClients to that window [from=2026-01-01, to=2026-03-31]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with from "2026-01-01" and to "2026-03-31"`);
    await rt.run(`the response "newClients" counts only clients registered from "2026-01-01" to "2026-03-31"`);
  });

  it("Client analytics report with explicit date range scopes newClients to that window [from=2026-07-01, to=2026-09-30]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with from "2026-07-01" and to "2026-09-30"`);
    await rt.run(`the response "newClients" counts only clients registered from "2026-07-01" to "2026-09-30"`);
  });

});
