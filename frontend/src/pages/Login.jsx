import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { userInfo, login } = useAuthStore();

  // เช็คตอนเปิดหน้าเว็บ ถ้าล็อกอินอยู่แล้วให้เด้งไปหน้าอื่น
  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'admin' || userInfo.role === 'staff') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data);
      
      // เช็ค Role หลังล็อกอินสำเร็จ
      if (data.role === 'admin' || data.role === 'staff') {
        navigate('/admin'); // ถ้าเป็นแอดมิน ไปหน้า Dashboard
      } else {
        navigate('/'); // ถ้าเป็นลูกค้า ไปหน้า Home
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <Card className="w-100 border-0 shadow-lg rounded-4 position-relative overflow-hidden" style={{ maxWidth: '450px' }}>
        {/* แสงเอฟเฟกต์มุมกล่อง เพิ่มมิติ */}
        <div className="position-absolute bg-primary rounded-circle" style={{ width: '150px', height: '150px', top: '-50px', right: '-50px', filter: 'blur(50px)', opacity: 0.1, pointerEvents: 'none' }}></div>
        
        <Card.Body className="p-4 p-sm-5">
          <div className="text-center mb-4">
            <h2 className="fs-3 fw-black text-dark text-uppercase position-relative d-inline-block mb-2" style={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
              Sign In
              <div className="position-absolute bottom-0 start-50 translate-middle-x bg-dark rounded-pill" style={{ width: '2rem', height: '4px', marginBottom: '-4px' }}></div>
            </h2>
            <p className="text-muted fw-medium small mb-0 mt-3">
              Access your Big Foot Shoes account
            </p>
          </div>
          
          <Form onSubmit={submitHandler} className="mt-4 pt-2">
            {/* กล่อง Error Message ดีไซน์ใหม่ */}
            {error && (
              <Alert variant="danger" className="d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm fw-bold small rounded-3 py-3">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </Alert>
            )}
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                Email address
              </Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="py-3 px-4 bg-light border-0 shadow-none focus-ring rounded-3"
                style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-muted text-uppercase small ms-1 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                Password
              </Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="py-3 px-4 bg-light border-0 shadow-none focus-ring rounded-3"
                style={{ '--bs-focus-ring-color': 'rgba(33, 37, 41, 0.25)' }}
              />
            </Form.Group>

            <div className="pt-3">
              <Button
                type="submit"
                variant="dark"
                size="lg"
                disabled={loading}
                className="w-100 py-3 rounded-3 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2 shadow-sm hover-translate-y transition-all"
                style={{ letterSpacing: '1.5px' }}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
            
          </Form>

          <div className="mt-5 text-center small border-top pt-4">
            <p className="text-muted fw-medium mb-0">
              New customer?{' '}
              <Link to="/register" className="fw-bold text-dark text-decoration-none hover-primary transition-colors border-bottom border-dark pb-1">
                Create an account
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;