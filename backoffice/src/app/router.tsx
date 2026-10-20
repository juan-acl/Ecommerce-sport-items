import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "@shared/components/layout/AdminLayout";
import { GuestOnlyRoute } from "@features/auth/guards/GuestOnlyRoute";
import { AdminRoute } from "@features/auth/guards/AdminRoute";
import { ProtectedRoute } from "@features/auth/guards/ProtectedRoute";
import { LoginPage } from "@pages/LoginPage";
import { DashboardPage } from "@pages/DashboardPage";
import { ProductsPage } from "@pages/ProductsPage";
import { UsersPage } from "@pages/UsersPage";
import { ClientsPage } from "@pages/ClientsPage";
import { OrdersPage } from "@pages/OrdersPage";
import { RolesPage } from "@pages/RolesPage";
import { SuppliersPage } from "@pages/SuppliersPage";
import { PurchasesPage } from "@pages/PurchasesPage";
import { InventoryPage } from "@pages/InventoryPage";
import { AlertsPage } from "@pages/AlertsPage";
import { DiscountsPage } from "@pages/DiscountsPage";
import { ReportsPage } from "@pages/ReportsPage";
import { AuditPage } from "@pages/AuditPage";
import { NotFoundPage } from "@pages/NotFoundPage";
import { ROUTES } from "@shared/constants/routes";

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
      {
        index: true,
        element: (
          <ProtectedRoute module="dashboard">
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PRODUCTS,
        element: (
          <ProtectedRoute module="products">
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.USERS,
        element: (
          <ProtectedRoute module="users">
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.CLIENTS,
        element: (
          <ProtectedRoute module="clients">
            <ClientsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ORDERS,
        element: (
          <ProtectedRoute module="orders">
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ROLES,
        element: (
          <ProtectedRoute module="roles">
            <RolesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SUPPLIERS,
        element: (
          <ProtectedRoute module="suppliers">
            <SuppliersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PURCHASES,
        element: (
          <ProtectedRoute module="purchases">
            <PurchasesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.INVENTORY,
        element: (
          <ProtectedRoute module="inventory">
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ALERTS,
        element: (
          <ProtectedRoute module="alerts">
            <AlertsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.DISCOUNTS,
        element: (
          <ProtectedRoute module="discounts">
            <DiscountsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.REPORTS,
        element: (
          <ProtectedRoute module="reports">
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.AUDIT,
        element: (
          <ProtectedRoute module="audit">
            <AuditPage />
          </ProtectedRoute>
        ),
      },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
]);
