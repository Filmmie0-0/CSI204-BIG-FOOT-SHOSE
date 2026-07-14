import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty, removeFromCart } = useCartStore();

  // คำนวณราคารวมทั้งหมด
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="inline-flex p-6 rounded-full bg-gray-50 text-gray-400 mb-2">
          <ShoppingBag className="w-16 h-16 stroke-[1.5]" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Your cart is empty</h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Looks like you haven't added any premium footwear to your cart yet. Let's find your match!
        </p>
        <Link 
          to="/" 
          className="inline-block w-full sm:w-auto bg-gray-900 text-white px-8 py-4 font-bold rounded-xl hover:bg-black transition-all duration-200 uppercase text-xs tracking-widest shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 border-b border-gray-100 pb-5">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Your Selection</span>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mt-1 relative inline-block">
          Shopping Cart
          <span className="absolute bottom-0 left-0 w-12 h-1 bg-gray-900 rounded-full -mb-1"></span>
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* รายการสินค้า */}
        <div className="lg:col-span-8">
          <ul role="list" className="divide-y divide-gray-100 border-b border-gray-100">
            {cart.map((item) => (
              <li key={item.cartItemId} className="flex py-6 sm:py-8 group transition-all">
                {/* ภาพสินค้า */}
                <div className="shrink-0 relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-24 h-24 object-center object-cover sm:w-32 sm:h-32 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* รายละเอียดสินค้า */}
                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-base font-bold text-gray-900">
                          <Link to={`/product/${item._id}`} className="hover:text-blue-600 transition-colors uppercase tracking-tight">
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md">
                          Size: {item.selectedSize}
                        </span>
                      </div>
                      <p className="mt-3 text-base font-black text-gray-900">
                        ฿{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* ปุ่มเพิ่ม/ลด จำนวน และ ลบสินค้า */}
                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center justify-between sm:justify-start">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm">
                        <button 
                          onClick={() => decreaseQty(item.cartItemId)} 
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 text-sm font-bold text-gray-900 min-w-[24px] text-center">{item.qty}</span>
                        <button 
                          onClick={() => addToCart(item, item.selectedSize)} 
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* ปุ่มไอคอนลบออกมุมขวา */}
                      <div className="absolute top-0 right-0">
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
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

        {/* สรุปยอดสั่งซื้อ ด้านขวา */}
        <div className="mt-16 bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-8 sm:p-8 lg:mt-0 lg:col-span-4 rounded-3xl border border-gray-200/50 shadow-sm sticky top-6">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight border-b border-gray-200 pb-3">Order summary</h2>
          
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
              <dd className="text-sm font-bold text-gray-900">฿{subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200/60 pt-4">
              <dt className="text-sm font-medium text-gray-500">Shipping estimate</dt>
              <dd className="text-sm font-bold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-md text-xs">Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-black text-gray-900 uppercase tracking-tight">Order total</dt>
              <dd className="text-xl font-black text-gray-900">฿{subtotal.toLocaleString()}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate('/shipping')}
              className="w-full bg-gray-900 border border-transparent rounded-2xl shadow-md py-4 px-4 text-sm font-bold text-white hover:bg-black transition-all duration-200 flex justify-center items-center uppercase tracking-widest group transform hover:-translate-y-0.5"
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