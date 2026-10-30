import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerDiscountsNoApprovalSteps } from '../steps/discounts-no-approval.steps';

describe("Discount No Approval Required", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerDiscountsNoApprovalSteps(rt);
  });

  it("Creating a global percentage discount above 10% activates it immediately [value=11]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a global percentage discount with value 11`);
    await rt.run(`the created discount has isActive equal to true`);
  });

  it("Creating a global percentage discount above 10% activates it immediately [value=50]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a global percentage discount with value 50`);
    await rt.run(`the created discount has isActive equal to true`);
  });

  it("Creating a global percentage discount above 10% activates it immediately [value=100]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a global percentage discount with value 100`);
    await rt.run(`the created discount has isActive equal to true`);
  });

  it("Creating a global percentage discount above 10% sets needsApproval to false [value=11]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a global percentage discount with value 11`);
    await rt.run(`the created discount has needsApproval equal to false`);
  });

  it("Creating a global percentage discount above 10% sets needsApproval to false [value=50]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a global percentage discount with value 50`);
    await rt.run(`the created discount has needsApproval equal to false`);
  });

  it("Creating a global percentage discount above 10% sets needsApproval to false [value=100]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`the admin creates a global percentage discount with value 100`);
    await rt.run(`the created discount has needsApproval equal to false`);
  });

  it("A global percentage discount above 10% can be toggled freely without prior approval [initialState=active, action=inactive, expected=false]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`a global percentage discount with value 25 exists and is active`);
    await rt.run(`the admin toggles the discount inactive`);
    await rt.run(`the discount has isActive equal to false`);
  });

  it("A global percentage discount above 10% can be toggled freely without prior approval [initialState=inactive, action=active, expected=true]", async () => {
    rt.reset();
    await rt.run(`the admin API client is initialized`);
    await rt.run(`a global percentage discount with value 25 exists and is inactive`);
    await rt.run(`the admin toggles the discount active`);
    await rt.run(`the discount has isActive equal to true`);
  });

});
