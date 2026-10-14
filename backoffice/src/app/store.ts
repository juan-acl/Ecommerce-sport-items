import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/store/authSlice';
import { authApi } from '@features/auth/api/authApi';
import { usersApi } from '@features/users/api/usersApi';
import { productsApi } from '@features/products/api/productsApi';
import { clientsApi } from '@features/clients/api/clientsApi';
import { ordersApi } from '@features/orders/api/ordersApi';
import { rolesApi } from '@features/roles/api/rolesApi';
import { suppliersApi } from '@features/suppliers/api/suppliersApi';
import { purchasesApi } from '@features/purchases/api/purchasesApi';
import { inventoryApi } from '@features/inventory/api/inventoryApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [purchasesApi.reducerPath]: purchasesApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      productsApi.middleware,
      clientsApi.middleware,
      ordersApi.middleware,
      rolesApi.middleware,
      suppliersApi.middleware,
      purchasesApi.middleware,
      inventoryApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
