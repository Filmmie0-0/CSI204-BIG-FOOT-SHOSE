import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty, removeFromCart } = useCartStore();
  const { userInfo } = useAuthStore();

  // คำนวณราคารวมทั้งหมด
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!userInfo) {
    return (
      <Container className="py-5 text-center mt-5" style={{ maxWidth: '600px' }}>
        <div className="d-inline-flex p-4 rounded-circle bg-light text-secondary mb-4">
          <ShoppingBag size={64} strokeWidth={1.5} />
        </div>
        <h2 className="display-6 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900 }}>Please Login</h2>
        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
          You need to be logged in to view and manage your shopping cart.
        </p>
        <Button 
          as={Link} 
          to="/login" 
          variant="dark" 
          size="lg" 
          className="px-5 py-3 rounded-pill text-uppercase fw-bold shadow-sm"
          style={{ letterSpacing: '1px' }}
        >
          Login Now
        </Button>
      </Container>
    );
  }

  if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'staff')) {
    return (
      <Container className="py-5 text-center mt-5" style={{ maxWidth: '600px' }}>
        <div className="d-inline-flex p-4 rounded-circle bg-light text-secondary mb-4">
          <ShoppingBag size={64} strokeWidth={1.5} />
        </div>
        <h2 className="display-6 fw-black text-dark text-uppercase mb-3" style={{ fontWeight: 900 }}>Admin View</h2>
        <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: '400px' }}>
          Administrators and staff members cannot make purchases.
        </p>
        <Button 
          as={Link} 
          to="/admin" 
          variant="dark" 
          size="lg" 
          className="px-5 py-3 rounded-pill text-uppercase fw-bold shadow-sm"
          style={{ letterSpacing: '1px' }}
        >
          Go to Dashboard
        </Button>
      </Container>
    );
  }

  // === กรณีไม่มีสินค้าในตะกร้า (เพิ่มกรอบสี่เหลี่ยมล้อมรอบ) ===
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 animate-fade-in">
        <div className="bg-white rounded-3xl border border-white/40 p-8 sm:p-12 text-center space-y-8 shadow-2xl shadow-black/15">
          <div className="inline-flex p-6 rounded-full bg-[#FF7A59]/10 text-[#FF7A59] mb-2 transform hover:rotate-6 transition-transform duration-300">
            <ShoppingBag className="w-16 h-16 stroke-[1.5]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-950 uppercase">
            Your cart is empty
          </h2>
          <p className="text-gray-600 font-medium max-w-sm mx-auto leading-relaxed">
            Looks like you haven't added any premium footwear to your cart yet. Let's find your match!
          </p>
          <Link 
            to="/" 
            className="inline-block w-full bg-[#FF7A59] text-white px-10 py-4 font-extrabold rounded-2xl hover:bg-gray-950 transition-all duration-300 uppercase text-xs tracking-widest shadow-lg shadow-[#FF7A59]/20 hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // === กรณีมีสินค้าในตะกร้า ===
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 border-b border-gray-200 pb-5">
        <span className="text-xs font-black text-gray-900 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-md shadow-sm">Your Selection</span>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mt-3 relative inline-block drop-shadow-sm">
          Shopping Cart
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-gray-900 rounded-full -mb-1"></span>
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8 bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.cartItemId} className="flex py-6 group transition-all first:pt-0 last:pb-0">
                <div className="shrink-0 relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm" style={{ width: '100px', height: '100px' }}>
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-base font-bold text-gray-950">
                          <Link to={`/product/${item._id}`} className="hover:text-gray-600 transition-colors uppercase tracking-tight">
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg shadow-sm border border-gray-200">
                          Size: {item.selectedSize}
                        </span>
                      </div>
                      <p className="mt-3 text-lg font-black text-gray-950">
                        ฿{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center justify-between sm:justify-start">
                      <div className="flex items-center bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                        <button 
                          onClick={() => decreaseQty(item.cartItemId)} 
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-950 hover:bg-gray-50 transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-sm font-black text-gray-950 min-w-[24px] text-center">{item.qty}</span>
                        <button 
                          onClick={() => addToCart(item, item.selectedSize)} 
                          disabled={item.qty >= (item.countInStock !== undefined ? item.countInStock : 10)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-950 hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute top-0 right-0">
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="-m-2 p-2 inline-flex text-gray-900 hover:text-red-600 hover:bg-white rounded-full transition-all duration-200 shadow-sm sm:shadow-none"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 bg-white px-6 py-8 sm:p-8 lg:mt-0 lg:col-span-4 rounded-3xl border border-gray-200 shadow-xl shadow-black/5 sticky top-6">
          <h2 className="text-lg font-black text-gray-950 uppercase tracking-tight border-b border-gray-150 pb-3">Order summary</h2>
          
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
              <dd className="text-sm font-bold text-gray-950">฿{subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <dt className="text-sm font-medium text-gray-500">Shipping estimate</dt>
              <dd className="text-xs font-black text-green-700 uppercase bg-green-50 px-2.5 py-1 rounded-md">Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <dt className="text-base font-black text-gray-950 uppercase tracking-tight">Order total</dt>
              <dd className="text-xl font-black text-[#FF7A59]">฿{subtotal.toLocaleString()}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate('/shipping')}
              className="w-full bg-[#FF7A59] border border-transparent rounded-2xl shadow-lg shadow-[#FF7A59]/20 py-4 px-4 text-sm font-bold text-white hover:bg-gray-950 transition-all duration-300 flex justify-center items-center uppercase tracking-widest group transform hover:-translate-y-0.5"
            >
              Proceed to Checkout 
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;