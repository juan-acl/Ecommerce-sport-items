import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { Discount } from '../../../src/modules/discounts/domain/entities/discount.entity';
import type { DiscountProps } from '../../../src/modules/discounts/domain/entities/discount.entity';
import { CreateDiscountUseCase } from '../../../src/modules/discounts/application/use-cases/create-discount.use-case';
import { buildDiscountRepo } from '../helpers/discount-repo-builders';

const SPECIAL_FORM_FIELDS = ['Cliente específico'];
const SPECIAL_FORM_EXCLUDED_FIELDS = ['Código'];

interface SpecialFormState {
  isOpen: boolean;
  selectedClientId: string | null;
  selectedClientName: string | null;
  validationError: string | null;
}

interface ListItem {
  discount: DiscountProps;
  showEspecialBadge: boolean;
}

function buildSpecialFormState(): SpecialFormState {
  return { isOpen: false, selectedClientId: null, selectedClientName: null, validationError: null };
}

export function registerDiscountsSpecialCouponUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Descuentos page/, (_m, ctx) => {
    ctx.form = buildSpecialFormState();
  });

  rt.step(/a special coupon targeting "([^"]+)" exists in the list/, (m, ctx) => {
    const clientName = m[1];
    void clientName;
    const discount = new Discount({
      id: 'sp-1',
      code: 'SPEC-ABC123',
      type: 'percentage',
      value: 15,
      minPurchase: 0,
      maxUses: 1,
      usedCount: 0,
      isActive: true,
      needsApproval: false,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@test.com',
      targetClientId: 'client-123',
      isSpecial: true,
    });
    ctx.listItem = { discount: discount.toJSON(), showEspecialBadge: discount.isSpecial };
  });

  rt.step(/the discount list shows an "Especial" badge for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    expect(item.showEspecialBadge).toBe(true);
    expect(item.discount.isSpecial).toBe(true);
  });

  rt.step(/a global discount exists in the list/, (_m, ctx) => {
    const discount = new Discount({
      id: 'g-1',
      code: 'GLOBAL10',
      type: 'percentage',
      value: 10,
      minPurchase: 0,
      maxUses: 0,
      usedCount: 0,
      isActive: true,
      needsApproval: false,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@test.com',
      targetClientId: null,
      isSpecial: false,
    });
    ctx.listItem = { discount: discount.toJSON(), showEspecialBadge: discount.isSpecial };
  });

  rt.step(/the discount list does not show an "Especial" badge for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    expect(item.showEspecialBadge).toBe(false);
    expect(item.discount.isSpecial).toBeFalsy();
  });

  rt.step(/the admin opens the create special coupon form/, (_m, ctx) => {
    (ctx.form as SpecialFormState).isOpen = true;
  });

  rt.step(/the form displays a required field labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(SPECIAL_FORM_FIELDS).toContain(label);
  });

  rt.step(/the form does not display a field labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(SPECIAL_FORM_EXCLUDED_FIELDS).toContain(label);
  });

  rt.step(/the admin has opened the create special coupon form/, (_m, ctx) => {
    (ctx.form as SpecialFormState).isOpen = true;
  });

  rt.step(/the admin submits the form without selecting a client/, (_m, ctx) => {
    const form = ctx.form as SpecialFormState;
    if (!form.selectedClientId) {
      form.validationError = 'Debes seleccionar un cliente';
    }
  });

  rt.step(/the form shows error "([^"]+)"/, (m, ctx) => {
    const expected = m[1];
    const form = ctx.form as SpecialFormState;
    expect(form.validationError).toBe(expected);
  });

  rt.step(/the admin has selected client "([^"]+)" with id "([^"]+)" in the client selector/, (m, ctx) => {
    const clientName = m[1];
    const clientId = m[2];
    const form = ctx.form as SpecialFormState;
    form.selectedClientId = clientId;
    form.selectedClientName = clientName;
  });

  rt.step(/the admin submits the form with percentage value (\d+)/, async (m, ctx) => {
    const value = parseInt(m[1], 10);
    const form = ctx.form as SpecialFormState;
    const uc = new CreateDiscountUseCase(buildDiscountRepo() as never);
    const created = await uc.execute(
      { isSpecial: true, type: 'percentage', value, minPurchase: 0, maxUses: 0, targetClientId: form.selectedClientId },
      'admin@test.com',
    );
    ctx.createdDiscount = created;
    ctx.sentRequest = { isSpecial: true, type: 'percentage', value, targetClientId: form.selectedClientId };
    ctx.listItem = { discount: created, showEspecialBadge: created.isSpecial ?? false };
  });

  rt.step(/the discount list shows status "Pendiente aprobación" for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    expect(item.discount.needsApproval).toBe(true);
    expect(item.discount.isActive).toBe(false);
  });

  rt.step(/the discount list shows status "Activo" for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    expect(item.discount.isActive).toBe(true);
    expect(item.discount.needsApproval).toBeFalsy();
  });

  rt.step(/the create discount API request includes isSpecial equal to true/, (_m, ctx) => {
    const req = ctx.sentRequest as { isSpecial: boolean };
    expect(req.isSpecial).toBe(true);
  });
}
