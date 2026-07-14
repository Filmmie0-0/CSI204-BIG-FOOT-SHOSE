import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty, removeFromCart } = useCartStore();

  // คำนวณราคารวมทั้งหมด
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">Your cart is empty</h2>
        <p className="mt-4 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="inline-block mt-8 bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors uppercase text-sm tracking-widest">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase mb-10">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* รายการสินค้า */}
        <div className="lg:col-span-8">
          <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.cartItemId} className="flex py-6 sm:py-10">
                <div className="shrink-0">
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-24 h-24 rounded-md object-center object-cover sm:w-32 sm:h-32 bg-gray-100"
                  />
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link to={`/product/${item._id}`} className="font-medium text-gray-900 hover:text-gray-800 uppercase">
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Size: {item.selectedSize}</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">฿{item.price.toLocaleString()}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button onClick={() => decreaseQty(item.cartItemId)} className="p-2 text-gray-600 hover:text-black">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => addToCart(item, item.selectedSize)} className="p-2 text-gray-600 hover:text-black">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute top-0 right-0">
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500 transition-colors"
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

        {/* สรุปยอดสั่งซื้อ */}
        <div className="mt-16 bg-gray-50 px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4 rounded-sm">
          <h2 className="text-lg font-medium text-gray-900 uppercase">Order summary</h2>
          
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">฿{subtotal.toLocaleString()}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm text-gray-600">
                <span>Shipping estimate</span>
              </dt>
              <dd className="text-sm font-medium text-gray-900">Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900 uppercase">Order total</dt>
              <dd className="text-base font-medium text-gray-900">฿{subtotal.toLocaleString()}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/shipping')}
              className="w-full bg-black border border-transparent rounded-sm shadow-sm py-4 px-4 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex justify-center items-center uppercase tracking-widest transition-colors"
            >
              Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;