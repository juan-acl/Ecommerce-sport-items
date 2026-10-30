import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { registerDiscountsNoApprovalUiSteps } from '../steps/discounts-no-approval-ui.steps';

describe("Discount No Approval UI", () => {
  let rt: AcceptanceRuntime;

  beforeEach(() => {
    rt = new AcceptanceRuntime();
    registerDiscountsNoApprovalUiSteps(rt);
  });

  it("Discount list does not show Aprobar action for any discount [value=11]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a percentage discount with value 11 exists in the list`);
    await rt.run(`the discount list does not show an "Aprobar" action for that discount`);
  });

  it("Discount list does not show Aprobar action for any discount [value=50]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a percentage discount with value 50 exists in the list`);
    await rt.run(`the discount list does not show an "Aprobar" action for that discount`);
  });

  it("Discount list does not show Aprobar action for any discount [value=100]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a percentage discount with value 100 exists in the list`);
    await rt.run(`the discount list does not show an "Aprobar" action for that discount`);
  });

  it("Discount list does not show Pendiente aprobación status for any discount [value=11]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a percentage discount with value 11 exists in the list`);
    await rt.run(`the discount list does not show status "Pendiente aprobación" for that discount`);
  });

  it("Discount list does not show Pendiente aprobación status for any discount [value=50]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a percentage discount with value 50 exists in the list`);
    await rt.run(`the discount list does not show status "Pendiente aprobación" for that discount`);
  });

  it("Discount list does not show Pendiente aprobación status for any discount [value=100]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`a percentage discount with value 100 exists in the list`);
    await rt.run(`the discount list does not show status "Pendiente aprobación" for that discount`);
  });

  it("A newly created percentage discount above 10% shows as Activo immediately [value=11]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin creates a percentage discount with value 11`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
  });

  it("A newly created percentage discount above 10% shows as Activo immediately [value=50]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin creates a percentage discount with value 50`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
  });

  it("A newly created percentage discount above 10% shows as Activo immediately [value=100]", async () => {
    rt.reset();
    await rt.run(`an admin is authenticated and viewing the Descuentos page`);
    await rt.run(`the admin creates a percentage discount with value 100`);
    await rt.run(`the discount list shows status "Activo" for that discount`);
  });

});
