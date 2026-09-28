export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export const DEFAULT_SHIPPING_ADDRESS: ShippingAddress = {
  street: 'Sin especificar',
  city: 'Guatemala',
  country: 'Guatemala',
  postalCode: '01001',
};
