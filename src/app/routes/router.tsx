import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';

// Lazy-loaded route components (code splitting)
const ProductListPage = lazy(() => import('@features/products/components/ProductListPage'));
const ProductDetailPage = lazy(() => import('@features/products/components/ProductDetailPage'));
const CartPage = lazy(() => import('@features/cart/components/CartPage'));
const OrderHistoryPage = lazy(() => import('@features/orders/components/OrderHistoryPage'));

function SuspenseWrapper() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <SuspenseWrapper />,
        children: [
          { index: true, element: <ProductListPage /> },
          { path: 'products', element: <ProductListPage /> },
          { path: 'products/:id', element: <ProductDetailPage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'orders', element: <OrderHistoryPage /> },
        ],
      },
    ],
  },
]);
