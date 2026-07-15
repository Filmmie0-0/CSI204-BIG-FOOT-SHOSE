import React, { useState, useEffect } from 'react'
import { useCartStore } from '../store/cartStore' 
import { useAuthStore } from '../store/authStore'
import { useLanguageStore } from '../store/languageStore'
import { useThemeStore } from '../store/themeStore'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, Search, User, LogOut, Globe, Sun, Moon } from 'lucide-react'
import { Navbar as BsNavbar, Container, Nav, Badge, Button, Form } from 'react-bootstrap'
import api from '../utils/api'
import { getTranslation } from '../utils/translations'

const Navbar = () => {
  const { userInfo, logout } = useAuthStore()
  const cart = useCartStore((state) => state.cart)
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0)
  const { language, toggleLanguage } = useLanguageStore()
  const { theme, toggleTheme } = useThemeStore()
  
  const [searchKeyword, setSearchKeyword] = useState('')
  const [allProducts, setAllProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ดึงข้อมูลสินค้า
  useEffect(() => {
    const fetchProductsForSearch = async () => {
      try {
        const { data } = await api.get('/products')
        setAllProducts(data)
      } catch (error) {
        console.error('Error fetching products for search:', error)
      }
    }
    fetchProductsForSearch()
  }, [])

  // ระบบคัดกรองคำค้นหาแนะนำ 
  const searchSuggestions = searchKeyword.trim() 
    ? allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(searchKeyword.toLowerCase())) || 
        (p.brand && p.brand.toLowerCase().includes(searchKeyword.toLowerCase()))
      ).slice(0, 5)
    : []

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    setShowSuggestions(false)
    if (searchKeyword.trim()) {
      navigate(`/?search=${encodeURIComponent(searchKeyword.trim())}`)
    } else {
      navigate('/')
    }
  }

  return (
    <>
      <style>
        {`
          .navbar-premium {
            background-color: var(--bs-body-bg) !important;
            border-bottom: 1px solid var(--bs-border-color);
            transition: all 0.25s ease-in-out;
          }
          .navbar-premium.scrolled {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }
          .logo-text-premium {
            font-size: 1.35rem;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: var(--bs-emphasis-color);
            text-transform: uppercase;
            text-decoration: none;
          }
          .nav-link-premium {
            font-size: 13px;
            font-weight: 700;
            color: var(--bs-emphasis-color) !important;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 8px 16px !important;
            position: relative;
            transition: color 0.2s ease;
          }
          .nav-link-premium::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 2px;
            left: 16px;
            background-color: var(--bs-emphasis-color);
            transition: width 0.2s ease;
          }
          .nav-link-premium:hover::after,
          .nav-link-premium.active-route::after {
            width: calc(100% - 32px);
          }
          .search-box-premium {
            background-color: var(--bs-tertiary-bg);
            border: 1px solid var(--bs-border-color);
            border-radius: 0px !important;
            color: var(--bs-body-color) !important;
            font-size: 13px;
            transition: all 0.2s ease;
            width: 200px;
          }
          .search-box-premium:focus {
            background-color: var(--bs-body-bg);
            border-color: var(--bs-emphasis-color);
            box-shadow: none;
            width: 240px !important;
          }
          .navbar-icon-btn {
            background: none;
            border: none;
            color: var(--bs-emphasis-color);
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
            transition: opacity 0.2s ease;
          }
          .navbar-icon-btn:hover {
            opacity: 0.6;
          }
          .badge-premium {
            position: absolute;
            top: 0px;
            right: 0px;
            background-color: #ff5722 !important;
            color: #ffffff;
            font-size: 9px;
            font-weight: 700;
            border-radius: 50%;
            width: 15px;
            height: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .suggestion-item {
            cursor: pointer;
            transition: background-color 0.15s ease;
            border-bottom: 1px solid var(--bs-border-color);
          }
          .suggestion-item:hover {
            background-color: var(--bs-tertiary-bg);
          }
          .lang-toggle-btn {
            background: none;
            border: 1px solid var(--bs-border-color);
            border-radius: 20px;
            padding: 4px 10px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
            color: var(--bs-emphasis-color);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .lang-toggle-btn:hover {
            border-color: var(--bs-emphasis-color);
            background-color: var(--bs-tertiary-bg);
          }
          .lang-text {
            opacity: 0.4;
            transition: opacity 0.2s ease;
          }
          .lang-text.active {
            opacity: 1;
            color: var(--bs-emphasis-color);
          }
          .nav-link-custom {
            color: var(--bs-emphasis-color) !important;
          }
        `}
      </style>

      <BsNavbar expand="lg" className={`sticky-top py-3 navbar-premium ${scrolled ? 'scrolled' : ''}`}>
        <Container style={{ maxWidth: '1440px' }} className="px-4">
          
          {/* โลโก้ */}
          <BsNavbar.Brand as={Link} to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="d-flex align-items-center gap-2 m-0">
            <img 
              src="/logo.png" 
              alt="Big Foot Shoes Logo" 
              height="40" 
              className="d-inline-block align-top object-fit-contain rounded-circle shadow-sm" 
            />
            <span className="logo-text-premium d-none d-sm-block">
              BIG<span style={{ color: '#ff5722' }}>FOOT</span>SHOES
            </span>
          </BsNavbar.Brand>
          
          <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="shadow-none border-0 p-1" />
          
          <BsNavbar.Collapse id="basic-navbar-nav">
            {/* กลางหน้าเว็บ */}
            <Nav className="mx-auto gap-1 gap-lg-2 mt-3 mt-lg-0">
              <Nav.Link as={Link} to="/" onClick={() => setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }), 100)} className={`nav-link-premium ${location.pathname === '/' ? 'active-route' : ''}`}>{getTranslation(language, 'nav', 'newArrivals')}</Nav.Link>
              <Nav.Link as={Link} to="/men" onClick={() => setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }), 100)} className={`nav-link-premium ${location.pathname === '/men' ? 'active-route' : ''}`}>{getTranslation(language, 'nav', 'men')}</Nav.Link>
              <Nav.Link as={Link} to="/women" onClick={() => setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }), 100)} className={`nav-link-premium ${location.pathname === '/women' ? 'active-route' : ''}`}>{getTranslation(language, 'nav', 'women')}</Nav.Link>
            </Nav>
            
            {/* แถบไอคอน */}
            <Nav className="align-items-lg-center gap-4 mt-3 mt-lg-0">
              <Form className="d-flex align-items-center" onSubmit={handleSearchSubmit}>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder={getTranslation(language, 'nav', 'searchPlaceholder')}
                    className="search-box-premium ps-3 pe-5 py-2 fw-medium"
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <Button type="submit" variant="link" className="p-0 position-absolute top-50 end-0 translate-middle-y me-3 navbar-icon-btn">
                    <Search size={16} strokeWidth={2.5} />
                  </Button>

                  {/* Dropdown กล่องคำแนะนำผลลัพธ์ด่วน */}
                  {showSuggestions && searchKeyword.trim() && searchSuggestions.length > 0 && (
                    <div className="position-absolute bg-white shadow-lg mt-2 w-100 border overflow-hidden" style={{ zIndex: 1050, top: '100%', left: 0, minWidth: '260px', borderRadius: '0px' }}>
                      {searchSuggestions.map(product => (
                        <div 
                          key={product._id} 
                          className="px-3 py-2 d-flex align-items-center gap-3 suggestion-item"
                          onClick={() => {
                            setSearchKeyword('')
                            setShowSuggestions(false)
                            navigate(`/product/${product._id}`)
                          }}
                        >
                          <img src={product.image_url} alt={product.name} style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                          <div className="text-truncate flex-grow-1" style={{ fontSize: '13px' }}>
                            <div className="fw-bold text-dark text-truncate">{product.name}</div>
                            <div className="text-muted small">฿{product.price?.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                      <div 
                        className="px-3 py-2 text-center text-white fw-bold text-uppercase" 
                        style={{ fontSize: '11px', cursor: 'pointer', backgroundColor: 'var(--bs-emphasis-color)', color: 'var(--bs-body-bg)', letterSpacing: '1px' }}
                        onClick={handleSearchSubmit}
                      >
                        {getTranslation(language, 'nav', 'viewAllResults')}
                      </div>
                    </div>
                  )}
                </div>
              </Form>
              
              {/* สิทธิ์ของไอคอนตามสถานะการเข้าสู่ระบบ */}
              <div className="d-flex align-items-center gap-3 mt-2 mt-lg-0">
                <button 
                  onClick={toggleLanguage} 
                  className="lang-toggle-btn me-1"
                  title="Switch Language"
                >
                  <Globe size={14} strokeWidth={2} />
                  <span className={`lang-text ${language === 'th' ? 'active' : ''}`}>TH</span>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <span className={`lang-text ${language === 'en' ? 'active' : ''}`}>EN</span>
                </button>

                {/* ปุ่มสลับธีม */}
                <button 
                  onClick={toggleTheme} 
                  className="navbar-icon-btn ms-1"
                  title="Toggle Theme"
                >
                  {theme === 'light' ? <Moon size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}
                </button>

                {userInfo ? (
                  <>
                    {/* สิทธิ์พนักงาน/แอดมิน */}
                    {(userInfo.role === 'admin' || userInfo.role === 'staff') && (
                      <Link to="/admin" className="fw-bold text-decoration-none text-uppercase nav-link-custom pe-2" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                        {getTranslation(language, 'nav', 'dashboard')}
                      </Link>
                    )}

                    {/* ชื่อผู้ใช้เข้าสู่ระบบ */}
                    <Link to="/profile" className="fw-bold text-uppercase text-decoration-none nav-link-custom pe-1 d-flex align-items-center gap-2" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                      {userInfo.profile_image && (
                        <img 
                          src={userInfo.profile_image} 
                          alt="Profile" 
                          className="rounded-circle object-fit-cover shadow-sm border border-secondary border-opacity-25"
                          style={{ width: '26px', height: '26px' }}
                        />
                      )}
                      {userInfo.username}
                    </Link>
                    
                    {/* ตะกร้าสินค้า */}
                    {!(userInfo.role === 'admin' || userInfo.role === 'staff') && (
                      <Link to="/cart" className="navbar-icon-btn">
                        <ShoppingBag size={20} strokeWidth={2} />
                        {cartItemCount > 0 && (
                          <span className="badge-premium">{cartItemCount}</span>
                        )}
                      </Link>
                    )}

                    {/* ปุ่มออกจากระบบ */}
                    <button 
                      className="navbar-icon-btn" 
                      title="Logout"
                      onClick={() => { logout(); useCartStore.getState().clearCart(); }}
                    >
                      <LogOut size={18} strokeWidth={2} />
                    </button>
                  </>
                ) : (
                  // เคสยังไม่ Login
                  <Link to="/login" className="navbar-icon-btn d-flex align-items-center gap-2">
                    <User size={20} strokeWidth={2} />
                    <span className="fw-bold text-uppercase d-lg-none" style={{ fontSize: '12px', letterSpacing: '1px' }}>{getTranslation(language, 'nav', 'signIn')}</span>
                  </Link>
                )}
              </div>
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </>
  )
}

export default Navbar