import { useCartStore } from '../store/cartStore'; 
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User } from 'lucide-react';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Big Foot Shoes" className="h-10 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors">New Arrivals</Link>
            <Link to="/men" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors">Men</Link>
            <Link to="/women" className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors">Women</Link>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-black hover:text-gray-500 transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            {userInfo ? (
              <div className="flex items-center space-x-4">
                
                {/* --- แสดงลิงก์ Dashboard ถ้าเป็น Admin/Staff --- */}
                {(userInfo.role === 'admin' || userInfo.role === 'staff') && (
                  <Link to="/admin" className="text-sm font-bold text-red-600 hover:text-red-800 hidden sm:block uppercase tracking-wide border-r border-gray-300 pr-4">
                    Dashboard
                  </Link>
                )}

                <Link to="/profile" className="text-sm font-medium text-gray-900 hover:text-gray-500 hidden sm:block uppercase tracking-wide">
                  Hi, {userInfo.username}
                </Link>
                <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-black hover:text-gray-500 transition-colors">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            )}

            <Link to="/cart" className="text-black hover:text-gray-500 transition-colors relative">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;