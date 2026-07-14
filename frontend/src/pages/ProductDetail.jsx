import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuthStore();
  const isAdminOrStaff = userInfo?.role === 'admin' || userInfo?.role === 'staff';
  
  // --- เพิ่ม State สำหรับเก็บไซส์ที่เลือก ---
  const [selectedSize, setSelectedSize] = useState('');
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        // กำหนดให้เลือกไซส์แรกเป็นค่าเริ่มต้น
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const stock = product.countInStock !== undefined ? product.countInStock : 10;
    if (stock === 0) {
      alert('Product is out of stock.');
      return;
    }
    // ถ้ารองเท้ามีไซส์ให้เลือก แต่ผู้ใช้ยังไม่ได้เลือก
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('กรุณาเลือกไซส์ก่อนเพิ่มลงตะกร้า');
      return;
    }
    // ส่งไซส์ที่เลือกไปด้วย (ถ้าไม่มีก็จะเป็น string ว่าง)
    addToCart(product, selectedSize);
    navigate('/cart'); 
  };

  if (loading) return (
    <div className="text-center py-5 mt-5">
      <Spinner animation="border" variant="dark" />
    </div>
  );
  if (!product) return <div className="text-center py-5 mt-5 fs-4 text-muted">Product not found</div>;

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: '1200px' }}>
      <div className="bg-white rounded-4 shadow-lg p-4 p-md-5">
        <Row className="gx-5">
          <Col md={6} className="mb-5 mb-md-0">
            <div className="bg-light rounded-4 overflow-hidden shadow-sm h-100 d-flex align-items-center justify-content-center p-3">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} 
                alt={product.name} 
                className="w-100 object-fit-contain rounded-3" 
                style={{ maxHeight: '500px' }}
              />
            </div>
          </Col>
          
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h1 className="display-5 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900, letterSpacing: '-1px' }}>
              {product.name}
            </h1>
            <p className="fs-2 fw-black mb-4" style={{ color: '#ff5722' }}>฿{product.price?.toLocaleString()}</p>
            
            <div className="mb-4">
              <span className={`badge ${ (product.countInStock !== undefined ? product.countInStock : 10) > 0 ? 'bg-success' : 'bg-danger'} px-3 py-2 fs-6 rounded-pill shadow-sm`}>
                { (product.countInStock !== undefined ? product.countInStock : 10) > 0 ? `In Stock: ${product.countInStock !== undefined ? product.countInStock : 10}` : 'Out of Stock'}
              </span>
            </div>

            <div className="mb-5">
              <p className="fs-5 text-secondary lh-lg fw-medium">{product.description}</p>
            </div>

            {/* --- UI สำหรับเลือกไซส์ --- */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <h5 className="fw-bold text-dark text-uppercase mb-3" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>Size (EU)</h5>
                <div className="d-flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'dark' : 'outline-secondary'}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-3 px-4 py-2 fw-bold border-2 shadow-sm ${selectedSize === size ? 'border-dark bg-dark text-white' : 'border-light bg-light text-dark'}`}
                      style={{ transition: 'all 0.2s' }}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-auto">
              <Button
                variant="light"
                size="lg"
                onClick={handleAddToCart}
                disabled={(product.countInStock !== undefined ? product.countInStock : 10) === 0 || isAdminOrStaff}
                className="w-100 py-3 text-uppercase fw-bold rounded-pill border-0 shadow"
                style={{ 
                  letterSpacing: '2px', 
                  backgroundColor: (product.countInStock !== undefined ? product.countInStock : 10) === 0 || isAdminOrStaff ? '#e9ecef' : '#ff5722',
                  color: (product.countInStock !== undefined ? product.countInStock : 10) === 0 || isAdminOrStaff ? '#6c757d' : '#fff',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { 
                  if (!e.target.disabled) {
                    e.target.style.transform = 'translateY(-3px)'; 
                    e.target.style.boxShadow = '0 10px 20px rgba(255,87,34,0.3)'; 
                  }
                }} 
                onMouseLeave={(e) => { 
                  if (!e.target.disabled) {
                    e.target.style.transform = 'translateY(0)'; 
                    e.target.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'; 
                  }
                }}
              >
                {isAdminOrStaff ? 'Admin cannot purchase' : ((product.countInStock !== undefined ? product.countInStock : 10) === 0 ? 'Out of Stock' : 'Add to Cart')}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ProductDetail;