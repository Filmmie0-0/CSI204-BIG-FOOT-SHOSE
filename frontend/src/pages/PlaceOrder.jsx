import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cart, shippingAddress, paymentMethod, savePaymentMethod, clearCart } = useCartStore();
  const { userInfo } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 10000 ? 0 : 100; 
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrderHandler = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/orders', {
        orderItems: cart,
        shippingAddress,
        paymentMethod, // ส่งวิธีชำระเงินไปด้วย
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: userInfo ? userInfo._id : undefined
      });

      clearCart();
      navigate(`/order/${data._id}`); 
    } catch (err) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่าง');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold uppercase text-gray-900">Your cart is empty</h2>
        <Link to="/" className="mt-4 text-sm uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
          Go back to shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase mb-10">
        Order Summary
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-4 tracking-wide">Shipping Details</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              <span className="font-medium text-gray-900">Address: </span>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* --- เพิ่มกล่องเลือกวิธีชำระเงิน --- */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-4 tracking-wide">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="PromptPay / Bank Transfer" 
                  checked={paymentMethod === 'PromptPay / Bank Transfer'}
                  onChange={(e) => savePaymentMethod(e.target.value)}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700">PromptPay / Bank Transfer</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Credit / Debit Card" 
                  checked={paymentMethod === 'Credit / Debit Card'}
                  onChange={(e) => savePaymentMethod(e.target.value)}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700">Credit / Debit Card</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="Cash On Delivery" 
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={(e) => savePaymentMethod(e.target.value)}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-700">Cash On Delivery</span>
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-4 tracking-wide">Order Items</h2>
            <ul className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <li key={index} className="py-4 flex items-center">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} alt={item.name} className="w-16 h-16 rounded-sm object-cover bg-gray-100" />
                  <div className="ml-4 flex-1">
                    <Link to={`/product/${item._id}`} className="text-sm font-medium text-gray-900 uppercase hover:text-gray-600">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900 text-right">
                    <span className="text-gray-500 font-normal mr-2">{item.qty} x ฿{item.price.toLocaleString()}</span>
                    ฿{(item.qty * item.price).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 lg:mt-0 lg:col-span-4">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-6 tracking-wide">Order Total</h2>
            
            {error && <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">{error}</div>}

            <dl className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <dt>Items Subtotal</dt>
                <dd className="font-medium text-gray-900">฿{itemsPrice.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <dt>Shipping</dt>
                <dd className="font-medium text-gray-900">
                  {shippingPrice === 0 ? 'Free' : `฿${shippingPrice.toLocaleString()}`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-medium text-gray-900">
                <dt className="uppercase">Total</dt>
                <dd>฿{totalPrice.toLocaleString()}</dd>
              </div>
            </dl>

            <button
              onClick={placeOrderHandler}
              disabled={loading}
              className={`mt-8 w-full border border-transparent rounded-sm py-4 px-4 text-sm font-medium text-white uppercase tracking-widest transition-colors ${
                loading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {loading ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;