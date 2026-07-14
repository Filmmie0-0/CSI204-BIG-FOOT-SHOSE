import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore'; 
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut } from 'lucide-react';
import { Navbar as BsNavbar, Container, Nav, Badge, Button, Form } from 'react-bootstrap';
import api from '../utils/api';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProductsForSearch = async () => {
      try {
        const { data } = await api.get('/products');
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products for search:', error);
      }
    };
    fetchProductsForSearch();
  }, []);

  const searchSuggestions = searchKeyword.trim() 
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchKeyword.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(searchKeyword.toLowerCase()))).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    if (searchKeyword.trim()) {
      navigate(`/?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <style>
        {`
          .nav-glass {
            background-color: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          .nav-glass.scrolled {
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            background-color: rgba(255, 255, 255, 0.95) !important;
          }
          .nav-link-custom {
            position: relative;
            transition: color 0.3s ease;
            font-weight: 700;
          }
          .nav-link-custom::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 4px;
            left: 50%;
            background-color: #ff5722;
            transition: all 0.3s ease;
            transform: translateX(-50%);
          }
          .nav-link-custom:hover::after {
            width: 70%;
          }
          .nav-link-custom:hover {
            color: #ff5722 !important;
          }
          .search-input-custom {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background-color: #f1f3f5;
            border: 2px solid transparent;
          }
          .search-input-custom:focus {
            background-color: #ffffff;
            border-color: #ff5722;
            box-shadow: 0 0 0 4px rgba(255, 87, 34, 0.1);
            width: 260px !important;
          }
          .icon-btn {
            transition: transform 0.2s ease, color 0.2s ease;
          }
          .icon-btn:hover {
            transform: scale(1.1);
            color: #ff5722 !important;
          }
          .logo-text {
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: -1px;
            background: linear-gradient(90deg, #111, #555);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>
      <BsNavbar expand="lg" className={`sticky-top py-3 nav-glass ${scrolled ? 'scrolled' : ''}`}>
        <Container>
          <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 me-4">
            <img 
              src="/logo.png" 
              alt="Big Foot Shoes Logo" 
              height="44" 
              className="d-inline-block align-top object-fit-contain rounded-circle shadow-sm border border-light" 
            />
            <span className="logo-text d-none d-sm-block">
              BIG<span style={{ color: '#ff5722', WebkitTextFillColor: '#ff5722' }}>FOOT</span>SHOES
            </span>
          </BsNavbar.Brand>
          
          <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="shadow-none border-0 px-0 icon-btn" />
          
          <BsNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto gap-1 gap-lg-3 mt-3 mt-lg-0">
              <Nav.Link as={Link} to="/" className="text-dark px-2 text-uppercase nav-link-custom" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>New Arrivals</Nav.Link>
              <Nav.Link as={Link} to="/men" className="text-dark px-2 text-uppercase nav-link-custom" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Men</Nav.Link>
              <Nav.Link as={Link} to="/women" className="text-dark px-2 text-uppercase nav-link-custom" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Women</Nav.Link>
            </Nav>
            
            <Nav className="align-items-lg-center gap-3 mt-4 mt-lg-0 pb-2 pb-lg-0">
              <Form className="d-flex align-items-center" onSubmit={handleSearchSubmit}>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search for shoes..."
                    className="rounded-pill shadow-none ps-4 pe-5 py-2 search-input-custom text-dark fw-medium"
                    style={{ width: '200px', fontSize: '0.85rem' }}
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <Button type="submit" variant="link" className="text-muted p-0 position-absolute top-50 end-0 translate-middle-y me-3 icon-btn">
                    <Search size={18} strokeWidth={2.5} />
                  </Button>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && searchKeyword.trim() && searchSuggestions.length > 0 && (
                    <div className="position-absolute bg-white shadow-lg rounded-4 mt-2 w-100 border-0 overflow-hidden" style={{ zIndex: 1050, top: '100%', left: 0, minWidth: '260px' }}>
                      {searchSuggestions.map(product => (
                        <div 
                          key={product._id} 
                          className="px-3 py-3 border-bottom text-decoration-none d-flex align-items-center gap-3"
                          style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.classList.add('bg-light')}
                          onMouseLeave={(e) => e.currentTarget.classList.remove('bg-light')}
                          onClick={() => {
                            setSearchKeyword('');
                            setShowSuggestions(false);
                            navigate(`/product/${product._id}`);
                          }}
                        >
                          <img src={product.image_url} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} className="shadow-sm" />
                          <div className="text-truncate flex-grow-1" style={{ fontSize: '0.85rem' }}>
                            <div className="fw-bold text-dark text-truncate">{product.name}</div>
                            <div className="text-primary fw-bold" style={{ fontSize: '0.75rem' }}>฿{product.price.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                      <div 
                        className="px-3 py-2 text-center text-dark fw-bold text-uppercase" 
                        style={{ fontSize: '0.75rem', cursor: 'pointer', backgroundColor: '#f8f9fa', letterSpacing: '1px' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ff5722'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.color = '#212529'; }}
                        onClick={handleSearchSubmit}
                      >
                        View all results
                      </div>
                    </div>
                  )}
                </div>
              </Form>
              
              <div className="d-flex align-items-center gap-4 border-start ps-lg-4 mt-3 mt-lg-0 pt-3 pt-lg-0">
                {userInfo ? (
                  <>
                    {/* --- แสดงลิงก์ Dashboard ถ้าเป็น Admin/Staff --- */}
                    {(userInfo.role === 'admin' || userInfo.role === 'staff') && (
                      <Link to="/admin" className="text-danger fw-bold text-decoration-none text-uppercase nav-link-custom" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                        Dashboard
                      </Link>
                    )}

                    <Link to="/profile" className="text-dark fw-bold text-uppercase text-decoration-none nav-link-custom" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                      {userInfo.username}
                    </Link>
                    
                    <Button 
                      variant="link" 
                      className="text-muted text-decoration-none p-0 icon-btn" 
                      title="Logout"
                      onClick={() => { logout(); useCartStore.getState().clearCart(); }}
                    >
                      <LogOut size={20} strokeWidth={2} />
                    </Button>

                    {!(userInfo.role === 'admin' || userInfo.role === 'staff') && (
                      <Nav.Link as={Link} to="/cart" className="text-dark p-0 position-relative icon-btn ms-1">
                        <ShoppingBag size={22} strokeWidth={2} />
                        {cartItemCount > 0 && (
                          <Badge bg="danger" rounded pill className="position-absolute translate-middle" style={{ top: '0px', left: '100%', fontSize: '0.65rem', padding: '0.25em 0.5em', border: '2px solid white' }}>
                            {cartItemCount}
                          </Badge>
                        )}
                      </Nav.Link>
                    )}
                  </>
                ) : (
                  <Nav.Link as={Link} to="/login" className="text-dark p-0 icon-btn d-flex align-items-center gap-2">
                    <User size={22} strokeWidth={2} />
                    <span className="fw-bold text-uppercase d-lg-none" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Sign In</span>
                  </Nav.Link>
                )}
              </div>
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>
    </>
  );
};

export default Navbar;