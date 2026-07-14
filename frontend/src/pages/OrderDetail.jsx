import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import StripePayment from '../components/StripePayment';
import { useCartStore } from '../store/cartStore';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <Container className="py-5 text-center mt-5">
      <Spinner animation="border" variant="dark" />
      <div className="mt-3 text-uppercase tracking-widest text-secondary fw-bold">Loading Order...</div>
    </Container>
  );

  if (error) return (
    <Container className="py-5 text-center mt-5">
      <Alert variant="danger" className="d-inline-block shadow-sm fw-bold border-0">{error}</Alert>
    </Container>
  );

  if (!order) return null;

  return (
    <Container className="py-5" style={{ maxWidth: '1200px' }}>
      <h1 className="display-6 fw-black text-dark text-uppercase mb-2" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
        Order <span className="text-secondary fs-4 fw-medium">#{order._id}</span>
      </h1>
      <p className="text-muted small fw-medium mb-5">Placed on {new Date(order.created_at || order.createdAt).toLocaleDateString()}</p>

      <Row className="gy-4 gx-lg-5">
        <Col lg={8} className="d-flex flex-column gap-4">
          
          {/* ข้อมูลการจัดส่งและสถานะ */}
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Shipping</h2>
              <p className="text-secondary fs-6 mb-4 lh-lg">
                <span className="fw-bold text-dark me-2">Name:</span>
                {order.user ? order.user.username : (order.user_id?.username || 'Guest Customer')}
                <br />
                <span className="fw-bold text-dark me-2">Address:</span>
                {order.shipping_address_id ? `${order.shipping_address_id.address_line1}, ${order.shipping_address_id.city}, ${order.shipping_address_id.postal_code}, ${order.shipping_address_id.state}` : 'N/A'}
              </p>
              {order.order_status === 'delivered' ? (
                <Alert variant="success" className="border-0 shadow-sm py-2 px-3 fw-bold mb-0 d-inline-block">Delivered</Alert>
              ) : (
                <Alert variant="danger" className="border-0 shadow-sm py-2 px-3 fw-bold mb-0 d-inline-block">Not Delivered</Alert>
              )}
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Payment Method</h2>
              <p className="text-secondary fs-6 mb-4 fw-medium">Credit / Debit Card</p>
              {order.order_status !== 'pending' ? (
                <Alert variant="success" className="border-0 shadow-sm py-2 px-3 fw-bold mb-0 d-inline-block">Paid</Alert>
              ) : (
                <div>
                  <Alert variant="danger" className="border-0 shadow-sm py-2 px-3 fw-bold mb-4 d-inline-block">Not Paid</Alert>
                  <StripePayment orderId={order._id} onSuccess={() => {
                    useCartStore.getState().clearCart();
                    window.location.reload();
                  }} />
                </div>
              )}
            </Card.Body>
          </Card>

          {/* รายการสินค้า */}
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Order Items</h2>
              <div className="d-flex flex-column gap-3">
                {order.orderItems.map((item, index) => (
                  <div key={index} className={`d-flex align-items-center py-3 ${index !== order.orderItems.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="flex-shrink-0 bg-light rounded-3 overflow-hidden border" style={{ width: '64px', height: '64px' }}>
                      <img src={item.product_id?.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} alt={item.product_id?.name || 'Product'} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="ms-4 flex-grow-1">
                      <Link to={`/product/${item.product_id?._id}`} className="text-dark text-decoration-none text-uppercase fw-bold hover-primary" style={{ fontSize: '0.9rem' }}>
                        {item.product_id?.name || 'Unknown Product'}
                      </Link>
                      {item.selectedSize && <div className="mt-1"><span className="text-muted small fw-medium">Size: {item.selectedSize}</span></div>}
                    </div>
                    <div className="text-end ms-3">
                      <div className="text-muted small fw-medium mb-1">{item.quantity} x ฿{(item.price_per_unit || 0).toLocaleString()}</div>
                      <div className="fw-bold text-dark">฿{((item.quantity || 1) * (item.price_per_unit || 0)).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* สรุปยอดเงิน */}
        <Col lg={4}>
          <Card className="rounded-4 border-0 shadow-sm bg-light sticky-top" style={{ top: '2rem' }}>
            <Card.Body className="p-4 p-md-5">
              <h4 className="fs-5 fw-black text-dark text-uppercase border-bottom pb-3 mb-4">Order Summary</h4>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center pt-2">
                  <span className="fs-5 fw-black text-dark text-uppercase">Total</span>
                  <span className="fs-4 fw-black text-dark">฿{(order.total_amount || 0).toLocaleString()}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetail;