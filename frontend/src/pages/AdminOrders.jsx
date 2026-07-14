import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Card, Table, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsPaid = async (id) => {
    if (window.confirm('ยืนยันการรับชำระเงิน?')) {
      try {
        await api.put(`/orders/${id}/pay`);
        fetchOrders(); 
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    }
  };

  const markAsDelivered = async (id) => {
    if (window.confirm('ยืนยันการจัดส่งสินค้า?')) {
      try {
        await api.put(`/orders/${id}/deliver`);
        fetchOrders();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    }
  };

  const deleteOrderHandler = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคำสั่งซื้อนี้?')) {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
      } catch (err) {
        alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบคำสั่งซื้อ');
      }
    }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" />
      <div className="mt-3 text-muted fw-medium">Loading Orders...</div>
    </div>
  );
  if (error) return <Alert variant="danger" className="text-center mt-4 border-0 shadow-sm rounded-4">{error}</Alert>;

  return (
    <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Header className="bg-white border-bottom px-4 py-4">
        <h5 className="mb-0 fw-bold text-dark">จัดการคำสั่งซื้อ</h5>
      </Card.Header>
      
      <Card.Body className="p-0">
        <div className="d-flex gap-2 p-4 bg-light border-bottom">
          <Form.Control type="text" placeholder="ค้นหาด้วย ID/ชื่อลูกค้า" className="w-auto shadow-none focus-ring rounded-pill px-4 border-white" style={{ '--bs-focus-ring-color': 'rgba(255, 122, 89, 0.25)' }} />
          <Form.Select className="w-auto shadow-none focus-ring rounded-pill px-4 border-white" style={{ '--bs-focus-ring-color': 'rgba(255, 122, 89, 0.25)' }}>
            <option>สถานะทั้งหมด</option>
            <option>รอชำระเงิน</option>
            <option>ชำระเงินแล้ว</option>
          </Form.Select>
        </div>

        <div className="table-responsive">
          <Table hover className="mb-0 align-middle text-nowrap">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Order ID</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>User</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Date</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Total</th>
                <th className="px-4 py-3 text-center text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Status</th>
                <th className="px-4 py-3 text-end text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Action</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3 text-muted" style={{ fontSize: '0.85rem' }}>#{order._id.substring(0, 6)}</td>
                  <td className="px-4 py-3 fw-bold text-dark">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-secondary fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                        {(order.user_id ? order.user_id.username : 'G').charAt(0).toUpperCase()}
                      </div>
                      {order.user_id ? order.user_id.username : 'Guest'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted small">{new Date(order.created_at || order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 fw-bold text-dark">฿{(order.total_amount || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {order.order_status !== 'pending' ? (
                        <Badge bg="success" className="px-3 py-2 rounded-pill fw-bold bg-opacity-10 text-success border border-success border-opacity-25">Paid</Badge>
                      ) : (
                        <Button variant="light" size="sm" onClick={() => markAsPaid(order._id)} className="px-3 py-1 rounded-pill fw-bold border text-secondary shadow-sm hover-translate-y" style={{ fontSize: '0.75rem' }}>Mark Paid</Button>
                      )}
                      {order.order_status === 'delivered' ? (
                        <Badge bg="primary" className="px-3 py-2 rounded-pill fw-bold bg-opacity-10 text-primary border border-primary border-opacity-25">Sent</Badge>
                      ) : (
                        <Button variant="light" size="sm" onClick={() => markAsDelivered(order._id)} className="px-3 py-1 rounded-pill fw-bold border text-secondary shadow-sm hover-translate-y" style={{ fontSize: '0.75rem' }}>Mark Sent</Button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button as={Link} to={`/order/${order._id}`} variant="light" size="sm" className="fw-bold rounded-pill px-3 shadow-sm hover-translate-y" style={{ color: '#FF7A59' }}>View</Button>
                      <Button variant="light" size="sm" onClick={() => deleteOrderHandler(order._id)} className="text-danger fw-bold rounded-pill px-3 shadow-sm hover-translate-y">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdminOrders;
