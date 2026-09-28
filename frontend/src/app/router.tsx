import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@shared/components/layout/MainLayout';
import { GuestOnlyRoute } from '@features/auth/guards/GuestOnlyRoute';
import { ProtectedRoute } from '@features/auth/guards/ProtectedRoute';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { OrderHistoryPage } from '@pages/OrderHistoryPage';
import { OrderDetailPage } from '@pages/OrderDetailPage';
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
    path: ROUTES.REGISTER,
    element: (
      <GuestOnlyRoute>
        <RegisterPage />
      </GuestOnlyRoute>
    ),
  },
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <ProductsPage /> },
      { path: ROUTES.PRODUCTS, element: <ProductsPage /> },
      { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetailPage /> },
      { path: ROUTES.CART, element: <CartPage /> },
      {
        path: ROUTES.CHECKOUT,
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ORDERS,
        element: (
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ORDER_DETAIL,
        element: (
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },
]);
