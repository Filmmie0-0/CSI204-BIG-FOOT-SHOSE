import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { data } = await api.post('/users/forgot-password', { email });
      setSuccess(true);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งคำขอ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
      <Card className="w-100 border-0 shadow-lg rounded-4 position-relative overflow-hidden" style={{ maxWidth: '450px' }}>
        <div className="position-absolute bg-primary rounded-circle" style={{ width: '150px', height: '150px', top: '-50px', right: '-50px', filter: 'blur(50px)', opacity: 0.1, pointerEvents: 'none' }}></div>
        
        <Card.Body className="p-4 p-sm-5">
          <div className="text-center mb-4">
            <h2 className="fs-3 fw-black text-dark text-uppercase position-relative d-inline-block mb-2" style={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
              Forgot Password
              <div className="position-absolute bottom-0 start-50 translate-middle-x bg-dark rounded-pill" style={{ width: '2rem', height: '4px', marginBottom: '-4px' }}></div>
            </h2>
            <p className="text-muted fw-medium small mb-0 mt-3">
              Enter your email to receive a password reset link
            </p>
          </div>
          
          {success ? (
            <div className="text-center mt-4">
              <Alert variant="success" className="border-0 shadow-sm fw-bold small rounded-3 py-3 text-center">
                <div className="fs-1 mb-2">✅</div>
                <div>Simulated Email Sent!</div>
                <div className="text-muted mt-2 fw-normal" style={{ fontSize: '0.8rem' }}>
                  In a real application, an email would be sent to <strong>{email}</strong>.
                  For this demo, please click the link below to reset your password.
                </div>
              </Alert>
              {resetToken && (
                <Link to={`/reset-password/${resetToken}`} className="btn btn-dark btn-lg w-100 py-3 rounded-3 fw-bold text-uppercase shadow-sm mt-3" style={{ letterSpacing: '1px' }}>
                  Mock Email Reset Link
                </Link>
              )}
            </div>
          ) : (
            <Form onSubmit={submitHandler} className="mt-4 pt-2">
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
  
              <div className="pt-3">
                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  disabled={loading || !email}
                  className="w-100 py-3 rounded-3 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2 shadow-sm hover-translate-y transition-all"
                  style={{ letterSpacing: '1.5px' }}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </div>
            </Form>
          )}

          <div className="mt-4 text-center small pt-2">
            <Link to="/login" className="text-muted fw-bold text-decoration-none hover-primary transition-colors">
              &larr; Back to Login
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
