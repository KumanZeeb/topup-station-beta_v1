import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import AdminLayout from './components/Layout/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import ProductDetail from './pages/Products/ProductDetail';
import OrderList from './pages/Orders/OrderList';
import OrderDetail from './pages/Orders/OrderDetail';
import PaymentList from './pages/Payments/PaymentList';
import PaymentVerification from './pages/Payments/PaymentVerification';
import UserList from './pages/Users/UserList';
import UserDetail from './pages/Users/UserDetail';
import PromotionList from './pages/Promotions/PromotionList';
import PromotionForm from './pages/Promotions/PromotionForm';
import TicketList from './pages/Support/TicketList';
import TicketDetail from './pages/Support/TicketDetail';
import SalesReport from './pages/Reports/SalesReport';
import ProductReport from './pages/Reports/ProductReport';
import GeneralSettings from './pages/Settings/GeneralSettings';
import PaymentSettings from './pages/Settings/PaymentSettings';

// Auth
import AdminLogin from './pages/Auth/AdminLogin';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        
        {/* Products */}
        <Route path="products">
          <Route index element={<ProductList />} />
          <Route path="new" element={<ProductForm />} />
          <Route path="edit/:id" element={<ProductForm />} />
          <Route path=":id" element={<ProductDetail />} />
        </Route>
        
        {/* Orders */}
        <Route path="orders">
          <Route index element={<OrderList />} />
          <Route path=":id" element={<OrderDetail />} />
        </Route>
        
        {/* Payments */}
        <Route path="payments">
          <Route index element={<PaymentList />} />
          <Route path="verification" element={<PaymentVerification />} />
        </Route>
        
        {/* Users */}
        <Route path="users">
          <Route index element={<UserList />} />
          <Route path=":id" element={<UserDetail />} />
        </Route>
        
        {/* Promotions */}
        <Route path="promotions">
          <Route index element={<PromotionList />} />
          <Route path="new" element={<PromotionForm />} />
          <Route path="edit/:id" element={<PromotionForm />} />
        </Route>
        
        {/* Support */}
        <Route path="support">
          <Route index element={<TicketList />} />
          <Route path=":id" element={<TicketDetail />} />
        </Route>
        
        {/* Reports */}
        <Route path="reports">
          <Route path="sales" element={<SalesReport />} />
          <Route path="products" element={<ProductReport />} />
        </Route>
        
        {/* Settings */}
        <Route path="settings">
          <Route path="general" element={<GeneralSettings />} />
          <Route path="payment" element={<PaymentSettings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;