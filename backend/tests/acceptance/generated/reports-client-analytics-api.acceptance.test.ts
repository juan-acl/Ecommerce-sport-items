import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsClientAnalyticsApiSteps } from '../steps/reports-client-analytics-api.steps';

describe("Reports Client Analytics API", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsClientAnalyticsApiSteps(rt);
  });

  it("Client analytics response contains required top-level fields [field=totalClients]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`the response includes field "totalClients"`);
  });

  it("Client analytics response contains required top-level fields [field=newClients]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`the response includes field "newClients"`);
  });

  it("Client analytics response contains required top-level fields [field=topClients]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`the response includes field "topClients"`);
  });

  it("Each topClients entry contains required fields [field=clientId]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`each entry in "topClients" contains field "clientId"`);
  });

  it("Each topClients entry contains required fields [field=clientName]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`each entry in "topClients" contains field "clientName"`);
  });

  it("Each topClients entry contains required fields [field=orderCount]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`each entry in "topClients" contains field "orderCount"`);
  });

  it("Each topClients entry contains required fields [field=totalSpent]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`each entry in "topClients" contains field "totalSpent"`);
  });

  it("topClients list is ordered by totalSpent descending", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`the "topClients" list is ordered by "totalSpent" descending`);
  });

  it("Period parameter scopes newClients to the requested time window [period=day]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "day"`);
    await rt.run(`the response "newClients" counts only clients registered within "day"`);
  });

  it("Period parameter scopes newClients to the requested time window [period=week]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "week"`);
    await rt.run(`the response "newClients" counts only clients registered within "week"`);
  });

  it("Period parameter scopes newClients to the requested time window [period=month]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the client analytics report with period "month"`);
    await rt.run(`the response "newClients" counts only clients registered within "month"`);
  });

});
