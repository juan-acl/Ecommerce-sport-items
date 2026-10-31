import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerDiscountsSpecialCouponUiSteps } from '../steps/discounts-special-coupon-ui.steps';

describe("Discount Special Coupon UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerDiscountsSpecialCouponUiSteps(rt);
  });

  it("Discount list shows an Especial badge for special coupons", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a special coupon targeting "Juan Pérez" exists in the list`);
    await rt.run(`the discount list shows an "Especial" badge for that discount`);
  });

  it("Discount list does not show an Especial badge for regular discounts", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a global discount exists in the list`);
    await rt.run(`the discount list does not show an "Especial" badge for that discount`);
  });

  it("Create special coupon form requires a target client and has no code field", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin opens the create special coupon form`);
    await rt.run(`the form displays a required field labeled "Cliente específico"`);
    await rt.run(`the form does not display a field labeled "Código"`);
  });

  it("Submitting the create special coupon form without a target client shows a validation error", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create special coupon form`);
    await rt.run(`the admin submits the form without selecting a client`);
    await rt.run(`the form shows error "Debes seleccionar un cliente"`);
  });

  it("A newly created special percentage coupon at or below 10% shows Pendiente aprobación [value=5]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create special coupon form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 5`);
    await rt.run(`the discount list shows status "Pendiente aprobación" for that discount`);
  });

  it("A newly created special percentage coupon at or below 10% shows Pendiente aprobación [value=10]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create special coupon form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 10`);
    await rt.run(`the discount list shows status "Pendiente aprobación" for that discount`);
  });

  it("A newly created special percentage coupon above 10% shows Activo and sends isSpecial true [value=11]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create special coupon form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 11`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
    await rt.run(`the create discount API request includes isSpecial equal to true`);
  });

  it("A newly created special percentage coupon above 10% shows Activo and sends isSpecial true [value=50]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin has opened the create special coupon form`);
    await rt.run(`the admin has selected client "Juan Pérez" with id "client-123" in the client selector`);
    await rt.run(`the admin submits the form with percentage value 50`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
    await rt.run(`the create discount API request includes isSpecial equal to true`);
  });

});
