import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { selectCustomerAuth } from '@/redux/customerAuth';
import { Spin } from 'antd';

const CustomerLogin = lazy(() => import('@/pages/CustomerPortal/CustomerLogin'));
const CustomerDashboard = lazy(() => import('@/pages/CustomerPortal/CustomerDashboard'));

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

export default function CustomerPortalApp() {
  const { isLoggedIn } = useSelector(selectCustomerAuth);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route
          index
          element={isLoggedIn ? <Navigate to="/customer-portal/dashboard" replace /> : <CustomerLogin />}
        />
        <Route
          path="dashboard"
          element={isLoggedIn ? <CustomerDashboard /> : <Navigate to="/customer-portal" replace />}
        />
        <Route
          path="*"
          element={isLoggedIn ? <CustomerDashboard /> : <CustomerLogin />}
        />
      </Routes>
    </Suspense>
  );
}
