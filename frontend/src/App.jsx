import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import PlaceOrder from './pages/PlaceOrder';
import OrderDetail from './pages/OrderDetail';

// Admin Components
import AdminLayout from './components/AdminLayout';
import AdminDashboardHome from './pages/AdminDashboardHome';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminStaff from './pages/AdminStaff';
import AdminInfo from './pages/AdminInfo';
import ProductEdit from './pages/ProductEdit';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen font-sans ${isAdminRoute ? 'bg-[#fdf5e6]' : 'bg-white'}`}>
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          {/* Public / Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Home />} />
          <Route path="/women" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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