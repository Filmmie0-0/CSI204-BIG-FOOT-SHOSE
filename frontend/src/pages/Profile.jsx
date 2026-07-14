import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, updateUserInfo } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  // State สำหรับฟอร์มแก้ไขข้อมูล
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      // ดึงข้อมูลเดิมมาแสดงในช่องกรอก
      setUsername(userInfo.username);
      setEmail(userInfo.email);

      // ดึงข้อมูลประวัติการสั่งซื้อ
      const fetchMyOrders = async () => {
        try {
          const { data } = await api.get(`/orders/myorders/${userInfo._id}`);
          setOrders(data);
        } catch (err) {
          setOrdersError('ไม่สามารถดึงข้อมูลประวัติการสั่งซื้อได้');
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [navigate, userInfo]);

  // ฟังก์ชันกดปุ่มอัปเดตข้อมูล
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setUpdateError('');

    if (password !== confirmPassword) {
      setUpdateError('รหัสผ่านไม่ตรงกัน กรุณาพิมพ์ใหม่');
      return;
    }

    setUpdateLoading(true);
    try {
      const { data } = await api.put(`/users/${userInfo._id}`, { 
        username, 
        email, 
        password 
      });
      
      updateUserInfo(data);
      setMessage('อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว');
      setPassword(''); // ล้างช่องรหัสผ่านเพื่อความปลอดภัย
      setConfirmPassword('');
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase mb-10">
        My Profile
      </h1>

      <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
        
        {/* คอลัมน์ซ้าย: ฟอร์มแก้ไขข้อมูล */}
        <div className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-4 tracking-wide">Edit Details</h2>
            
            {message && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-sm text-sm border border-green-200">{message}</div>}
            {updateError && <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-sm text-sm border border-red-200">{updateError}</div>}

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black sm:text-sm placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-black sm:text-sm placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={updateLoading}
                className={`w-full mt-4 py-3 rounded-sm text-sm font-medium text-white uppercase tracking-widest transition-colors ${
                  updateLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                }`}
              >
                {updateLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* คอลัมน์ขวา: ตารางประวัติการสั่งซื้อ (เหมือนเดิม) */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold text-gray-900 uppercase mb-6">Order History</h2>
          
          {loadingOrders ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : ordersError ? (
            <p className="text-red-500">{ordersError}</p>
          ) : orders.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
              <Link to="/" className="text-black font-medium underline uppercase text-sm tracking-widest hover:text-gray-600">Start Shopping</Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">฿{order.totalPrice.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.isPaid ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.isDelivered ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/order/${order._id}`} className="text-black hover:text-gray-500 underline uppercase tracking-wider text-xs">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;