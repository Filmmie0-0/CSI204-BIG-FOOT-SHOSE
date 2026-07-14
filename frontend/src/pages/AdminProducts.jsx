import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuthStore();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.role !== 'admin') {
      return; // If not admin, the App component or Layout could handle it, or we can just return empty
    }
    fetchProducts();
  }, [userInfo]);

  if (userInfo?.role !== 'admin') {
    return <div className="text-center py-20 text-red-500 font-bold text-xl">ไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)</div>;
  }

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

  if (loading) return <div className="text-center py-10">Loading Products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#ffcfc0] overflow-hidden">
      <div className="bg-[#ffcfc0] px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">จัดการสินค้า</h2>
        <Link 
          to="/admin/product/new" 
          className="bg-[#ff7f50] hover:bg-[#ff632c] text-white px-4 py-2 rounded font-medium text-sm transition"
        >
          + เพิ่มสินค้า
        </Link>
      </div>
      
      <div className="overflow-x-auto p-4">
        <table className="min-w-full">
          <thead className="bg-[#fdf5e6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider rounded-tl">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#ff632c] uppercase tracking-wider rounded-tr">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id.substring(0, 6)}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-3">
                  <img src={product.image_url || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                  <span>{product.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">฿{product.price.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <Link to={`/admin/product/${product._id}/edit`} className="text-[#ff7f50] hover:text-[#ff4500] font-medium mr-4">Edit</Link>
                  <button onClick={() => deleteProduct(product._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
