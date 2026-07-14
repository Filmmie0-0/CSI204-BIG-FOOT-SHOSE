import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Card, Table, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';

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
    return (
      <div className="text-center py-5">
        <Alert variant="danger" className="fw-bold fs-5 shadow-sm border-0 rounded-4">ไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)</Alert>
      </div>
    );
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

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" />
      <div className="mt-3 text-muted fw-medium">Loading Staff...</div>
    </div>
  );
  if (error) return <Alert variant="danger" className="text-center mt-4 border-0 shadow-sm rounded-4">{error}</Alert>;

  return (
    <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Header className="bg-white border-bottom px-4 py-4">
        <h5 className="mb-0 fw-bold text-dark">รายการผู้ใช้ / จัดการสิทธิ์</h5>
      </Card.Header>
      
      <Card.Body className="p-0">
        <div className="d-flex gap-2 p-4 bg-light border-bottom">
          <Form.Control type="text" placeholder="ค้นหาด้วย ชื่อ/อีเมล..." className="w-auto shadow-none focus-ring rounded-pill px-4 border-white" style={{ '--bs-focus-ring-color': 'rgba(255, 122, 89, 0.25)' }} />
          <Button className="fw-bold rounded-pill px-4 shadow-sm hover-translate-y text-white border-0" style={{ backgroundColor: '#FF7A59' }}>ค้นหา</Button>
        </div>

        <div className="table-responsive">
          <Table hover className="mb-0 align-middle text-nowrap">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>ID</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>User Info</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Role</th>
                <th className="px-4 py-3 text-end text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {Array.isArray(users) && users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3 text-muted" style={{ fontSize: '0.85rem' }}>#{user._id.substring(0, 6)}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,122,89,0.1)', color: '#FF7A59' }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{user.username}</div>
                        <div className="text-muted small">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      bg={user.role === 'admin' ? 'danger' : user.role === 'staff' ? 'warning' : 'secondary'} 
                      className={`px-3 py-2 rounded-pill fw-bold bg-opacity-10 border border-opacity-25 text-uppercase ${
                        user.role === 'admin' ? 'text-danger border-danger' : user.role === 'staff' ? 'text-warning border-warning' : 'text-secondary border-secondary'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Form.Select 
                      size="sm"
                      className="w-auto d-inline-block shadow-sm focus-ring rounded-pill px-3 border-light fw-medium bg-light" 
                      style={{ '--bs-focus-ring-color': 'rgba(255, 122, 89, 0.25)' }}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={user._id === userInfo._id || user.role === 'admin'} 
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      {user.role === 'admin' && <option value="admin">Admin</option>}
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdminStaff;
