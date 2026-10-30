import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerDiscountsClientCouponUiSteps } from '../steps/discounts-client-coupon-ui.steps';

describe("Discount Client Coupon UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerDiscountsClientCouponUiSteps(rt);
  });

  it("Create discount form shows a target client selector field", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin opens the create discount form`);
    await rt.run(`the form displays a field labeled "Cliente específico"`);
  });

  it("Discount list shows Global for discounts without a target client", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a global discount exists in the list`);
    await rt.run(`the discount list shows "Global" in the target client column for that discount`);
  });

  it("Discount list shows the target client name for client-specific discounts", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a client-specific discount targeting "Juan Pérez" exists in the list`);
    await rt.run(`the discount list shows "Juan Pérez" in the target client column for that discount`);
  });

  it("Discount list has a target client column header", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the discount list has a column labeled "Cliente"`);
  });

  it("Submitting the create discount form with a target client includes targetClientId in the request", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create discount form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form`);
    await rt.run(`the create discount API request includes targetClientId "client-123"`);
  });

});
