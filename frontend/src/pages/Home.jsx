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
    <div className="w-100">
      {/* Premium Hero Section - Full Width/Height */}
      {!searchKeyword && (
        <div className="position-relative overflow-hidden shadow-lg d-flex align-items-center w-100" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)', minHeight: 'calc(100vh - 76px)', marginTop: '-1px' }}>
          
          <style>
            {`
              @keyframes floatShoe {
                0% { transform: translateY(0px) rotate(-15deg) scale(1); }
                50% { transform: translateY(-30px) rotate(-5deg) scale(1.05); }
                100% { transform: translateY(0px) rotate(-15deg) scale(1); }
              }
              @keyframes pulseShadow {
                0% { transform: scale(1); opacity: 0.4; }
                50% { transform: scale(1.3); opacity: 0.15; }
                100% { transform: scale(1); opacity: 0.4; }
              }
              @keyframes fadeUp {
                0% { opacity: 0; transform: translateY(30px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              .hero-text-anim {
                animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}
          </style>

          {/* Background Typography */}
          <div className="position-absolute top-50 start-50 translate-middle w-100 text-center" style={{ zIndex: 0, opacity: 0.03, pointerEvents: 'none' }}>
            <h1 style={{ fontSize: '18vw', fontWeight: 900, letterSpacing: '-10px', whiteSpace: 'nowrap', color: '#fff', margin: 0, userSelect: 'none' }}>
              BIG FOOT
            </h1>
          </div>

          {/* Decorative elements */}
          <div className="position-absolute rounded-circle" style={{ backgroundColor: '#ff5722', width: '500px', height: '500px', top: '-100px', right: '-150px', filter: 'blur(150px)', opacity: 0.35, pointerEvents: 'none' }}></div>
          <div className="position-absolute rounded-circle" style={{ backgroundColor: '#0dcaf0', width: '400px', height: '400px', bottom: '-150px', left: '-50px', filter: 'blur(120px)', opacity: 0.15, pointerEvents: 'none' }}></div>

          <div className="container position-relative" style={{ zIndex: 1 }}>
            <div className="row align-items-center">
              
              {/* Text Content */}
              <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0 pe-lg-5 hero-text-anim">
                <span className="d-inline-block fw-bold text-uppercase rounded-pill px-4 py-2 mb-4" style={{ fontSize: '0.75rem', letterSpacing: '3px', backgroundColor: 'rgba(255,87,34,0.1)', color: '#ff5722', border: '1px solid rgba(255,87,34,0.3)', backdropFilter: 'blur(10px)' }}>
                  🔥 The Ultimate Collection
                </span>
                <h1 className="display-3 fw-black text-white text-uppercase mb-4" style={{ fontWeight: 900, letterSpacing: '-2px', lineHeight: '1.1' }}>
                  Step Into <br/><span style={{ color: '#ff5722' }}>Greatness.</span>
                </h1>
                <p className="fs-5 text-light opacity-75 fw-medium mb-5 mx-auto mx-lg-0" style={{ maxWidth: '450px', lineHeight: '1.6' }}>
                  Experience the perfect blend of premium comfort, cutting-edge style, and unmatched durability.
                </p>
                <Button 
                  variant="light" 
                  size="lg" 
                  className="fw-bold px-5 py-3 rounded-pill text-uppercase border-0 shadow-sm" 
                  style={{ letterSpacing: '2px', fontSize: '0.9rem', transition: 'all 0.3s', backgroundColor: '#ff5722', color: '#fff' }} 
                  onMouseEnter={(e) => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 15px 30px rgba(255,87,34,0.4)'; }} 
                  onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Shop Now
                </Button>
              </div>

              {/* Floating Shoe Animation */}
              <div className="col-lg-6 position-relative d-none d-lg-block">
                <div className="position-relative mx-auto" style={{ width: '100%', maxWidth: '600px', height: '400px' }}>
                  {/* The Floating Shoe Image */}
                  <img 
                    src="https://purepng.com/public/uploads/large/purepng.com-nike-shoeclothingnike-shoe-lifestyle-sports-shoe-shoe-sneaker-6315223270914u4d0.png"
                    onError={(e) => { 
                      e.target.src = '/product/shoe-1.jpg'; 
                      e.target.style.borderRadius = '20px'; 
                      e.target.style.border = '4px solid rgba(255,255,255,0.1)';
                      e.target.style.transform = 'rotate(-10deg)';
                    }}
                    alt="Premium Floating Shoe" 
                    className="img-fluid position-absolute w-100" 
                    style={{ 
                      animation: 'floatShoe 6s ease-in-out infinite', 
                      zIndex: 2,
                      top: '0',
                      left: '0',
                      filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.5))'
                    }} 
                  />
                  {/* Dynamic Shadow on the "floor" */}
                  <div 
                    className="bg-black rounded-ellipse mx-auto position-absolute" 
                    style={{ 
                      width: '60%', 
                      height: '25px', 
                      bottom: '-20px', 
                      left: '20%', 
                      filter: 'blur(15px)',
                      borderRadius: '50%',
                      animation: 'pulseShadow 6s ease-in-out infinite',
                      zIndex: 1
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container for rest of content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Product Grid Section */}
        <div id="products-section">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end gap-2 mb-5 pb-3 border-bottom border-light-subtle">
          <div>

            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mt-1 relative inline-block">
              New Arrivals
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gray-900 rounded-full -mb-1"></span>
            </h2>
          </div>
          <p className="text-xs text-white font-semibold bg-[#d85e3e] px-3 py-1 rounded-md uppercase tracking-wider">
            {products.length} Products Found
          </p>
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

    </div>
    </div>
  );
};

export default Home;