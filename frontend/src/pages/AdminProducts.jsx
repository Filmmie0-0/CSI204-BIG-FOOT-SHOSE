import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Card, Table, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuthStore();

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถดึงข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.role !== 'admin' && userInfo?.role !== 'staff') {
      return;
    }
    fetchProducts();
  }, [userInfo]);

  if (userInfo?.role !== 'admin' && userInfo?.role !== 'staff') {
    return (
      <div className="text-center py-5">
        <Alert variant="danger" className="fw-bold fs-5 shadow-sm border-0 rounded-4">ไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin & Staff Only)</Alert>
      </div>
    );
  }

  const deleteProduct = async (id) => {
    if (window.confirm('ยืนยันการลบสินค้า?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.delete(`/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการลบสินค้า');
      }
    }
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" />
      <div className="mt-3 text-muted fw-medium">Loading Products...</div>
    </div>
  );
  
  if (error) return <Alert variant="danger" className="text-center mt-4 border-0 shadow-sm rounded-4">{error}</Alert>;

  return (
    <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
      <Card.Header className="bg-white border-bottom px-4 py-4 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold text-dark">จัดการสินค้า</h5>
        <div className="d-flex gap-2">
          <Form.Control type="text" placeholder="ค้นหาสินค้า..." className="shadow-none border-light bg-light rounded-pill px-4 focus-ring" style={{ '--bs-focus-ring-color': 'rgba(255, 122, 89, 0.25)' }} />
          <Button 
            as={Link} 
            to="/admin/product/new" 
            className="fw-bold shadow-sm rounded-pill px-4 text-nowrap d-flex align-items-center gap-2 text-white border-0"
            style={{ backgroundColor: '#FF7A59' }}
          >
            <span>+</span> เพิ่มสินค้า
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle text-nowrap">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>ID</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Product Info</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Price</th>
                <th className="px-4 py-3 text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Status</th>
                <th className="px-4 py-3 text-end text-uppercase text-secondary fw-bold border-0" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-4 py-3 text-muted" style={{ fontSize: '0.85rem' }}>#{product._id.substring(0, 6)}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-3 overflow-hidden bg-light border" style={{ width: '48px', height: '48px' }}>
                        <img 
                          src={product.image_url || 'https://via.placeholder.com/48'} 
                          alt={product.name} 
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{product.name}</div>
                        <div className="text-muted small">{product.brand || 'No Brand'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 fw-bold text-dark">฿{product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge bg={product.status === 'active' ? 'success' : 'secondary'} className="bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 rounded-pill">
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Link to={`/admin/product/${product._id}/edit`} className="btn btn-sm btn-light fw-bold rounded-pill px-3 shadow-sm hover-translate-y" style={{ color: '#FF7A59' }}>Edit</Link>
                      <Button variant="light" size="sm" onClick={() => deleteProduct(product._id)} className="text-danger fw-bold rounded-pill px-3 shadow-sm hover-translate-y">Delete</Button>
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

export default AdminProducts;
