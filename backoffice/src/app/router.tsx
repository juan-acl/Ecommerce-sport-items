import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '@shared/components/layout/AdminLayout';
import { GuestOnlyRoute } from '@features/auth/guards/GuestOnlyRoute';
import { AdminRoute } from '@features/auth/guards/AdminRoute';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { ProductsPage } from '@pages/ProductsPage';
import { UsersPage } from '@pages/UsersPage';
import { ClientsPage } from '@pages/ClientsPage';
import { OrdersPage } from '@pages/OrdersPage';
import { RolesPage } from '@pages/RolesPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ROUTES } from '@shared/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <GuestOnlyRoute>
        <LoginPage />
      </GuestOnlyRoute>
    ),
  },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
      { path: ROUTES.USERS, element: <UsersPage /> },
      { path: ROUTES.CLIENTS, element: <ClientsPage /> },
      { path: ROUTES.ORDERS, element: <OrdersPage /> },
      { path: ROUTES.ROLES, element: <RolesPage /> },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
]);
