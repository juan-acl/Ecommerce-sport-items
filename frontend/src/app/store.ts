import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/store/authSlice';
import localCartReducer from '@features/cart/store/cartSlice';
import { authApi } from '@features/auth/api/authApi';
import { productsApi } from '@features/products/api/productsApi';
import { cartApi } from '@features/cart/api/cartApi';
import { ordersApi } from '@features/orders/api/ordersApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    localCart: localCartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      cartApi.middleware,
      ordersApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
