import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const AdminDashboardHome = () => {
  const { userInfo } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Just fetch orders and products to get a basic count for now
    // In a real app, you'd have a specific /api/admin/dashboard endpoint
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products')
        ]);
        
        const orders = ordersRes.data;
        const revenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);
        
        setStats({
          totalOrders: orders.length,
          totalProducts: productsRes.data.length,
          totalRevenue: revenue
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#ff7f50]">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#ff7f50]">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Products</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-[#ff7f50]">
          <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Revenue (Paid)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">฿{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Placeholder for chart matching mockup */}
      <div className="bg-white p-6 rounded-lg shadow-sm mt-8 border border-gray-100">
        <h3 className="text-gray-800 font-semibold mb-4">Revenue & Sales Chart</h3>
        <div className="h-64 bg-gray-50 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
          [ Chart Placeholder ]
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
