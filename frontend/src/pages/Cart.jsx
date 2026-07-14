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

  // === กรณีไม่มีสินค้าในตะกร้า (เพิ่มกรอบสี่เหลี่ยมล้อมรอบ) ===
  if (cart.length === 0) {
    return (
      <Container className="py-5 mt-5 d-flex justify-content-center">
        <Card className="border-0 shadow-lg rounded-4 text-center p-5 bg-white" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="d-inline-flex p-4 rounded-circle mb-4 mx-auto" style={{ backgroundColor: 'rgba(255,87,34,0.1)', color: '#ff5722' }}>
            <ShoppingBag size={64} strokeWidth={1.5} />
          </div>
          <h2 className="display-6 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900 }}>
            Your cart is empty
          </h2>
          <p className="text-secondary fs-5 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
            Looks like you haven't added any premium footwear to your cart yet. Let's find your match!
          </p>
          <Button 
            as={Link} 
            to="/" 
            size="lg" 
            className="px-5 py-3 rounded-pill text-uppercase fw-bold shadow border-0"
            style={{ letterSpacing: '2px', backgroundColor: '#ff5722', color: '#fff', transition: 'all 0.3s' }}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 10px 20px rgba(255,87,34,0.3)'; }} 
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'; }}
          >
            Continue Shopping
          </Button>
        </Card>
      </Container>
    );
  }

  // === กรณีมีสินค้าในตะกร้า ===
  return (
    <Container className="py-5 mt-4" style={{ maxWidth: '1200px' }}>
      <div className="mb-5 border-bottom pb-3">
        <Badge bg="light" text="dark" className="text-uppercase mb-3 shadow-sm py-2 px-3 border rounded-pill">Your Selection</Badge>
        <h1 className="display-5 fw-black text-dark text-uppercase" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
          Shopping Cart
        </h1>
      </div>

      <Row className="g-5">
        <Col lg={8}>
          <Card className="border-0 shadow-lg rounded-4 bg-white p-4 p-md-5">
            <Card.Body className="p-0">
              {cart.map((item, index) => (
                <div key={item.cartItemId} className={`d-flex py-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
                  <div className="flex-shrink-0" style={{ width: '120px', height: '120px' }}>
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'}
                      alt={item.name}
                      className="w-100 h-100 object-fit-cover rounded-3 shadow-sm border p-1"
                    />
                  </div>

                  <div className="ms-4 flex-grow-1 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h3 className="fs-5 fw-bold text-dark text-uppercase mb-2">
                          <Link to={`/product/${item._id}`} className="text-dark text-decoration-none hover-orange transition-colors" style={{ letterSpacing: '0.5px' }}>
                            {item.name}
                          </Link>
                        </h3>
                        <Badge bg="light" text="dark" className="border shadow-sm px-2 py-1">Size: {item.selectedSize}</Badge>
                      </div>
                      <div className="text-end ms-3">
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="btn btn-sm btn-light text-danger rounded-circle shadow-sm"
                          style={{ width: '40px', height: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#dc3545'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.color = '#dc3545'; }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-end mt-3">
                      <p className="fs-4 fw-black mb-0" style={{ color: '#ff5722' }}>
                        ฿{item.price.toLocaleString()}
                      </p>
                      <div className="d-flex align-items-center bg-light border rounded-pill p-1 shadow-sm">
                        <button 
                          onClick={() => decreaseQty(item.cartItemId)} 
                          className="btn btn-sm btn-white rounded-circle border-0 d-flex align-items-center justify-content-center"
                          style={{ width: '30px', height: '30px' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 fw-bold">{item.qty}</span>
                        <button 
                          onClick={() => addToCart(item, item.selectedSize)} 
                          disabled={item.qty >= (item.countInStock !== undefined ? item.countInStock : 10)}
                          className="btn btn-sm btn-white rounded-circle border-0 d-flex align-items-center justify-content-center"
                          style={{ width: '30px', height: '30px' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-lg rounded-4 bg-white p-4 p-md-5 sticky-top" style={{ top: '100px' }}>
            <h4 className="fs-5 fw-black text-dark text-uppercase border-bottom pb-3 mb-4">Order summary</h4>
            
            <div className="d-flex justify-content-between mb-3">
              <span className="text-secondary fw-medium">Subtotal</span>
              <span className="fw-bold text-dark">฿{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="d-flex justify-content-between border-bottom pb-4 mb-4 align-items-center">
              <span className="text-secondary fw-medium">Shipping estimate</span>
              <Badge bg="success" className="bg-opacity-10 text-success border border-success fw-bold px-2 py-1" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>FREE</Badge>
            </div>
            
            <div className="d-flex justify-content-between mb-4 align-items-center">
              <span className="fs-5 fw-black text-uppercase">Order total</span>
              <span className="fs-2 fw-black" style={{ color: '#ff5722' }}>฿{subtotal.toLocaleString()}</span>
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/shipping')}
              className="w-100 py-3 text-uppercase fw-bold rounded-pill border-0 shadow d-flex justify-content-center align-items-center"
              style={{ letterSpacing: '1px', backgroundColor: '#ff5722', color: '#fff', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { 
                e.target.style.transform = 'translateY(-3px)'; 
                e.target.style.boxShadow = '0 10px 20px rgba(255,87,34,0.3)'; 
              }} 
              onMouseLeave={(e) => { 
                e.target.style.transform = 'translateY(0)'; 
                e.target.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'; 
              }}
            >
              Proceed to Checkout 
              <ArrowRight size={18} className="ms-2" />
            </Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;