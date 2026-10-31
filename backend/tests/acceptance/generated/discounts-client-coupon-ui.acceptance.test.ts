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

  it("A newly created client-specific percentage coupon at or below 10% shows Pendiente aprobación [value=5]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create discount form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 5`);
    await rt.run(`the discount list shows status "Pendiente aprobación" for that discount`);
  });

  it("A newly created client-specific percentage coupon at or below 10% shows Pendiente aprobación [value=10]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create discount form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 10`);
    await rt.run(`the discount list shows status "Pendiente aprobación" for that discount`);
  });

  it("Discount list shows Aprobar action for a pending client-specific coupon", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a client-specific discount targeting "Juan Pérez" is pending approval in the list`);
    await rt.run(`the discount list shows an "Aprobar" action for that discount`);
  });

  it("Clicking Aprobar on a client-specific coupon changes its status to Activo", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a client-specific discount targeting "Juan Pérez" is pending approval in the list`);
    await rt.run(`the admin clicks "Aprobar" for that discount`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
  });

  it("A newly created client-specific percentage coupon above 10% shows Activo immediately [value=11]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create discount form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 11`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
  });

  it("A newly created client-specific percentage coupon above 10% shows Activo immediately [value=50]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create discount form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 50`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
  });

  it("A newly created client-specific percentage coupon above 10% shows Activo immediately [value=100]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create discount form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 100`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
  });

});
