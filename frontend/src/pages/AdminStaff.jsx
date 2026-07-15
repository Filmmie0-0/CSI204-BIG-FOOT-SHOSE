import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Card, Table, Button, Badge, Spinner, Alert, Form, Modal } from 'react-bootstrap';

const AdminStaff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuthStore();

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'staff' });
  const [creating, setCreating] = useState(false);

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

  const handleDeleteUser = async (userId) => {
    if (window.confirm('ยืนยันการลบผู้ใช้งานรายนี้?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.delete(`/admin/users/${userId}`, config);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน');
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await api.post('/admin/users', newUser, config);
      setShowModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'staff' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มพนักงาน');
    } finally {
      setCreating(false);
    }
  };

  if (userInfo?.role !== 'admin') {
    return (
      <div className="text-center py-5">
        <Alert variant="danger" className="fw-bold fs-5 shadow-sm border-0 rounded-4">ไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)</Alert>
      </div>
    );
  }

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" />
      <div className="mt-3 text-muted fw-medium">Loading Staff...</div>
    </div>
  );
  if (error) return <Alert variant="danger" className="text-center mt-4 border-0 shadow-sm rounded-4">{error}</Alert>;

  return (
    <>
      <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
        <Card.Header className="bg-white border-bottom px-4 py-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">รายการผู้ใช้ / จัดการสิทธิ์</h5>
          <Button 
            className="fw-bold shadow-sm rounded-pill px-4 text-white border-0" 
            style={{ backgroundColor: '#FF7A59' }}
            onClick={() => setShowModal(true)}
          >
            + เพิ่มพนักงาน
          </Button>
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
                      <div className="d-flex gap-2 justify-content-end align-items-center">
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
                        
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="text-danger fw-bold rounded-pill px-3 shadow-sm"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === userInfo._id || user.role === 'admin'}
                        >
                          ลบ
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold">เพิ่มพนักงานใหม่</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-secondary">Username</Form.Label>
              <Form.Control 
                type="text" 
                required 
                value={newUser.username} 
                onChange={(e) => setNewUser({...newUser, username: e.target.value})} 
                className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-secondary">Email</Form.Label>
              <Form.Control 
                type="email" 
                required 
                value={newUser.email} 
                onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-secondary">Password</Form.Label>
              <Form.Control 
                type="password" 
                required 
                value={newUser.password} 
                onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }} 
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium text-secondary">Role</Form.Label>
              <Form.Select 
                value={newUser.role} 
                onChange={(e) => setNewUser({...newUser, role: e.target.value})} 
                className="shadow-none focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 127, 80, 0.25)' }}
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button 
              type="submit" 
              className="w-100 fw-bold border-0 py-2 rounded-pill text-white" 
              style={{ backgroundColor: '#FF7A59' }}
              disabled={creating}
            >
              {creating ? 'กำลังสร้าง...' : 'บันทึกข้อมูล'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminStaff;
