import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsPaid = async (id) => {
    if (window.confirm('ยืนยันการรับชำระเงิน?')) {
      try {
        await api.put(`/orders/${id}/pay`);
        fetchOrders(); 
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    }
  };

  const markAsDelivered = async (id) => {
    if (window.confirm('ยืนยันการจัดส่งสินค้า?')) {
      try {
        await api.put(`/orders/${id}/deliver`);
        fetchOrders();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    }
  };

  const deleteOrderHandler = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคำสั่งซื้อนี้?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบคำสั่งซื้อ');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading Orders...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#ffcfc0] overflow-hidden">
      <div className="bg-[#ffcfc0] px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">จัดการคำสั่งซื้อ</h2>
      </div>
      
      <div className="overflow-x-auto p-4">
        <div className="mb-4 flex space-x-2">
          {/* Mock filters matching screenshot style */}
          <input type="text" placeholder="ค้นหาด้วย ID/ชื่อลูกค้า" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#ff7f50]" />
          <select className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#ff7f50]">
            <option>ทั้งหมด</option>
            <option>รอชำระเงิน</option>
            <option>ชำระเงินแล้ว</option>
          </select>
        </div>

        <table className="min-w-full">
          <thead className="bg-[#fdf5e6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider rounded-tl">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#ff632c] uppercase tracking-wider rounded-tr">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id.substring(0, 6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.user_id ? order.user_id.username : 'Guest'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at || order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">฿{(order.total_amount || 0).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  {order.order_status !== 'pending' ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800 border border-green-200">Paid</span>
                  ) : (
                    <button onClick={() => markAsPaid(order._id)} className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition">Mark Paid</button>
                  )}
                  {order.order_status === 'delivered' ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 border border-blue-200">Sent</span>
                  ) : (
                    <button onClick={() => markAsDelivered(order._id)} className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition">Mark Sent</button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                  <Link to={`/order/${order._id}`} className="text-white bg-[#ff7f50] hover:bg-[#ff632c] px-3 py-1.5 rounded text-xs font-medium transition">View</Link>
                  <button onClick={() => deleteOrderHandler(order._id)} className="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-xs font-medium transition">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
