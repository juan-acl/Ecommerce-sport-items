export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:orderId',
  NOT_FOUND: '*',
} as const;

export const buildRoute = {
  productDetail: (id: string) => `/products/${id}`,
  orderDetail: (orderId: string) => `/orders/${orderId}`,
};
