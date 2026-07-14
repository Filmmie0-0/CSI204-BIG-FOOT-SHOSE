import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';

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
    <Container className="py-5" style={{ maxWidth: '1200px' }}>
      <h1 className="display-5 fw-black text-dark text-uppercase mb-5" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
        My Profile
      </h1>

      <Row className="gy-5 gx-lg-5">
        
        {/* คอลัมน์ซ้าย: ฟอร์มแก้ไขข้อมูล */}
        <Col lg={4} className="mb-4 mb-lg-0">
          <Card className="border-0 shadow-sm rounded-4 bg-light sticky-top" style={{ top: '2rem' }}>
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4 pb-3 border-bottom" style={{ letterSpacing: '1px' }}>Edit Details</h2>
              
              {message && <Alert variant="success" className="border-0 shadow-sm py-2 px-3 fw-medium small mb-4">{message}</Alert>}
              {updateError && <Alert variant="danger" className="border-0 shadow-sm py-2 px-3 fw-medium small mb-4">{updateError}</Alert>}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="py-3 px-4 bg-white border-0 shadow-sm focus-ring rounded-3"
                    style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-3 px-4 bg-white border-0 shadow-sm focus-ring rounded-3"
                    style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="ปล่อยว่างหากไม่ต้องการเปลี่ยน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-3 px-4 bg-white border-0 shadow-sm focus-ring rounded-3"
                    style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="py-3 px-4 bg-white border-0 shadow-sm focus-ring rounded-3"
                    style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="dark"
                    size="lg"
                    disabled={updateLoading}
                    className="w-100 py-3 rounded-pill fw-bold text-uppercase shadow-sm hover-translate-y transition-all"
                    style={{ letterSpacing: '1px' }}
                  >
                    {updateLoading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* คอลัมน์ขวา: ตารางประวัติการสั่งซื้อ */}
        <Col lg={8}>
          <h2 className="fs-4 fw-black text-dark text-uppercase mb-4 pb-2 border-bottom d-inline-block">Order History</h2>
          
          {loadingOrders ? (
            <p className="text-muted">Loading orders...</p>
          ) : ordersError ? (
            <p className="text-danger">{ordersError}</p>
          ) : orders.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-4 bg-light text-center p-5">
              <Card.Body>
                <p className="text-muted fs-5 mb-4">You haven't placed any orders yet.</p>
                <Button 
                  as={Link} 
                  to="/" 
                  variant="dark"
                  className="px-4 py-2 rounded-pill text-uppercase fw-bold shadow-sm"
                  style={{ letterSpacing: '1px' }}
                >
                  Start Shopping
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Table responsive hover className="mb-0 border-light align-middle text-nowrap">
                <thead className="bg-light text-muted fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
                  <tr>
                    <th className="py-3 px-4 border-0">Order ID</th>
                    <th className="py-3 px-4 border-0">Date</th>
                    <th className="py-3 px-4 border-0">Total</th>
                    <th className="py-3 px-4 border-0">Paid</th>
                    <th className="py-3 px-4 border-0">Delivered</th>
                    <th className="py-3 px-4 border-0 text-end">Action</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-3 px-4 fw-medium text-dark">{order._id.substring(0, 8)}...</td>
                      <td className="py-3 px-4 text-secondary">{new Date(order.created_at || order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 fw-bold text-dark">฿{(order.total_amount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {order.order_status !== 'pending' ? (
                          <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">Yes</Badge>
                        ) : (
                          <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">No</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {order.order_status === 'delivered' ? (
                          <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">Yes</Badge>
                        ) : (
                          <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">No</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-dark rounded-pill fw-bold text-uppercase px-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;