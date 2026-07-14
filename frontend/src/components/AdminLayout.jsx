import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', roles: ['admin', 'staff'] },
    { name: 'จัดการสินค้า', path: '/admin/products', icon: '📦', roles: ['admin'] },
    { name: 'จัดการสิทธิ์', path: '/admin/staff', icon: '👥', roles: ['admin'] },
    { name: 'จัดการคำสั่งซื้อ', path: '/admin/orders', icon: '📋', roles: ['admin', 'staff'] },
    { name: 'ดูข้อมูล', path: '/admin/info', icon: 'ℹ️', roles: ['admin'] },
  ];

  // กรองเมนูตาม role ของ user
  const filteredNavItems = navItems.filter(item => item.roles.includes(userInfo?.role));

  return (
    <div className="min-h-screen flex bg-[#fdf5e6]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#ff7f50] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-[#ff632c] flex items-center justify-center">
          <Link to="/" className="flex items-center bg-white p-2 rounded-lg shadow-sm">
            <img src="/logo.png" alt="Big Foot Shoes" className="h-12 w-auto" />
          </Link>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#fdf5e6] text-[#ff7f50] border-r-4 border-[#ff4500]' 
                    : 'text-white hover:bg-[#ff632c]'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#ff632c]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white text-[#ff7f50] flex items-center justify-center font-bold text-xl uppercase">
              {userInfo?.username?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium">{userInfo?.username}</p>
              <p className="text-xs text-white/70 capitalize">{userInfo?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-gray-800 text-white py-2 rounded transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-[#2c3e50] text-white py-3 px-8 shadow-md flex justify-between items-center">
          <div className="text-sm font-medium text-gray-300">
            {userInfo?.role === 'admin' ? 'Admin Panel' : 'Staff Panel'} <span className="mx-2 text-gray-500">|</span> {filteredNavItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
