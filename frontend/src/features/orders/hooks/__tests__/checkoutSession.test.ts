import { beforeEach, describe, it, expect } from 'vitest';
import {
  readCheckoutSession,
  writeCheckoutSession,
  clearCheckoutSession,
} from '../useCheckoutSession';

beforeEach(() => {
  sessionStorage.clear();
});

describe('readCheckoutSession', () => {
  it('returns default state when sessionStorage is empty', () => {
    const state = readCheckoutSession();
    expect(state.step).toBe('shipping');
    expect(state.shippingAddress).toBeNull();
    expect(state.paymentMethod).toBeNull();
    expect(state.appliedDiscount).toBeNull();
  });

  it('restores step from sessionStorage', () => {
    sessionStorage.setItem(
      'checkout_session',
      JSON.stringify({ step: 'payment', shippingAddress: null, paymentMethod: null, appliedDiscount: null }),
    );
    expect(readCheckoutSession().step).toBe('payment');
  });

  it('restores shippingAddress from sessionStorage', () => {
    const addr = { street: '5a Av.', city: 'Guatemala', country: 'Guatemala', postalCode: '01010' };
    sessionStorage.setItem(
      'checkout_session',
      JSON.stringify({ step: 'shipping', shippingAddress: addr, paymentMethod: null, appliedDiscount: null }),
    );
    expect(readCheckoutSession().shippingAddress).toEqual(addr);
  });

  it('returns default state when sessionStorage contains invalid JSON', () => {
    sessionStorage.setItem('checkout_session', '{broken json');
    const state = readCheckoutSession();
    expect(state.step).toBe('shipping');
  });
});

describe('writeCheckoutSession', () => {
  it('persists the checkout state to sessionStorage', () => {
    writeCheckoutSession({
      step: 'review',
      shippingAddress: null,
      paymentMethod: null,
      appliedDiscount: null,
    });
    const raw = sessionStorage.getItem('checkout_session');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).step).toBe('review');
  });
});

describe('clearCheckoutSession', () => {
  it('removes the checkout key from sessionStorage', () => {
    sessionStorage.setItem('checkout_session', '{"step":"review"}');
    clearCheckoutSession();
    expect(sessionStorage.getItem('checkout_session')).toBeNull();
  });
});
