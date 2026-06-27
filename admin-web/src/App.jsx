import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import AntdGlobalContext from './utils/AntdGlobalContext';
import { useAuthStore } from './features/auth/store/authStore';
import AdminLayout from './components/layout/AdminLayout';
import Login from './features/auth/pages/Login';
import Dashboard from './features/dashboard/pages/Dashboard';
import ProductList from './features/products/pages/ProductList';
import CategoryList from './features/products/pages/CategoryList';
import OrderList from './features/orders/pages/OrderList';
import OrderDetail from './features/orders/pages/OrderDetail';
import CustomerList from './features/customers/pages/CustomerList';
import VoucherList from './features/promotions/pages/VoucherList';
import FlashSaleList from './features/promotions/pages/FlashSaleList';
import CollectionList from './features/collections/pages/CollectionList';
import ReviewList from './features/reviews/pages/ReviewList';



// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};






function App() {
  return (
    <AntdApp>
      <AntdGlobalContext />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute>
            <AdminLayout>
              <ProductList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/categories" element={
          <ProtectedRoute>
            <AdminLayout>
              <CategoryList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/orders" element={
          <ProtectedRoute>
            <AdminLayout>
              <OrderList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <AdminLayout>
              <OrderDetail />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/customers" element={
          <ProtectedRoute>
            <AdminLayout>
              <CustomerList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/vouchers" element={
          <ProtectedRoute>
            <AdminLayout>
              <VoucherList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/flash-sales" element={
          <ProtectedRoute>
            <AdminLayout>
              <FlashSaleList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/collections" element={
          <ProtectedRoute>
            <AdminLayout>
              <CollectionList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/reviews" element={
          <ProtectedRoute>
            <AdminLayout>
              <ReviewList />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </AntdApp>
  );
}

export default App;
