import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Row, Col, Card } from 'react-bootstrap';

const AdminDashboardHome = () => {
  const { userInfo } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/admin/dashboard', config);
        
        setStats({
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalRevenue: data.totalRevenue || 0
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden h-100">
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255,122,89,0.1)', color: '#FF7A59' }}>
                <span className="fs-3">🛍️</span>
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Total Orders</h6>
                <h3 className="fw-black text-dark mb-0">{stats.totalOrders}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden h-100">
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-3">📦</span>
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Total Products</h6>
                <h3 className="fw-black text-dark mb-0">{stats.totalProducts}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4 overflow-hidden h-100">
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-3">💰</span>
              </div>
              <div>
                <h6 className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Total Revenue</h6>
                <h3 className="fw-black text-dark mb-0">฿{stats.totalRevenue.toLocaleString()}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Placeholder for chart matching mockup */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-dark mb-0">Revenue Overview</h5>
            <select className="form-select w-auto shadow-none border-light bg-light fw-medium">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="bg-light border border-secondary border-opacity-25 border-dashed rounded-4 d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '300px' }}>
            <span className="fs-1 mb-2">📈</span>
            <span className="fw-medium">Chart Data will appear here</span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboardHome;
