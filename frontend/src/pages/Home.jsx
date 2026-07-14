import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    // 1. Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchKeyword.toLowerCase()) || 
      (product.brand && product.brand.toLowerCase().includes(searchKeyword.toLowerCase()));
      
    // 2. Category/Gender filter based on URL path
    let matchesCategory = true;
    const desc = product.description || '';
    if (pathname === '/men') {
      matchesCategory = /\bMen\b/i.test(desc) || /\bUnisex\b/i.test(desc);
    } else if (pathname === '/women') {
      matchesCategory = /\bWomen\b/i.test(desc) || /\bUnisex\b/i.test(desc);
    }
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Container className="py-5 my-3">
      
      {/* Premium Hero Section */}
      {!searchKeyword && (
        <div className="position-relative overflow-hidden rounded-4 bg-dark text-white p-4 p-md-5 mb-5 shadow-lg" style={{ background: 'linear-gradient(135deg, #212529, #343a40, #000)' }}>
          {/* Decorative elements */}
          <div className="position-absolute bg-primary rounded-circle" style={{ width: '300px', height: '300px', top: '-100px', right: '-100px', filter: 'blur(100px)', opacity: 0.2, pointerEvents: 'none' }}></div>
          <div className="position-absolute rounded-circle" style={{ backgroundColor: '#6f42c1', width: '300px', height: '300px', bottom: '-100px', left: '-100px', filter: 'blur(100px)', opacity: 0.2, pointerEvents: 'none' }}></div>

          <div className="position-relative mx-auto text-center" style={{ maxWidth: '700px', zIndex: 1 }}>
            <span className="d-inline-block fw-bold text-uppercase rounded-pill px-3 py-1 mb-3" style={{ fontSize: '0.75rem', letterSpacing: '2px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#6ea8fe', backdropFilter: 'blur(4px)' }}>
              New Collection 2026
            </span>
            <h1 className="display-3 fw-black text-uppercase lh-1 mb-4" style={{ fontWeight: 900, background: 'linear-gradient(to right, #fff, #e9ecef, #adb5bd)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Find your <br className="d-block d-sm-none" /> perfect match.
            </h1>
            <p className="fs-5 text-secondary fw-medium mb-4">
              Explore our latest collection of premium footwear designed for comfort and style.
            </p>
            <div className="pt-2">
              <Button variant="light" size="lg" className="fw-bold px-4 py-3 rounded-3 shadow-sm text-dark hover-translate-y">
                Shop New Arrivals
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid Section */}
      <div>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2 mb-5 pb-3 border-bottom border-light-subtle">
          <div>
            <h2 className="fs-2 fw-black text-dark text-uppercase position-relative d-inline-block mb-0" style={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
              {searchKeyword ? `Search Results for "${searchKeyword}"` : (pathname === '/men' ? "Men's Collection" : (pathname === '/women' ? "Women's Collection" : 'New Arrivals'))}
              <div className="position-absolute bottom-0 start-0 bg-dark rounded-pill" style={{ width: '3rem', height: '4px', marginBottom: '-4px' }}></div>
            </h2>
          </div>
          <p className="text-muted fw-medium small mb-0">{filteredProducts.length} Products Found</p>
        </div>
        
        {/* Loading State ด้วย Skeleton Loader */}
        {loading ? (
          <Row className="g-4">
            {[...Array(4)].map((_, index) => (
              <Col key={index} sm={6} lg={3}>
                <div className="placeholder-glow">
                  <div className="placeholder w-100 rounded-4 mb-3" style={{ aspectRatio: '1/1' }}></div>
                  <div className="placeholder rounded w-75 mb-2" style={{ height: '1rem' }}></div>
                  <div className="placeholder rounded w-50 mb-3" style={{ height: '1rem' }}></div>
                  <div className="placeholder rounded w-25" style={{ height: '1.5rem' }}></div>
                </div>
              </Col>
            ))}
          </Row>
        ) : filteredProducts.length === 0 ? (
          /* Empty State กรณีไม่มีข้อมูล หรือต่อ Backend ไม่ติด */
          <div className="text-center py-5 bg-light rounded-4 border border-2 border-dashed">
            <svg className="mx-auto text-secondary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '48px', height: '48px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h5 className="fw-bold text-dark mb-2">No products available</h5>
            <p className="small text-muted mb-0">Please make sure your database server is connected or try a different search keyword.</p>
          </div>
        ) : (
          /* Product Grid ที่ได้ข้อมูลมาแล้ว */
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product._id} sm={6} lg={3}>
                <div className="h-100 transition-transform-hover">
                  <ProductCard product={product} />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

    </Container>
  );
};

export default Home;