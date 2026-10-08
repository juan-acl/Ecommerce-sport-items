import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/store/authSlice';
import { authApi } from '@features/auth/api/authApi';
import { usersApi } from '@features/users/api/usersApi';
import { productsApi } from '@features/products/api/productsApi';
import { clientsApi } from '@features/clients/api/clientsApi';
import { ordersApi } from '@features/orders/api/ordersApi';
import { rolesApi } from '@features/roles/api/rolesApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      productsApi.middleware,
      clientsApi.middleware,
      ordersApi.middleware,
      rolesApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
