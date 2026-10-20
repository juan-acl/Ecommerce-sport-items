import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { Action, Reducer } from '@reduxjs/toolkit';
import authReducer, { logout } from '@features/auth/store/authSlice';
import { authApi } from '@features/auth/api/authApi';
import { usersApi } from '@features/users/api/usersApi';
import { productsApi } from '@features/products/api/productsApi';
import { clientsApi } from '@features/clients/api/clientsApi';
import { ordersApi } from '@features/orders/api/ordersApi';
import { rolesApi } from '@features/roles/api/rolesApi';
import { suppliersApi } from '@features/suppliers/api/suppliersApi';
import { purchasesApi } from '@features/purchases/api/purchasesApi';
import { inventoryApi } from '@features/inventory/api/inventoryApi';
import { discountsApi } from '@features/discounts/api/discountsApi';
import { reportsApi } from '@features/reports/api/reportsApi';
import { auditApi } from '@features/audit/api/auditApi';

const combinedReducer = combineReducers({
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
  [discountsApi.reducerPath]: discountsApi.reducer,
  [reportsApi.reducerPath]: reportsApi.reducer,
  [auditApi.reducerPath]: auditApi.reducer,
});

type RootReducerState = Parameters<typeof combinedReducer>[0];

// On logout, pass undefined so every reducer (including RTK Query caches) resets to initial state
const rootReducer: Reducer = (state: RootReducerState, action: Action) => {
  if (action.type === logout.type) {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
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
      discountsApi.middleware,
      reportsApi.middleware,
      auditApi.middleware,
    ),
});

export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof store.dispatch;
