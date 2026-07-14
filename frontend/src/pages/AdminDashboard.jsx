import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลสินค้าได้');
    }
  };

  useEffect(() => {
    if (!userInfo || (userInfo.role !== 'admin' && userInfo.role !== 'staff')) {
      navigate('/');
    } else {
      Promise.all([fetchOrders(), fetchProducts()]).finally(() => setLoading(false));
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

  const deleteProduct = async (id) => {
    if (window.confirm('ยืนยันการลบสินค้า?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.delete(`/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการลบสินค้า');
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
        {activeTab === 'products' && (
          <Link to="/admin/product/new" className="bg-black text-white px-4 py-2 text-sm uppercase font-semibold">
            + Add Product
          </Link>
        )}
      </div>

      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 uppercase font-bold text-sm ${activeTab === 'orders' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Orders ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`py-2 px-4 uppercase font-bold text-sm ${activeTab === 'products' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'}`}
        >
          Products ({products.length})
        </button>
      </div>

      {activeTab === 'orders' ? (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-center">Paid</th>
                  <th className="px-6 py-4 text-center">Delivered</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order._id.substring(0, 6)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{order.user ? order.user.username : 'Guest'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">฿{order.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {order.isPaid ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <button onClick={() => markAsPaid(order._id)} className="px-2 py-1 text-xs font-semibold rounded border border-gray-300 hover:bg-black hover:text-white transition-colors">Mark Paid</button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {order.isDelivered ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <button onClick={() => markAsDelivered(order._id)} className="px-2 py-1 text-xs font-semibold rounded border border-gray-300 hover:bg-black hover:text-white transition-colors">Mark Delivered</button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      <Link to={`/order/${order._id}`} className="text-black hover:underline mr-4">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product._id.substring(0, 6)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">฿{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      <Link to={`/admin/product/${product._id}/edit`} className="text-indigo-600 hover:underline mr-4">Edit</Link>
                      <button onClick={() => deleteProduct(product._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;