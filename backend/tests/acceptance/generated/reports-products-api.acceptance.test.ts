import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerReportsProductsApiSteps } from '../steps/reports-products-api.steps';

describe("Reports Products API", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerReportsProductsApiSteps(rt);
  });

  it("Products report response contains required fields for each product entry [field=id]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`each product entry contains field "id"`);
  });

  it("Products report response contains required fields for each product entry [field=name]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`each product entry contains field "name"`);
  });

  it("Products report response contains required fields for each product entry [field=category]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`each product entry contains field "category"`);
  });

  it("Products report response contains required fields for each product entry [field=price]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`each product entry contains field "price"`);
  });

  it("Products report response contains required fields for each product entry [field=stock]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`each product entry contains field "stock"`);
  });

  it("Products report response contains required fields for each product entry [field=minStock]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`each product entry contains field "minStock"`);
  });

  it("Products report response contains required pagination fields [field=products]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`the response includes field "products"`);
  });

  it("Products report response contains required pagination fields [field=total]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`the response includes field "total"`);
  });

  it("Products report response contains required pagination fields [field=page]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`the response includes field "page"`);
  });

  it("Products report response contains required pagination fields [field=pageSize]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report`);
    await rt.run(`the response includes field "pageSize"`);
  });

  it("Category filter returns only products in the given category", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report with category "running"`);
    await rt.run(`every product entry has category "running"`);
  });

  it("Name filter returns only products whose name contains the search term", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report with name "camisa"`);
    await rt.run(`every product entry name contains "camisa"`);
  });

  it("stockStatus filter returns only products matching that stock condition [status=out_of_stock]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report with stockStatus "out_of_stock"`);
    await rt.run(`every product entry satisfies the "out_of_stock" stock condition`);
  });

  it("stockStatus filter returns only products matching that stock condition [status=low_stock]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report with stockStatus "low_stock"`);
    await rt.run(`every product entry satisfies the "low_stock" stock condition`);
  });

  it("stockStatus filter returns only products matching that stock condition [status=in_stock]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the products report with stockStatus "in_stock"`);
    await rt.run(`every product entry satisfies the "in_stock" stock condition`);
  });

});
