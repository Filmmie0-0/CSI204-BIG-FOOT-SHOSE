import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'
import FilterDrawer from '../components/FilterDrawer'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useLanguageStore } from '../store/languageStore'
import { getTranslation } from '../utils/translations'

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get('search') || '';
  const language = useLanguageStore((state) => state.language);
  
  // Hero Section Shoe Animation State
  const heroShoes = ['/product/shoe-1.jpg', '/product/shoe-3.jpg', '/product/shoe-7.jpg', '/product/shoe-9.jpg'];
  const [currentShoeIndex, setCurrentShoeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShoeIndex((prev) => (prev + 1) % heroShoes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [filters, setFilters] = useState({
    sortBy: 'newest',
    style: '',
    sizeGroup: '',
    size: '',
    color: '',
    priceRange: '',
    gender: [],
  })

  // ดึงข้อมูลสินค้า
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products')
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // FILTERING & SORTING LOGIC
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return []
    let result = [...products]

    // Search filter
    if (searchKeyword) {
      result = result.filter(
        (product) =>
          (product.name &&
            product.name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
          (product.brand &&
            product.brand.toLowerCase().includes(searchKeyword.toLowerCase())),
      )
    }

    // Category/Gender filter 
    if (pathname === '/men') {
      result = result.filter((product) => {
        const desc = product.description || ''
        return /\bMen\b/i.test(desc) || /\bUnisex\b/i.test(desc)
      })
    } else if (pathname === '/women') {
      result = result.filter((product) => {
        const desc = product.description || ''
        return /\bWomen\b/i.test(desc) || /\bUnisex\b/i.test(desc)
      })
    }

    // ตัวกรองย่อย
    if (filters.style) {
      result = result.filter(
        (p) =>
          p && p.style && p.style.toLowerCase() === filters.style.toLowerCase(),
      )
    }

    if (filters.size) {
      result = result.filter(
        (p) => p && Array.isArray(p.sizes) && p.sizes.includes(filters.size),
      )
    }

    if (filters.color) {
      result = result.filter(
        (p) =>
          p && p.color && p.color.toLowerCase() === filters.color.toLowerCase(),
      )
    }

    if (filters.priceRange) {
      result = result.filter((p) => {
        if (!p || p.price === undefined) return false
        const price = p.price
        if (filters.priceRange === 'Under 1000฿') return price < 1000
        if (filters.priceRange === '1000฿ - 2000฿')
          return price >= 1000 && price <= 2000
        if (filters.priceRange === '2000฿ - 3000฿')
          return price >= 2000 && price <= 3000
        if (filters.priceRange === '3000฿ - 4000฿')
          return price >= 3000 && price <= 4000
        return true
      })
    }

    if (filters.gender.length > 0) {
      result = result.filter(
        (p) => p && p.gender && filters.gender.includes(p.gender),
      )
    }

    if (filters.sortBy === 'low-high') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (filters.sortBy === 'high-low') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0))
    } else if (filters.sortBy === 'top-sellers') {
      result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    } else if (filters.sortBy === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id),
      )
    }

    return result
  }, [products, filters, searchKeyword, pathname])

  const localStyles = {
    heroSection: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      background:
        'linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%)',
      color: '#fff',
      padding: '80px 24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      marginBottom: '64px',
      marginTop: '24px',
    },
    heroHeading: {
      fontSize: '3.5rem',
      fontWeight: '900',
      letterSpacing: '-0.5px',
      textTransform: 'uppercase',
      lineHeight: '1.2',
      color: '#ffffff',
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '900',
      textTransform: 'uppercase',
      color: '#111827',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    filterBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      border: '1px solid #dee2e6',
      borderRadius: '50px',
      padding: '8px 24px',
      fontSize: '13px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: '#111827',
      backgroundColor: '#fff',
      cursor: 'pointer',
      height: '42px',
      whiteSpace: 'nowrap',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    headingUnderline: {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '48px',
      height: '4px',
      backgroundColor: '#111827',
      borderRadius: '50px',
      marginBottom: '-8px',
    },
  }

  return (
    <div className="w-100">
      {!searchKeyword && (
        <div
          className="position-relative overflow-hidden shadow-lg d-flex align-items-center w-100"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)',
            minHeight: 'calc(100vh - 76px)',
            marginTop: '-1px',
          }}
        >
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
          <div
            className="position-absolute top-50 start-50 translate-middle w-100 text-center"
            style={{ zIndex: 0, opacity: 0.03, pointerEvents: 'none' }}
          >
            <h1
              style={{
                fontSize: '18vw',
                fontWeight: 900,
                letterSpacing: '-10px',
                whiteSpace: 'nowrap',
                color: '#fff',
                margin: 0,
                userSelect: 'none',
              }}
            >
              BIG FOOT SHOES
            </h1>
          </div>

          {/* Decorative elements */}
          <div
            className="position-absolute rounded-circle"
            style={{
              backgroundColor: '#ff5722',
              width: '500px',
              height: '500px',
              top: '-100px',
              right: '-150px',
              filter: 'blur(150px)',
              opacity: 0.35,
              pointerEvents: 'none',
            }}
          ></div>
          <div
            className="position-absolute rounded-circle"
            style={{
              backgroundColor: '#0dcaf0',
              width: '400px',
              height: '400px',
              bottom: '-150px',
              left: '-50px',
              filter: 'blur(120px)',
              opacity: 0.15,
              pointerEvents: 'none',
            }}
          ></div>

          <div className="container position-relative" style={{ zIndex: 1 }}>
            <div className="row align-items-center">
              {/* Text Content */}
              <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0 pe-lg-5 hero-text-anim">
                <h1 className="display-3 fw-black text-white text-uppercase mb-4" style={{ fontWeight: 900, letterSpacing: '-2px', lineHeight: '1.1' }}>
                  {getTranslation(language, 'home', 'heroTitle')} <br/><span style={{ color: '#ff5722' }}>{getTranslation(language, 'home', 'heroTitleHighlight')}</span>
                </h1>
                <p
                  className="fs-5 text-light opacity-75 fw-medium mb-5 mx-auto mx-lg-0"
                  style={{ maxWidth: '450px', lineHeight: '1.6' }}
                >
                  {getTranslation(language, 'home', 'heroDesc')}
                </p>
                <Button
                  variant="light"
                  size="lg"
                  className="fw-bold px-5 py-3 rounded-pill text-uppercase border-0 shadow-sm"
                  style={{
                    letterSpacing: '2px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                    backgroundColor: '#ff5722',
                    color: '#fff',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)'
                    e.target.style.boxShadow = '0 15px 30px rgba(255,87,34,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                  onClick={() =>
                    document
                      .getElementById('products-section')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  {getTranslation(language, 'home', 'shopNow')}
                </Button>
              </div>

              {/* Floating Shoe Animation */}
              <div className="col-lg-6 position-relative d-none d-lg-block">
                <div className="position-relative mx-auto" style={{ width: '100%', maxWidth: '600px', height: '400px' }}>
                  {/* The Floating Shoe Images with Crossfade */}
                  {heroShoes.map((shoeSrc, index) => (
                    <img 
                      key={shoeSrc}
                      src={shoeSrc}
                      alt="Premium Floating Shoe" 
                      className="img-fluid position-absolute w-100 shadow-lg" 
                      style={{ 
                        animation: 'floatShoe 6s ease-in-out infinite', 
                        zIndex: 2,
                        top: '0',
                        left: '0',
                        borderRadius: '20px',
                        border: '4px solid rgba(255,255,255,0.1)',
                        filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.5))',
                        opacity: index === currentShoeIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out'
                      }} 
                    />
                  ))}

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
                      zIndex: 1,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container for rest of content */}
      <Container style={{ maxWidth: '1240px' }} className="py-5">
        {/* Product Grid Section */}
        <div id="products-section" className="w-100">
          {/* แถบหัวข้อและปุ่มตัวกรอง*/}
          <div className="w-100 d-flex justify-content-between align-items-center pb-3 mb-5 border-bottom">
            <div>
              <h2
                style={localStyles.sectionTitle}
                className="position-relative d-inline-block"
              >
                {getTranslation(language, 'home', 'newArrivals')}
                <span style={localStyles.headingUnderline}></span>
              </h2>
            </div>

            <div className="d-flex align-items-center gap-4">
              <span
                className="text-muted font-weight-bold m-0"
                style={{ fontSize: '14px', color: '#6b7280' }}
              >
                {filteredProducts.length} {getTranslation(language, 'home', 'productsFound')}
              </span>

              {/* ปุ่มกดเปิดสไตล์ */}
              <button
                onClick={() => setIsFilterOpen(true)}
                style={localStyles.filterBtn}
                className="btn btn-light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  style={{ width: '14px', height: '14px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <span>{getTranslation(language, 'home', 'filter')}</span>
              </button>
            </div>
          </div>

          {/* แสดงรายการสินค้า */}
          {loading ? (
            <Row className="g-4">
              {[...Array(4)].map((_, index) => (
                <Col key={index} xs={12} sm={6} lg={3}>
                  <div className="placeholder-glow">
                    <div
                      className="placeholder w-100 rounded-4 mb-3"
                      style={{ aspectRatio: '1/1' }}
                    ></div>
                    <div
                      className="placeholder rounded w-75 mb-2"
                      style={{ height: '1rem' }}
                    ></div>
                    <div
                      className="placeholder rounded w-50 mb-3"
                      style={{ height: '1rem' }}
                    ></div>
                    <div
                      className="placeholder rounded w-25"
                      style={{ height: '1.5rem' }}
                    ></div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-5 bg-light rounded-4 border border-2 border-dashed w-100">
              <svg
                className="mx-auto text-secondary mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ width: '48px', height: '48px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h5 className="fw-bold text-dark mb-2">{getTranslation(language, 'home', 'noProducts')}</h5>
              <p className="small text-muted mb-0">
                {getTranslation(language, 'home', 'noProductsDesc')}
              </p>
            </div>
          ) : (
            /* Product Grid */
            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product._id} xs={12} sm={6} lg={3}>
                  <div className="h-100 transition-transform-hover">
                    <ProductCard product={product} />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        products={products}
      />
    </div>
  )
}

export default Home
