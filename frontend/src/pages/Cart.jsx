import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty, removeFromCart } = useCartStore();
  const { userInfo } = useAuthStore();

  // คำนวณราคารวมทั้งหมด
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!userInfo) {
    return (
      <Container className="py-5 text-center mt-5" style={{ maxWidth: '600px' }}>
        <div className="d-inline-flex p-4 rounded-circle bg-light text-secondary mb-4">
          <ShoppingBag size={64} strokeWidth={1.5} />
        </div>
        <h2 className="display-6 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900 }}>Please Login</h2>
        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
          You need to be logged in to view and manage your shopping cart.
        </p>
        <Button 
          as={Link} 
          to="/login" 
          variant="dark" 
          size="lg" 
          className="px-5 py-3 rounded-pill text-uppercase fw-bold shadow-sm"
          style={{ letterSpacing: '1px' }}
        >
          Login Now
        </Button>
      </Container>
    );
  }

  if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'staff')) {
    return (
      <Container className="py-5 text-center mt-5" style={{ maxWidth: '600px' }}>
        <div className="d-inline-flex p-4 rounded-circle bg-light text-secondary mb-4">
          <ShoppingBag size={64} strokeWidth={1.5} />
        </div>
        <h2 className="display-6 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900 }}>Admin View</h2>
        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
          Administrators and staff members cannot make purchases.
        </p>
        <Button 
          as={Link} 
          to="/admin" 
          variant="dark" 
          size="lg" 
          className="px-5 py-3 rounded-pill text-uppercase fw-bold shadow-sm"
          style={{ letterSpacing: '1px' }}
        >
          Go to Dashboard
        </Button>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center mt-5" style={{ maxWidth: '600px' }}>
        <div className="d-inline-flex p-4 rounded-circle bg-light text-secondary mb-4">
          <ShoppingBag size={64} strokeWidth={1.5} />
        </div>
        <h2 className="display-6 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900 }}>Your cart is empty</h2>
        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
          Looks like you haven't added any premium footwear to your cart yet. Let's find your match!
        </p>
        <Button 
          as={Link} 
          to="/" 
          variant="dark" 
          size="lg" 
          className="px-5 py-3 rounded-pill text-uppercase fw-bold shadow-sm"
          style={{ letterSpacing: '1px' }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: '1200px' }}>
      <div className="mb-5 border-bottom pb-3">
        <span className="text-primary fw-bold text-uppercase small" style={{ letterSpacing: '1px' }}>Your Selection</span>
        <h1 className="display-5 fw-black text-dark text-uppercase position-relative d-inline-block mt-1 mb-0" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
          Shopping Cart
          <div className="position-absolute bottom-0 start-0 bg-dark rounded-pill" style={{ width: '3rem', height: '4px', marginBottom: '-4px' }}></div>
        </h1>
      </div>

      <Row className="gy-5 gx-lg-5">
        {/* รายการสินค้า */}
        <Col lg={8}>
          <div className="d-flex flex-column gap-4 border-bottom pb-4">
            {cart.map((item) => (
              <div key={item.cartItemId} className="d-flex py-3 position-relative group-hover">
                {/* ภาพสินค้า */}
                <div className="flex-shrink-0 position-relative overflow-hidden rounded-4 bg-light border" style={{ width: '100px', height: '100px' }}>
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-100 h-100 object-fit-cover transition-transform"
                  />
                </div>

                {/* รายละเอียดสินค้า */}
                <div className="ms-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <Row className="pe-5 pe-sm-0">
                    <Col sm={8}>
                      <h3 className="h6 fw-bold mb-2">
                        <Link to={`/product/${item._id}`} className="text-dark text-decoration-none text-uppercase hover-primary">
                          {item.name}
                        </Link>
                      </h3>
                      <div className="mb-3">
                        <Badge bg="light" text="dark" className="border px-2 py-1 fw-semibold">
                          Size: {item.selectedSize}
                        </Badge>
                      </div>
                      <p className="fs-5 fw-black text-dark mb-0">
                        ฿{item.price.toLocaleString()}
                      </p>
                    </Col>

                    {/* ปุ่มเพิ่ม/ลด จำนวน และ ลบสินค้า */}
                    <Col sm={4} className="mt-3 mt-sm-0 d-flex align-items-center justify-content-start justify-content-sm-end pe-sm-5">
                      <div className="d-flex align-items-center bg-light border rounded-3 p-1 shadow-sm">
                        <Button 
                          variant="link"
                          onClick={() => decreaseQty(item.cartItemId)} 
                          className="p-1 text-secondary hover-dark text-decoration-none"
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="px-3 fw-bold text-dark text-center" style={{ minWidth: '24px' }}>{item.qty}</span>
                        <Button 
                          variant="link"
                          onClick={() => addToCart(item, item.selectedSize)} 
                          disabled={item.qty >= (item.countInStock !== undefined ? item.countInStock : 10)}
                          className="p-1 text-secondary hover-dark text-decoration-none"
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  
                  {/* ปุ่มไอคอนลบออกมุมขวา */}
                  <div className="position-absolute top-0 end-0 pt-2">
                    <Button 
                      variant="link"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-muted text-decoration-none hover-danger rounded-circle transition-colors"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* สรุปยอดสั่งซื้อ ด้านขวา */}
        <Col lg={4}>
          <Card className="rounded-4 border-0 shadow-sm bg-light sticky-top" style={{ top: '2rem' }}>
            <Card.Body className="p-4 p-md-5">
              <h4 className="fs-5 fw-black text-dark text-uppercase border-bottom pb-3 mb-4">Order summary</h4>
              
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted fw-medium small">Subtotal</span>
                  <span className="fw-bold text-dark">฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="text-muted fw-medium small">Shipping estimate</span>
                  <Badge bg="success" className="bg-opacity-10 text-success text-uppercase border border-success border-opacity-25 px-2 py-1">Free</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <span className="fs-5 fw-black text-dark text-uppercase">Order total</span>
                  <span className="fs-4 fw-black text-dark">฿{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="dark"
                  size="lg"
                  onClick={() => navigate('/shipping')}
                  className="w-100 py-3 rounded-4 fw-bold text-uppercase d-flex justify-content-center align-items-center gap-2 transition-transform-hover shadow"
                  style={{ letterSpacing: '1px' }}
                >
                  Proceed to Checkout 
                  <ArrowRight size={18} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;