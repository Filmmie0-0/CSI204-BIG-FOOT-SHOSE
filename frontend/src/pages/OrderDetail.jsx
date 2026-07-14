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

  const [slipName, setSlipName] = useState('');
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipError, setSlipError] = useState('');

  const handlePromptPayPay = async () => {
    setSlipUploading(true);
    setSlipError('');
    try {
      await api.put(`/orders/${order._id}/pay`, {
        payment_method: 'PromptPay / Bank Transfer',
        transaction_id: 'PP_SLIP_' + Date.now()
      });
      window.location.reload();
    } catch (err) {
      setSlipError('เกิดข้อผิดพลาดในการยืนยันสลิป');
    } finally {
      setSlipUploading(false);
    }
  };

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
      <Spinner animation="border" variant="light" />
      <div className="mt-3 text-uppercase tracking-widest text-white fw-bold">Loading Order...</div>
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
      <div className="mb-5 border-bottom border-white border-opacity-25 pb-4">
        <h1 className="display-6 fw-black text-white text-uppercase mb-2 drop-shadow-sm" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
          Order <span className="text-white opacity-75 fs-4 fw-medium">#{order._id}</span>
        </h1>
        <p className="text-white opacity-75 small fw-medium mb-0">Placed on {new Date(order.created_at || order.createdAt).toLocaleDateString()}</p>
      </div>

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

          <Card className="border-0 shadow-sm rounded-4 mt-4">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-5 fw-bold text-dark text-uppercase mb-4" style={{ letterSpacing: '1px' }}>Payment Method</h2>
              <p className="text-secondary fs-6 mb-4 lh-lg">
                {order.payment_method || 'Credit / Debit Card'}
              </p>
              
              {order.order_status !== 'pending' ? (
                <Alert variant="success" className="border-0 shadow-sm py-2 px-3 fw-bold mb-0 d-inline-block">
                  Paid (ชำระเงินเรียบร้อยแล้ว)
                </Alert>
              ) : (
                <div>
                  <Alert variant="danger" className="border-0 shadow-sm py-2 px-3 fw-bold mb-4 d-inline-block">
                    Not Paid (ยังไม่ชำระเงิน)
                  </Alert>

                  {/* 1. PromptPay Flow */}
                  {order.payment_method === 'PromptPay / Bank Transfer' && (
                    <Card className="border-0 bg-light shadow-sm mb-4">
                      <Card.Body className="p-4 d-flex flex-column align-items-center gap-3">
                        <p className="small fw-bold text-dark text-center mb-0">
                          สแกน QR Code เพื่อโอนเงินเข้าบัญชีพร้อมเพย์
                        </p>
                        <div className="bg-white p-3 rounded-4 shadow-sm border">
                          <img 
                            src={`https://promptpay.io/0987654321/${order.total_amount}.png`} 
                            alt="PromptPay QR Code" 
                            className="img-fluid" style={{ width: '180px', height: '180px', objectFit: 'contain' }}
                          />
                        </div>
                        <div className="small text-secondary text-center lh-lg">
                          <span className="fw-bold text-dark fs-6">พร้อมเพย์: 098-765-4321</span><br />
                          บจก. บิ๊กฟุต ชูส์ (Big Foot Shoes Co., Ltd.)<br />
                          ยอดโอนที่ถูกต้อง: <span className="fw-bold fs-6" style={{ color: '#ff5722' }}>฿{order.total_amount.toLocaleString()}</span>
                        </div>

                        <div className="w-100 border-top pt-3 mt-2">
                          <label className="form-label small fw-bold text-secondary text-uppercase mb-2">อัปโหลดสลิปการโอนเงิน</label>
                          <div className="d-flex align-items-center gap-3">
                            <label className="btn btn-outline-secondary btn-sm fw-bold">
                              เลือกรูปภาพสลิป
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setSlipName(e.target.files[0].name);
                                  }
                                }}
                                className="d-none" 
                              />
                            </label>
                            <span className="small text-muted text-truncate" style={{ maxWidth: '200px' }}>{slipName || 'ไม่ได้เลือกไฟล์ใดๆ'}</span>
                          </div>
                        </div>

                        {slipError && <div className="text-danger small w-100">{slipError}</div>}

                        <Button
                          disabled={slipUploading || !slipName}
                          onClick={handlePromptPayPay}
                          variant="dark"
                          className="w-100 mt-2 py-3 text-uppercase fw-bold rounded-pill border-0 shadow-sm"
                          style={{ letterSpacing: '1px', backgroundColor: '#ff5722' }}
                        >
                          {slipUploading ? 'กำลังประมวลผล...' : 'แจ้งโอนเงิน (Confirm Bank Transfer)'}
                        </Button>
                      </Card.Body>
                    </Card>
                  )}

                  {/* 2. Credit / Debit Card Flow */}
                  {(order.payment_method === 'Credit / Debit Card' || !order.payment_method) && (
                    <StripePayment orderId={order._id} onSuccess={() => window.location.reload()} />
                  )}

                  {/* 3. Cash On Delivery Flow */}
                  {order.payment_method === 'Cash On Delivery' && (
                    <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'rgba(13, 110, 253, 0.05)', border: '1px solid rgba(13, 110, 253, 0.2) !important' }}>
                      <Card.Body className="p-4 d-flex flex-column gap-3 text-primary">
                        <p className="fw-bold mb-0">
                          📦 ชำระเงินปลายทาง (Cash On Delivery)
                        </p>
                        <p className="small mb-0 lh-lg">
                          คำสั่งซื้อได้รับการบันทึกเรียบร้อยแล้ว กรุณาเตรียมเงินสดจำนวน <span className="fw-bold fs-5 text-dark">฿{order.total_amount.toLocaleString()}</span> เพื่อชำระให้กับเจ้าหน้าที่จัดส่งสินค้าเมื่อพัสดุเดินทางไปถึง
                        </p>
                        
                        {/* Mock delivery confirmation button for simulation */}
                        <div className="border-top pt-3 mt-2 d-flex flex-column gap-2">
                          <span className="small text-uppercase fw-bold opacity-75">
                            สำหรับเจ้าหน้าที่จัดส่งสินค้า (จำลองการรับเงิน)
                          </span>
                          <Button
                            onClick={async () => {
                              try {
                                await api.put(`/orders/${order._id}/pay`, {
                                  payment_method: 'Cash On Delivery',
                                  transaction_id: 'COD_CASH_' + Date.now()
                                });
                                window.location.reload();
                              } catch (err) {
                                alert('เกิดข้อผิดพลาดในการยืนยันการรับเงินสด');
                              }
                            }}
                            variant="primary"
                            className="w-100 py-2 rounded-pill fw-bold border-0 shadow-sm"
                          >
                            ยืนยันการได้รับเงินสดปลายทาง
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  )}
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