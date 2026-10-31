import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerDiscountsSpecialCouponApiSteps } from '../steps/discounts-special-coupon-api.steps';

describe("Discount Special Coupon API", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerDiscountsSpecialCouponApiSteps(rt);
  });

  it("Creating a special coupon sets its key properties", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a special coupon for client "client-123" with value 15`);
    await rt.run(`the created discount has a non-empty code`);
    await rt.run(`the created discount has maxUses equal to 1`);
    await rt.run(`the created discount has isSpecial equal to true`);
    await rt.run(`the created discount has targetClientId equal to "client-123"`);
  });

  it("A special coupon cannot be created without a target client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin attempts to create a special coupon without a targetClientId`);
    await rt.run(`the request fails with error "SPECIAL_COUPON_REQUIRES_CLIENT"`);
  });

  it("A special percentage coupon at or below 10% requires approval [value=5]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a special coupon for client "client-123" with value 5`);
    await rt.run(`the created discount has needsApproval equal to true`);
    await rt.run(`the created discount has isActive equal to false`);
  });

  it("A special percentage coupon at or below 10% requires approval [value=10]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a special coupon for client "client-123" with value 10`);
    await rt.run(`the created discount has needsApproval equal to true`);
    await rt.run(`the created discount has isActive equal to false`);
  });

  it("A special percentage coupon above 10% activates immediately [value=11]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a special coupon for client "client-123" with value 11`);
    await rt.run(`the created discount has needsApproval equal to false`);
    await rt.run(`the created discount has isActive equal to true`);
  });

  it("A special percentage coupon above 10% activates immediately [value=50]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a special coupon for client "client-123" with value 50`);
    await rt.run(`the created discount has needsApproval equal to false`);
    await rt.run(`the created discount has isActive equal to true`);
  });

  it("An approved special coupon can be validated by the target client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`an approved special coupon for client "client-123" with code "SPEC-ABC123" exists`);
    await rt.run(`client "client-123" validates the coupon code "SPEC-ABC123"`);
    await rt.run(`the validation succeeds`);
  });

  it("An approved special coupon cannot be validated by a different client", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`an approved special coupon for client "client-123" with code "SPEC-ABC123" exists`);
    await rt.run(`client "client-456" validates the coupon code "SPEC-ABC123"`);
    await rt.run(`the validation fails with error "DISCOUNT_NOT_APPLICABLE"`);
  });

  it("A special coupon is invalidated after it is used once", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`an approved special coupon for client "client-123" with code "SPEC-ABC123" has been used once`);
    await rt.run(`client "client-123" validates the coupon code "SPEC-ABC123"`);
    await rt.run(`the validation fails with error "DISCOUNT_INVALID"`);
  });

  it("Discount list response includes isSpecial for each discount", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the client requests the discounts list`);
    await rt.run(`each discount entry contains field "isSpecial"`);
  });

});
