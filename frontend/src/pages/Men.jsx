import { useState, useEffect, useMemo } from 'react'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'
import FilterDrawer from '../components/FilterDrawer'
import { Container, Row, Col, Button } from 'react-bootstrap'

const Men = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    sortBy: 'newest',
    style: '',
    sizeGroup: '',
    size: '',
    color: '',
    priceRange: '',
    gender: ['men'],
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

    // บังคับกรอง
    let result = products.filter(
      (p) => p && p.gender && p.gender.toLowerCase() === 'men',
    )

    // ตัวกรองจาก Drawer
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
  }, [products, filters])

  const localStyles = {
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
    <Container
      style={{ maxWidth: '1240px', paddingBottom: '80px', marginTop: '40px' }}
    >
      <div className="w-100">
        <div className="w-100 d-flex justify-content-between align-items-center pb-3 mb-5 border-bottom">
          <div>
            <h2
              style={localStyles.sectionTitle}
              className="position-relative d-inline-block"
            >
              MEN
              <span style={localStyles.headingUnderline}></span>
            </h2>
          </div>

          <div className="d-flex align-items-center gap-4">
            <span
              className="text-muted font-weight-bold m-0"
              style={{ fontSize: '14px', color: '#6b7280' }}
            >
              {filteredProducts.length} Products Found
            </span>

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
              <span>ตัวกรอง</span>
            </button>
          </div>
        </div>

        {/* Grid สินค้า */}
        {loading ? (
          <Row className="g-4">
            {[...Array(4)].map((_, index) => (
              <Col xs={12} sm={6} lg={3} key={index}>
                <div className="placeholder-glow">
                  <div
                    className="bg-light rounded-4 w-100"
                    style={{ aspectRatio: '1/1', borderRadius: '16px' }}
                  ></div>
                  <div
                    className="bg-light rounded w-75 mt-3"
                    style={{ height: '16px' }}
                  ></div>
                </div>
              </Col>
            ))}
          </Row>
        ) : filteredProducts.length === 0 ? (
          <div
            className="text-center py-5 bg-light border border-dashed"
            style={{ borderRadius: '16px' }}
          >
            <h3 className="h6 font-weight-bold text-dark mt-2">
              No products match your filters
            </h3>
            <p className="text-muted small mb-0">
              Try clearing some options or check backend server.
            </p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col xs={12} sm={6} lg={3} key={product._id}>
                <div
                  className="h-100 rounded-4 transition"
                  style={{ transition: 'all 0.3s' }}
                >
                  <ProductCard product={product} />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        products={products}
      />
    </Container>
  )
}

export default Men
