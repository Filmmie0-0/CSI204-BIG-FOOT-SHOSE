import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Container, Row, Col, Nav, Navbar, Button, Dropdown, Badge } from 'react-bootstrap';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', roles: ['admin', 'staff'] },
    { name: 'จัดการสินค้า', path: '/admin/products', icon: '📦', roles: ['admin', 'staff'] },
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
              <Button variant="light" className="rounded-circle p-2 d-flex align-items-center justify-content-center position-relative">
                🔔
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                  <span className="visually-hidden">New alerts</span>
                </span>
              </Button>
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
