import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerDiscountsClientCouponApiSteps } from '../steps/discounts-client-coupon-api.steps';

describe("Discount Client Coupon API", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerDiscountsClientCouponApiSteps(rt);
  });

  it("Creating a discount with targetClientId records the target client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a discount with targetClientId "client-123"`);
    await rt.run(`the created discount has targetClientId equal to "client-123"`);
  });

  it("Creating a discount without targetClientId creates a global discount", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a discount without targetClientId`);
    await rt.run(`the created discount has targetClientId equal to null`);
  });

  it("A client-specific coupon can be applied by the targeted client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`a discount with targetClientId "client-123" exists with code "VIP10"`);
    await rt.run(`client "client-123" validates the coupon code "VIP10"`);
    await rt.run(`the validation succeeds`);
  });

  it("A client-specific coupon cannot be applied by a different client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`a discount with targetClientId "client-123" exists with code "VIP10"`);
    await rt.run(`client "client-456" validates the coupon code "VIP10"`);
    await rt.run(`the validation fails with error "DISCOUNT_NOT_APPLICABLE"`);
  });

  it("A global coupon can be applied by any client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`a global discount exists with code "GLOBAL10"`);
    await rt.run(`client "client-999" validates the coupon code "GLOBAL10"`);
    await rt.run(`the validation succeeds`);
  });

  it("Discount list response includes targetClientId for each discount", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the discounts list`);
    await rt.run(`each discount entry contains field "targetClientId"`);
  });

});
