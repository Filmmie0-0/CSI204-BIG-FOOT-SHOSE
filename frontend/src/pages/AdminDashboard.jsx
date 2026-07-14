import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { userInfo } = useAuthStore(); // ดึงข้อมูล User มาเช็ค

  // ฟังก์ชันดึงข้อมูลออเดอร์ทั้งหมด
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
    } finally {
      setLoading(false);
    }
  };

  // --- ระบบป้องกันคนที่ไม่ใช่ Admin เข้าถึง ---
  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'staff')) {
      navigate('/'); // ไม่ใช่ Admin เตะกลับหน้าแรก
    } else {
      fetchOrders(); // ถ้าใช่ Admin ถึงจะดึงข้อมูล
    }
  }, [userInfo, navigate]);

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

  if (loading) return <div className="text-center py-20">Loading Dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
          Admin Dashboard
        </h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded">
          Total Orders: <span className="font-bold text-black">{orders.length}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 text-left">ID</th>
                <th scope="col" className="px-6 py-4 text-left">User</th>
                <th scope="col" className="px-6 py-4 text-left">Date</th>
                <th scope="col" className="px-6 py-4 text-left">Total</th>
                <th scope="col" className="px-6 py-4 text-center">Paid</th>
                <th scope="col" className="px-6 py-4 text-center">Delivered</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {order._id.substring(0, 6)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {order.user ? order.user.username : 'Guest'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    ฿{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {order.isPaid ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <button onClick={() => markAsPaid(order._id)} className="px-2 py-1 text-xs font-semibold rounded border border-gray-300 hover:bg-black hover:text-white transition-colors">
                        Mark Paid
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {order.isDelivered ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <button onClick={() => markAsDelivered(order._id)} className="px-2 py-1 text-xs font-semibold rounded border border-gray-300 hover:bg-black hover:text-white transition-colors">
                        Mark Delivered
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <Link to={`/order/${order._id}`} className="text-black hover:underline mr-4">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;