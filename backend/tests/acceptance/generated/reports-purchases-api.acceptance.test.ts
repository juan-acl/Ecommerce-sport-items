import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsPurchasesApiSteps } from '../steps/reports-purchases-api.steps';

describe("Reports Purchases API", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsPurchasesApiSteps(rt);
  });

  it("Purchases summary response contains required top-level fields [field=totalPurchases]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the response includes field "totalPurchases"`);
  });

  it("Purchases summary response contains required top-level fields [field=totalCost]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the response includes field "totalCost"`);
  });

  it("Purchases summary response contains required top-level fields [field=averagePurchaseCost]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the response includes field "averagePurchaseCost"`);
  });

  it("Purchases summary response contains required top-level fields [field=purchasesByStatus]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the response includes field "purchasesByStatus"`);
  });

  it("Purchases summary response contains required top-level fields [field=topSuppliers]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the response includes field "topSuppliers"`);
  });

  it("purchasesByStatus contains each expected status key [status=pending]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the "purchasesByStatus" object contains key "pending"`);
  });

  it("purchasesByStatus contains each expected status key [status=partial]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the "purchasesByStatus" object contains key "partial"`);
  });

  it("purchasesByStatus contains each expected status key [status=received]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the "purchasesByStatus" object contains key "received"`);
  });

  it("purchasesByStatus contains each expected status key [status=cancelled]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the "purchasesByStatus" object contains key "cancelled"`);
  });

  it("Each topSuppliers entry contains required fields [field=supplierId]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`each entry in "topSuppliers" contains field "supplierId"`);
  });

  it("Each topSuppliers entry contains required fields [field=supplierName]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`each entry in "topSuppliers" contains field "supplierName"`);
  });

  it("Each topSuppliers entry contains required fields [field=totalPurchases]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`each entry in "topSuppliers" contains field "totalPurchases"`);
  });

  it("Each topSuppliers entry contains required fields [field=totalSpent]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`each entry in "topSuppliers" contains field "totalSpent"`);
  });

  it("topSuppliers list is ordered by totalSpent descending", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the "topSuppliers" list is ordered by "totalSpent" descending`);
  });

  it("Period parameter scopes purchases to the requested time window [period=day]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "day"`);
    await rt.run(`the response "totalPurchases" counts only purchases created within "day"`);
  });

  it("Period parameter scopes purchases to the requested time window [period=week]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "week"`);
    await rt.run(`the response "totalPurchases" counts only purchases created within "week"`);
  });

  it("Period parameter scopes purchases to the requested time window [period=month]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the purchases report with period "month"`);
    await rt.run(`the response "totalPurchases" counts only purchases created within "month"`);
  });

});
