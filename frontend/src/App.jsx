import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import PlaceOrder from './pages/PlaceOrder';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';

import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

// Admin Components
import AdminLayout from './components/AdminLayout';
import AdminDashboardHome from './pages/AdminDashboardHome';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminStaff from './pages/AdminStaff';
import AdminInfo from './pages/AdminInfo';
import ProductEdit from './pages/ProductEdit';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const theme = useThemeStore((state) => state.theme);
  const userInfo = useAuthStore((state) => state.userInfo);

  useEffect(() => {
    if (userInfo && userInfo.token) {
      useCartStore.getState().fetchBackendCart();
    }
  }, [userInfo]);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  let bgClass = '';
  if (isAdminRoute) {
    bgClass = theme === 'dark' ? 'bg-[#1a1a1a] text-white' : 'bg-[#fdf5e6]';
  } else {
    bgClass = theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-[#FF7A59]';
  }

  return (
    <div className={`min-h-screen font-sans ${bgClass} transition-colors duration-300`}>
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          {/* Public / Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order/:id" element={<OrderDetail />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="product/new" element={<ProductEdit />} />
            <Route path="product/:id/edit" element={<ProductEdit />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="info" element={<AdminInfo />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;