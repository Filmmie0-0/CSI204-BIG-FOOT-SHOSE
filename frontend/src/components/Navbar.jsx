import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore'; 
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User } from 'lucide-react';
import { Navbar as BsNavbar, Container, Nav, Badge, Button, Form } from 'react-bootstrap';
import api from '../utils/api';

const Navbar = () => {
  const { userInfo, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

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
    <BsNavbar bg="white" expand="md" className="border-bottom sticky-top py-3">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <img src="/logo.png" alt="Big Foot Shoes" height="40" className="d-inline-block align-top object-fit-contain" />
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="shadow-none border-0" />
        
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto fw-medium">
            <Nav.Link as={Link} to="/" className="text-dark px-3 text-uppercase" style={{ fontSize: '0.9rem' }}>New Arrivals</Nav.Link>
            <Nav.Link as={Link} to="/men" className="text-dark px-3 text-uppercase" style={{ fontSize: '0.9rem' }}>Men</Nav.Link>
            <Nav.Link as={Link} to="/women" className="text-dark px-3 text-uppercase" style={{ fontSize: '0.9rem' }}>Women</Nav.Link>
          </Nav>
          
          <Nav className="align-items-center gap-3">
            <Form className="d-flex align-items-center" onSubmit={handleSearchSubmit}>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  className="rounded-pill shadow-none border-1 border-secondary border-opacity-25 ps-3 pe-5 py-1 focus-ring"
                  style={{ width: '200px', fontSize: '0.85rem', '--bs-focus-ring-color': 'rgba(0,0,0,0.1)' }}
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <Button type="submit" variant="link" className="text-dark p-0 position-absolute top-50 end-0 translate-middle-y me-2">
                  <Search size={16} strokeWidth={2} className="opacity-75" />
                </Button>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchKeyword.trim() && searchSuggestions.length > 0 && (
                  <div className="position-absolute bg-white shadow-lg rounded-3 mt-1 w-100 border overflow-hidden" style={{ zIndex: 1050, top: '100%', left: 0, minWidth: '220px' }}>
                    {searchSuggestions.map(product => (
                      <div 
                        key={product._id} 
                        className="px-3 py-2 border-bottom hover-bg-light text-decoration-none d-flex align-items-center gap-2"
                        style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.classList.add('bg-light')}
                        onMouseLeave={(e) => e.currentTarget.classList.remove('bg-light')}
                        onClick={() => {
                          setSearchKeyword('');
                          setShowSuggestions(false);
                          navigate(`/product/${product._id}`);
                        }}
                      >
                        <img src={product.image_url} alt={product.name} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div className="text-truncate" style={{ fontSize: '0.8rem' }}>
                          <div className="fw-bold text-dark text-truncate">{product.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>฿{product.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                    <div 
                      className="px-3 py-2 text-center text-primary fw-bold" 
                      style={{ fontSize: '0.8rem', cursor: 'pointer', backgroundColor: '#f8f9fa' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onClick={handleSearchSubmit}
                    >
                      View all results
                    </div>
                  </div>
                )}
              </div>
            </Form>
            
            {userInfo ? (
              <div className="d-flex align-items-center gap-3">
                
                {/* --- แสดงลิงก์ Dashboard ถ้าเป็น Admin/Staff --- */}
                {(userInfo.role === 'admin' || userInfo.role === 'staff') && (
                  <div className="d-none d-sm-block border-end pe-3">
                    <Link to="/admin" className="text-danger fw-bold text-decoration-none text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                      Dashboard
                    </Link>
                  </div>
                )}

                <Link to="/profile" className="d-none d-sm-block text-dark fw-bold text-uppercase text-decoration-none" style={{ fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#FF7A59'} onMouseLeave={(e) => e.target.style.color = '#212529'}>
                  Hi, {userInfo.username}
                </Link>
                
                <Button 
                  variant="link" 
                  className="text-secondary text-decoration-none p-0 fw-medium" 
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => { logout(); useCartStore.getState().clearCart(); }}
                >
                  Logout
                </Button>

                {!(userInfo.role === 'admin' || userInfo.role === 'staff') && (
                  <Nav.Link as={Link} to="/cart" className="text-dark p-0 position-relative ms-2">
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    {cartItemCount > 0 && (
                      <Badge bg="dark" rounded pill className="position-absolute translate-middle-y" style={{ top: '5px', right: '-12px', fontSize: '0.65rem' }}>
                        {cartItemCount}
                      </Badge>
                    )}
                  </Nav.Link>
                )}
              </div>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-dark p-0">
                <User size={20} strokeWidth={1.5} />
              </Nav.Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;