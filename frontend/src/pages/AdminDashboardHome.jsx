import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Row, Col, Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const AdminDashboardHome = () => {
  const { userInfo } = useAuthStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    chartData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/admin/dashboard', config);
        
        setStats({
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalRevenue: data.totalRevenue || 0,
          chartData: data.chartData || []
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userInfo]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#6c757d' } },
      y: { 
        border: { display: false }, 
        grid: { color: '#e9ecef', drawTicks: false },
        ticks: { color: '#6c757d', precision: 0 }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const lineChartData = {
    labels: stats.chartData ? stats.chartData.map(d => d.name) : [],
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: stats.chartData ? stats.chartData.map(d => d.orders) : [],
        borderColor: '#FF7A59',
        backgroundColor: 'rgba(255, 122, 89, 0.2)',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5
      }
    ]
  };

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
      
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold text-dark mb-0">Orders Overview</h5>
          </div>
          <div style={{ height: '350px', width: '100%', position: 'relative' }}>
            {stats.chartData && stats.chartData.length > 0 ? (
              <Line options={chartOptions} data={lineChartData} />
            ) : (
              <div className="bg-light border border-secondary border-opacity-25 border-dashed rounded-4 d-flex flex-column align-items-center justify-content-center text-muted h-100">
                <span className="fs-1 mb-2">📈</span>
                <span className="fw-medium">No order data available</span>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminDashboardHome;

