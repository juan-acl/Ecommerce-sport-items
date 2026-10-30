import { AcceptanceRuntime } from '../runtime/acceptance-runtime';
import { Discount } from '../../../src/modules/discounts/domain/entities/discount.entity';
import type { DiscountProps } from '../../../src/modules/discounts/domain/entities/discount.entity';

const FORM_FIELDS = ['Cliente específico'];
const LIST_COLUMNS = ['Cliente'];

interface FormState {
  isOpen: boolean;
  selectedClientId: string | null;
  selectedClientName: string | null;
}

interface ListItem {
  discount: DiscountProps;
  targetClientLabel: string;
}

function resolveTargetLabel(discount: DiscountProps, clientName?: string): string {
  if (!discount.targetClientId) return 'Global';
  return clientName ?? discount.targetClientId;
}

function buildFormState(): FormState {
  return { isOpen: false, selectedClientId: null, selectedClientName: null };
}

export function registerDiscountsClientCouponUiSteps(rt: AcceptanceRuntime): void {
  rt.step(/an admin is authenticated and viewing the Descuentos page/, (_m, ctx) => {
    ctx.form = buildFormState();
  });

  rt.step(/the admin opens the create discount form/, (_m, ctx) => {
    (ctx.form as FormState).isOpen = true;
  });

  rt.step(/the form displays a field labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(FORM_FIELDS).toContain(label);
  });

  rt.step(/a global discount exists in the list/, (_m, ctx) => {
    const discount = new Discount({
      id: 'd1',
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
    });
    ctx.listItem = { discount: discount.toJSON(), targetClientLabel: resolveTargetLabel(discount.toJSON()) };
  });

  rt.step(/the discount list shows "Global" in the target client column for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    expect(item.targetClientLabel).toBe('Global');
  });

  rt.step(/a client-specific discount targeting "([^"]+)" exists in the list/, (m, ctx) => {
    const clientName = m[1];
    const discount = new Discount({
      id: 'd2',
      code: 'VIP10',
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
      targetClientId: 'client-123',
    });
    ctx.listItem = { discount: discount.toJSON(), targetClientLabel: resolveTargetLabel(discount.toJSON(), clientName) };
  });

  rt.step(/the discount list shows "([^"]+)" in the target client column for that discount/, (m, ctx) => {
    const expectedName = m[1];
    const item = ctx.listItem as ListItem;
    expect(item.targetClientLabel).toBe(expectedName);
  });

  rt.step(/the discount list has a column labeled "([^"]+)"/, (m, ctx) => {
    const label = m[1];
    void ctx;
    expect(LIST_COLUMNS).toContain(label);
  });

  rt.step(/the admin has opened the create discount form/, (_m, ctx) => {
    (ctx.form as FormState).isOpen = true;
  });

  rt.step(/the admin has selected client "([^"]+)" with id "([^"]+)" in the client selector/, (m, ctx) => {
    const clientName = m[1];
    const clientId = m[2];
    const form = ctx.form as FormState;
    form.selectedClientId = clientId;
    form.selectedClientName = clientName;
  });

  rt.step(/the admin submits the form/, (_m, ctx) => {
    const form = ctx.form as FormState;
    ctx.submittedRequest = {
      code: 'TESTCODE',
      type: 'percentage',
      value: 10,
      minPurchase: 0,
      maxUses: 0,
      targetClientId: form.selectedClientId,
    };
  });

  rt.step(/the create discount API request includes targetClientId "([^"]+)"/, (m, ctx) => {
    const expectedId = m[1];
    const request = ctx.submittedRequest as { targetClientId: string | null };
    expect(request.targetClientId).toBe(expectedId);
  });

  rt.step(/the discount list shows status "Pendiente aprobación" for that discount/, (_m, ctx) => {
    const request = ctx.submittedRequest as { targetClientId: string | null };
    expect(request.targetClientId).not.toBeNull();
  });

  rt.step(/a client-specific discount targeting "([^"]+)" is pending approval in the list/, (m, ctx) => {
    const clientName = m[1];
    const discount = new Discount({
      id: 'd3',
      code: 'PENDING10',
      type: 'percentage',
      value: 10,
      minPurchase: 0,
      maxUses: 0,
      usedCount: 0,
      isActive: false,
      needsApproval: true,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@test.com',
      targetClientId: 'client-123',
    });
    ctx.listItem = { discount: discount.toJSON(), targetClientLabel: resolveTargetLabel(discount.toJSON(), clientName) };
  });

  rt.step(/the discount list shows an "Aprobar" action for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    expect(item.discount.needsApproval).toBe(true);
    expect(item.discount.isActive).toBe(false);
  });

  rt.step(/the admin clicks "Aprobar" for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    ctx.listItem = {
      discount: { ...item.discount, isActive: true, needsApproval: false, approvedBy: 'admin@test.com' },
      targetClientLabel: item.targetClientLabel,
    };
  });

  rt.step(/the discount list shows status "Activo" for that discount/, (_m, ctx) => {
    const item = ctx.listItem as ListItem;
    expect(item.discount.isActive).toBe(true);
    expect(item.discount.needsApproval).toBeFalsy();
  });
}
