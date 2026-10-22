import { useState, useEffect } from 'react';
import type { CheckoutStep } from '../components/CheckoutSteps';
import type { ShippingAddressFormData } from '../api/schemas';
import type { AppliedDiscount } from '../components/DiscountCodeInput';
import type { PaymentMethodInfo } from '../types';

const SESSION_KEY = 'checkout_session';

export interface CheckoutSessionState {
  step: CheckoutStep;
  shippingAddress: ShippingAddressFormData | null;
  paymentMethod: PaymentMethodInfo | null;
  appliedDiscount: AppliedDiscount | null;
}

const DEFAULT_STATE: CheckoutSessionState = {
  step: 'shipping',
  shippingAddress: null,
  paymentMethod: null,
  appliedDiscount: null,
};

export function readCheckoutSession(): CheckoutSessionState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function writeCheckoutSession(state: CheckoutSessionState): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}

export function clearCheckoutSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function useCheckoutSession() {
  const [state, setState] = useState<CheckoutSessionState>(readCheckoutSession);

  useEffect(() => {
    writeCheckoutSession(state);
  }, [state]);

  return {
    step: state.step,
    shippingAddress: state.shippingAddress,
    paymentMethod: state.paymentMethod,
    appliedDiscount: state.appliedDiscount,

    setStep: (step: CheckoutStep) => setState((s) => ({ ...s, step })),
    setShippingAddress: (shippingAddress: ShippingAddressFormData | null) =>
      setState((s) => ({ ...s, shippingAddress })),
    setPaymentMethod: (paymentMethod: PaymentMethodInfo | null) =>
      setState((s) => ({ ...s, paymentMethod })),
    setAppliedDiscount: (appliedDiscount: AppliedDiscount | null) =>
      setState((s) => ({ ...s, appliedDiscount })),
    clear: () => {
      clearCheckoutSession();
      setState(DEFAULT_STATE);
    },
  };
}
