import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cart, shippingAddress, paymentMethod, savePaymentMethod, clearCart } = useCartStore();
  const { userInfo } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 10000 ? 0 : 100; 
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrderHandler = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/orders', {
        orderItems: cart,
        shippingAddress,
        paymentMethod, // ส่งวิธีชำระเงินไปด้วย
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: userInfo ? userInfo._id : undefined
      });

      if (paymentMethod !== 'Credit / Debit Card') {
        clearCart();
      }
      navigate(`/order/${data._id}`); 
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่าง');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center mt-5" style={{ maxWidth: '600px' }}>
        <h2 className="display-6 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900 }}>Your cart is empty</h2>
        <Button 
          as={Link} 
          to="/" 
          variant="link" 
          className="text-muted text-uppercase text-decoration-none fw-bold hover-dark"
          style={{ letterSpacing: '1px' }}
        >
          Go back to shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: '1200px' }}>
      <h1 className="display-5 fw-black text-dark text-uppercase mb-5" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
        Order Summary
      </h1>

      <Row className="gy-4 gx-lg-5">
        <Col lg={8} className="d-flex flex-column gap-4">
          
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Shipping Details</h2>
              <p className="text-secondary fs-6 mb-0 lh-lg">
                <span className="fw-bold text-dark me-2">Address:</span>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                <br />
                <span className="fw-bold text-dark me-2">Phone:</span>
                {shippingAddress.phoneNumber}
              </p>
            </Card.Body>
          </Card>

          {/* --- เพิ่มกล่องเลือกวิธีชำระเงิน --- */}
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Payment Method</h2>
              <div className="d-flex flex-column gap-3">
                <Form.Check 
                  type="radio" 
                  id="payment-promptpay"
                  name="paymentMethod" 
                  value="PromptPay / Bank Transfer" 
                  checked={paymentMethod === 'PromptPay / Bank Transfer'}
                  onChange={(e) => savePaymentMethod(e.target.value)}
                  label={<span className="fw-medium text-dark ms-2">PromptPay / Bank Transfer</span>}
                  className="cursor-pointer mb-2 custom-radio"
                />
                
                <Form.Check 
                  type="radio"
                  id="payment-card"
                  name="paymentMethod" 
                  value="Credit / Debit Card" 
                  checked={paymentMethod === 'Credit / Debit Card'}
                  onChange={(e) => savePaymentMethod(e.target.value)}
                  label={<span className="fw-medium text-dark ms-2">Credit / Debit Card</span>}
                  className="cursor-pointer mb-2 custom-radio"
                />

                <Form.Check 
                  type="radio"
                  id="payment-cod"
                  name="paymentMethod" 
                  value="Cash On Delivery" 
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={(e) => savePaymentMethod(e.target.value)}
                  label={<span className="fw-medium text-dark ms-2">Cash On Delivery</span>}
                  className="cursor-pointer custom-radio"
                />
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Order Items</h2>
              <div className="d-flex flex-column gap-3">
                {cart.map((item, index) => (
                  <div key={index} className={`d-flex align-items-center py-3 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="flex-shrink-0 bg-light rounded-3 overflow-hidden border" style={{ width: '64px', height: '64px' }}>
                      <img src={item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} alt={item.name} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="ms-4 flex-grow-1">
                      <Link to={`/product/${item._id}`} className="text-dark text-decoration-none text-uppercase fw-bold hover-primary" style={{ fontSize: '0.9rem' }}>
                        {item.name}
                      </Link>
                      <div className="mt-1">
                        <span className="text-muted small fw-medium">Size: {item.selectedSize}</span>
                      </div>
                    </div>
                    <div className="text-end ms-3">
                      <div className="text-muted small fw-medium mb-1">{item.qty} x ฿{item.price.toLocaleString()}</div>
                      <div className="fw-bold text-dark">฿{(item.qty * item.price).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="rounded-4 border-0 shadow-sm bg-light sticky-top" style={{ top: '2rem' }}>
            <Card.Body className="p-4 p-md-5">
              <h4 className="fs-5 fw-black text-dark text-uppercase border-bottom pb-3 mb-4">Order Total</h4>
              
              {error && <Alert variant="danger" className="border-0 shadow-sm py-2 px-3 fw-medium small mb-4">{error}</Alert>}

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium small">Items Subtotal</span>
                  <span className="fw-bold text-dark">฿{itemsPrice.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="text-muted fw-medium small">Shipping</span>
                  <span className="fw-bold text-dark">
                    {shippingPrice === 0 ? <Badge bg="success" className="bg-opacity-10 text-success text-uppercase border border-success border-opacity-25 px-2 py-1">Free</Badge> : `฿${shippingPrice.toLocaleString()}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="fs-5 fw-black text-dark text-uppercase">Total</span>
                  <span className="fs-4 fw-black text-dark">฿{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="dark"
                  size="lg"
                  disabled={loading}
                  onClick={placeOrderHandler}
                  className="w-100 py-3 rounded-4 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2 shadow"
                  style={{ letterSpacing: '1px' }}
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrder;