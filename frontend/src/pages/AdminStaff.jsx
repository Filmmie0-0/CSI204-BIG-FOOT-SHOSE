import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const AdminStaff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuthStore();

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.get('/admin/users', config);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลพนักงานได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.role !== 'admin') return;
    fetchUsers();
  }, [userInfo]);

  if (userInfo?.role !== 'admin') {
    return <div className="text-center py-20 text-red-500 font-bold text-xl">ไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)</div>;
  }

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`ยืนยันการเปลี่ยนสิทธิ์เป็น ${newRole}?`)) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.put(`/admin/users/${userId}/role`, { role: newRole }, config);
        fetchUsers();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading Staff...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#ffcfc0] overflow-hidden">
      <div className="bg-[#ffcfc0] px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">รายการพนักงาน / จัดการสิทธิ์</h2>
      </div>
      
      <div className="overflow-x-auto p-4">
        <div className="mb-4 flex space-x-2">
          {/* Mock filters */}
          <input type="text" placeholder="ค้นหาด้วย ชื่อ/อีเมล" className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#ff7f50]" />
          <button className="bg-[#ff7f50] text-white px-3 py-1.5 rounded text-sm hover:bg-[#ff632c] transition">ค้นหา</button>
        </div>

        <table className="min-w-full">
          <thead className="bg-[#fdf5e6]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider rounded-tl">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#ff632c] uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[#ff632c] uppercase tracking-wider rounded-tr">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.isArray(users) && users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id.substring(0, 6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'staff' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-[#ff7f50]"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={user._id === userInfo._id || user.role === 'admin'} 
                  >
                    <option value="customer">Customer</option>
                    <option value="staff">Staff</option>
                    {user.role === 'admin' && <option value="admin">Admin</option>}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStaff;
