import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerOrderEmailSteps } from '../steps/order-status-email.steps';

describe("Order Status Email Notification", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerOrderEmailSteps(rt);
  });

  it("Customer receives confirmation email after checkout", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`the customer has items in their cart`);
    await rt.run(`the customer completes checkout`);
    await rt.run(`an order confirmation email is sent to "cliente@example.com"`);
    await rt.run(`the order status is "paid"`);
  });

  it("Customer receives email when order is approved or rejected [decision=approves, new_status=processing]", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "paid" belongs to the customer`);
    await rt.run(`an admin "approves" the order`);
    await rt.run(`an order status update email is sent to "cliente@example.com" with new status "processing"`);
  });

  it("Customer receives email when order is approved or rejected [decision=rejects, new_status=cancelled]", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "paid" belongs to the customer`);
    await rt.run(`an admin "rejects" the order`);
    await rt.run(`an order status update email is sent to "cliente@example.com" with new status "cancelled"`);
  });

  it("Customer receives email on each admin status transition [current_status=paid, new_status=processing]", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "paid" belongs to the customer`);
    await rt.run(`an admin updates the order status to "processing"`);
    await rt.run(`an order status update email is sent to "cliente@example.com" with new status "processing"`);
  });

  it("Customer receives email on each admin status transition [current_status=paid, new_status=cancelled]", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "paid" belongs to the customer`);
    await rt.run(`an admin updates the order status to "cancelled"`);
    await rt.run(`an order status update email is sent to "cliente@example.com" with new status "cancelled"`);
  });

  it("Customer receives email on each admin status transition [current_status=processing, new_status=shipped]", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "processing" belongs to the customer`);
    await rt.run(`an admin updates the order status to "shipped"`);
    await rt.run(`an order status update email is sent to "cliente@example.com" with new status "shipped"`);
  });

  it("Customer receives email on each admin status transition [current_status=processing, new_status=cancelled]", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "processing" belongs to the customer`);
    await rt.run(`an admin updates the order status to "cancelled"`);
    await rt.run(`an order status update email is sent to "cliente@example.com" with new status "cancelled"`);
  });

  it("Customer receives email on each admin status transition [current_status=shipped, new_status=delivered]", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "shipped" belongs to the customer`);
    await rt.run(`an admin updates the order status to "delivered"`);
    await rt.run(`an order status update email is sent to "cliente@example.com" with new status "delivered"`);
  });

  it("Email failure does not fail order status transition", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`an order with status "paid" belongs to the customer`);
    await rt.run(`the email service is unavailable`);
    await rt.run(`an admin updates the order status to "processing"`);
    await rt.run(`the order status is updated to "processing"`);
    await rt.run(`no error is returned to the admin`);
  });

  it("Email failure does not fail checkout", async () => {
    rt.reset();
    await rt.run(`a customer with email "cliente@example.com" and name "Juan Perez" exists`);
    await rt.run(`an email service is configured`);
    await rt.run(`the customer has items in their cart`);
    await rt.run(`the email service is unavailable`);
    await rt.run(`the customer completes checkout`);
    await rt.run(`the order is created with status "paid"`);
    await rt.run(`no error is returned to the customer`);
  });

});
