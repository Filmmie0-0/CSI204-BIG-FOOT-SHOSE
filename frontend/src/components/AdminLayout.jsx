import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Container, Row, Col, Nav, Navbar, Button, Dropdown, Badge } from 'react-bootstrap';
import api from '../utils/api';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'staff')) {
      const fetchNotifications = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await api.get('/admin/dashboard', config);
          if (data.lowStockItems) {
            setNotifications(data.lowStockItems);
          }
        } catch (error) {
          console.error('Failed to fetch notifications', error);
        }
      };
      fetchNotifications();
    }
  }, [userInfo]);

  const handleLogout = () => {
    logout();
    useCartStore.getState().resetCartLocally();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', roles: ['admin', 'staff'] },
    { name: 'จัดการสินค้า', path: '/admin/products', icon: '📦', roles: ['admin', 'staff'] },
    { name: 'จัดการหมวดหมู่', path: '/admin/categories', icon: '🏷️', roles: ['admin', 'staff'] },
    { name: 'จัดการสิทธิ์', path: '/admin/staff', icon: '👥', roles: ['admin'] },
    { name: 'จัดการคำสั่งซื้อ', path: '/admin/orders', icon: '📋', roles: ['admin', 'staff'] },
    { name: 'ดูข้อมูล', path: '/admin/info', icon: 'ℹ️', roles: ['admin'] },
    { name: 'โปรไฟล์ส่วนตัว', path: '/profile', icon: '👤', roles: ['admin', 'staff'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userInfo?.role));

  return (
    <Container fluid className="min-vh-100 p-0" style={{ backgroundColor: '#F5F5DC' }}>
      <Row className="g-0 min-vh-100">
        {/* Sidebar */}
        <Col md={3} lg={2} className="text-white d-flex flex-column shadow-lg z-2 position-relative" style={{ backgroundColor: '#FF7A59' }}>
          <div className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '76px', backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <Link to="/" className="text-white text-decoration-none fw-bold fs-5 d-flex align-items-center gap-2">
              <span className="fs-3">👟</span> BigFoot<span className="text-light opacity-75">{userInfo?.role === 'staff' ? 'Staff' : 'Admin'}</span>
            </Link>
          </div>

          <div className="px-3 pt-4 text-uppercase text-white-50 small fw-bold mb-2" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
            Menu
          </div>

          <Nav className="flex-column flex-grow-1 px-2 gap-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Nav.Link
                  as={Link}
                  key={item.name}
                  to={item.path}
                  className={`d-flex align-items-center px-3 py-2 rounded-3 fw-bold transition-all ${
                    isActive
                      ? ''
                      : 'text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#F5F5DC' : 'transparent',
                    color: isActive ? '#FF7A59' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span className="me-3 fs-6">{item.icon}</span>
                  <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                </Nav.Link>
              );
            })}
          </Nav>

          <div className="p-3 m-3 rounded-3" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <div className="d-flex align-items-center mb-3">
              <div
                className="rounded-circle bg-white fw-bold d-flex align-items-center justify-content-center me-3 shadow-sm"
                style={{ width: '40px', height: '40px', color: '#FF7A59' }}
              >
                {userInfo?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="mb-0 fw-bold text-truncate text-white" style={{ fontSize: '0.9rem' }}>{userInfo?.username}</p>
                <Badge bg={userInfo?.role === 'admin' ? 'danger' : 'warning'} text="dark" className="text-uppercase border border-white" style={{ fontSize: '0.65rem' }}>
                  {userInfo?.role}
                </Badge>
              </div>
            </div>
            <Button variant="outline-light" size="sm" className="w-100 d-flex align-items-center justify-content-center gap-2 border-white text-white hover-bg-white" onClick={handleLogout}>
              <span style={{ fontSize: '0.8rem' }}>Sign Out</span>
            </Button>
          </div>
        </Col>

        {/* Main Content Area */}
        <Col md={9} lg={10} className="d-flex flex-column h-100 min-vh-100">
          {/* Top Header */}
          <Navbar bg="white" className="px-4 shadow-sm py-3 border-bottom z-1 d-flex justify-content-between align-items-center">
            <h4 className="mb-0 fw-bold text-dark">
              {filteredNavItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h4>
            <div className="d-flex align-items-center gap-3">
              <style>
                {`
                  .no-caret::after {
                    display: none !important;
                  }
                `}
              </style>
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" className="no-caret rounded-circle p-2 d-flex align-items-center justify-content-center position-relative" style={{ width: '40px', height: '40px' }}>
                  🔔
                  {notifications.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '0.65rem' }}>
                      {notifications.length}
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  )}
                </Dropdown.Toggle>
                
                <Dropdown.Menu className="shadow-lg border-0 rounded-3 mt-2" style={{ minWidth: '320px', zIndex: 1050 }}>
                  <Dropdown.Header className="fw-bold text-dark border-bottom pb-2 mb-2 d-flex justify-content-between align-items-center">
                    <span style={{ fontSize: '0.9rem' }}>Notifications</span>
                    {notifications.length > 0 && <Badge bg="danger" pill>{notifications.length}</Badge>}
                  </Dropdown.Header>
                  
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted small">
                      <div className="fs-3 mb-2">🎉</div>
                      <div>No new notifications</div>
                    </div>
                  ) : (
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }} className="px-1">
                      {notifications.map(item => (
                        <Dropdown.Item 
                          key={item._id} 
                          as={Link} 
                          to={`/admin/product/${item._id}/edit`} 
                          className="py-2 border-bottom rounded-2 mb-1"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-danger bg-opacity-10 text-danger rounded flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                              ⚠️
                            </div>
                            <div className="overflow-hidden">
                              <div className="fw-bold text-dark small text-truncate">{item.name}</div>
                              <div className="text-danger small fw-medium mt-1">Low Stock: {item.countInStock} items left</div>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))}
                    </div>
                  )}
                  {notifications.length > 0 && (
                    <div className="p-2 border-top mt-1 text-center bg-light rounded-bottom-3">
                      <Button variant="link" size="sm" className="text-decoration-none fw-bold text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }} as={Link} to="/admin">
                        View Dashboard
                      </Button>
                    </div>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Navbar>

          {/* Content */}
          <div className="flex-grow-1 p-4 p-md-5 overflow-auto">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
