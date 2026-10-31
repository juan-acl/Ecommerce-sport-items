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

  it("An approved client-specific coupon can be applied by the targeted client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`an approved discount with targetClientId "client-123" exists with code "VIP10"`);
    await rt.run(`client "client-123" validates the coupon code "VIP10"`);
    await rt.run(`the validation succeeds`);
  });

  it("An approved client-specific coupon cannot be applied by a different client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`an approved discount with targetClientId "client-123" exists with code "VIP10"`);
    await rt.run(`client "client-456" validates the coupon code "VIP10"`);
    await rt.run(`the validation fails with error "DISCOUNT_NOT_APPLICABLE"`);
  });

  it("A pending client-specific coupon cannot be applied even by the targeted client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`a pending discount with targetClientId "client-123" exists with code "VIP10"`);
    await rt.run(`client "client-123" validates the coupon code "VIP10"`);
    await rt.run(`the validation fails with error "DISCOUNT_PENDING_APPROVAL"`);
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

  it("Creating a client-specific percentage coupon at or below 10% requires approval [value=5]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a percentage discount with targetClientId "client-123" and value 5`);
    await rt.run(`the created discount has needsApproval equal to true`);
    await rt.run(`the created discount has isActive equal to false`);
  });

  it("Creating a client-specific percentage coupon at or below 10% requires approval [value=10]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a percentage discount with targetClientId "client-123" and value 10`);
    await rt.run(`the created discount has needsApproval equal to true`);
    await rt.run(`the created discount has isActive equal to false`);
  });

  it("Approving a client-specific coupon activates it and clears needsApproval", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`a client-specific discount with code "VIP10" is pending approval`);
    await rt.run(`the admin approves the discount`);
    await rt.run(`the discount has isActive equal to true`);
    await rt.run(`the discount has needsApproval equal to false`);
  });

  it("Creating a client-specific percentage coupon above 10% activates immediately [value=11]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a percentage discount with targetClientId "client-123" and value 11`);
    await rt.run(`the created discount has needsApproval equal to false`);
    await rt.run(`the created discount has isActive equal to true`);
  });

  it("Creating a client-specific percentage coupon above 10% activates immediately [value=50]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a percentage discount with targetClientId "client-123" and value 50`);
    await rt.run(`the created discount has needsApproval equal to false`);
    await rt.run(`the created discount has isActive equal to true`);
  });

  it("Creating a client-specific percentage coupon above 10% activates immediately [value=100]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a percentage discount with targetClientId "client-123" and value 100`);
    await rt.run(`the created discount has needsApproval equal to false`);
    await rt.run(`the created discount has isActive equal to true`);
  });

});
