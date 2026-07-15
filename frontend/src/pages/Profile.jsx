import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import { UserCircle, Settings, ShoppingBag, ArrowRight, Camera } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, updateUserInfo } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);
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
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setUsername(userInfo.username);
      setEmail(userInfo.email);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);
    setUpdateError('');
    setMessage('');
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await api.post('/upload/profile', formData, config);
      // Update user profile with new image
      const updateRes = await api.put(`/users/${userInfo._id}`, { profile_image: data.image_url });
      updateUserInfo(updateRes.data);
      setMessage('อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว');
    } catch (err) {
      setUpdateError('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setUploadingImage(false);
    }
  };

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
      setPassword(''); 
      setConfirmPassword('');
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!userInfo) return null;

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-dark text-white' : 'bg-white';
  const inputClass = isDark ? 'bg-secondary text-white border-secondary' : 'bg-light border-0';

  return (
    <Container className="py-5" style={{ maxWidth: '1200px' }}>
      <div className="d-flex align-items-center gap-4 mb-5">
        <div className="position-relative">
          {userInfo.profile_image ? (
            <img 
              src={userInfo.profile_image} 
              alt="Profile" 
              className="rounded-circle object-fit-cover shadow"
              style={{ width: '80px', height: '80px', border: '3px solid var(--bs-body-bg)' }}
            />
          ) : (
            <UserCircle size={80} className={isDark ? "text-white" : "text-dark"} strokeWidth={1.5} />
          )}
          <label 
            htmlFor="profile-image-upload" 
            className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2 shadow-sm border border-2 border-white d-flex align-items-center justify-content-center"
            style={{ cursor: 'pointer', transform: 'translate(10%, 10%)', transition: 'all 0.2s', width: '32px', height: '32px' }}
          >
            {uploadingImage ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
            ) : (
              <Camera size={14} />
            )}
            <input 
              id="profile-image-upload" 
              type="file" 
              accept="image/*" 
              className="d-none" 
              onChange={handleImageUpload} 
              disabled={uploadingImage}
            />
          </label>
        </div>
        <div>
          <h1 className="display-6 fw-black text-uppercase mb-0" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
            My Profile
          </h1>
          <p className="text-muted mb-0">Welcome back, {userInfo.username}</p>
        </div>
      </div>

      <Row className="gy-5 gx-lg-5">
        {/* คอลัมน์ซ้าย: ฟอร์มแก้ไขข้อมูล */}
        <Col lg={4} className="mb-4 mb-lg-0">
          <Card className={`border-0 shadow-sm rounded-4 ${cardBg} sticky-top`} style={{ top: '2rem' }}>
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-opacity-25">
                <Settings size={20} />
                <h2 className="fs-5 fw-bold text-uppercase mb-0" style={{ letterSpacing: '1px' }}>Edit Details</h2>
              </div>
              
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
                    className={`py-3 px-4 shadow-sm focus-ring rounded-3 ${inputClass}`}
                    style={{ '--bs-focus-ring-color': isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={userInfo?.role === 'staff'}
                    className={`py-3 px-4 shadow-sm focus-ring rounded-3 ${inputClass}`}
                    style={{ '--bs-focus-ring-color': isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`py-3 px-4 shadow-sm focus-ring rounded-3 ${inputClass}`}
                    style={{ '--bs-focus-ring-color': isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`py-3 px-4 shadow-sm focus-ring rounded-3 ${inputClass}`}
                    style={{ '--bs-focus-ring-color': isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(33, 37, 41, 0.25)' }}
                  />
                </Form.Group>
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant={isDark ? "light" : "dark"}
                    size="lg"
                    disabled={updateLoading}
                    className="w-100 py-3 rounded-pill fw-bold text-uppercase shadow-sm transition-all"
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
          <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-opacity-25">
            <ShoppingBag size={24} />
            <h2 className="fs-4 fw-black text-uppercase mb-0">Order History</h2>
          </div>
          
          {loadingOrders ? (
            <p className="text-muted">Loading orders...</p>
          ) : ordersError ? (
            <p className="text-danger">{ordersError}</p>
          ) : orders.length === 0 ? (
            <Card className={`border-0 shadow-sm rounded-4 text-center p-5 ${cardBg}`}>
              <Card.Body>
                <ShoppingBag size={48} className="text-muted mb-3 opacity-50" />
                <p className="text-muted fs-5 mb-4">You haven't placed any orders yet.</p>
                <Button 
                  as={Link} 
                  to="/" 
                  variant={isDark ? "light" : "dark"}
                  className="px-4 py-2 rounded-pill text-uppercase fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                  style={{ letterSpacing: '1px' }}
                >
                  Start Shopping <ArrowRight size={18} />
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Card className={`border-0 shadow-sm rounded-4 overflow-hidden ${cardBg}`}>
              <Table responsive hover variant={isDark ? "dark" : "light"} className="mb-0 align-middle text-nowrap">
                <thead className="text-muted fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
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
                      <td className="py-3 px-4 fw-medium">{order._id.substring(0, 8)}...</td>
                      <td className="py-3 px-4 text-secondary">{new Date(order.created_at || order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 fw-bold">฿{(order.total_amount || 0).toLocaleString()}</td>
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
                          <Badge bg="warning" className="bg-opacity-10 text-warning border border-warning border-opacity-25 px-2 py-1">No</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-end">
                        <Link to={`/order/${order._id}`} className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-dark'} rounded-pill fw-bold text-uppercase px-3`} style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
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