import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useCartStore();
  const navigate = useNavigate();

  // ดึงข้อมูลเก่ามาแสดง (ถ้าเคยกรอกไว้แล้ว)
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'Thailand');

  const submitHandler = (e) => {
    e.preventDefault();
    // บันทึกข้อมูลลง Zustand
    saveShippingAddress({ address, city, postalCode, country });
    
    // บันทึกเสร็จแล้วพาไปหน้าสรุปคำสั่งซื้อ (Place Order)
    navigate('/placeorder');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase text-center mb-10">
        Shipping Address
      </h1>

      <form onSubmit={submitHandler} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Apartment 4B"
            className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm py-3 px-4 focus:ring-black focus:border-black sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">City</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Bangkok"
            className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm py-3 px-4 focus:ring-black focus:border-black sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">Postal Code</label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="10110"
              className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm py-3 px-4 focus:ring-black focus:border-black sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide">Country</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm py-3 px-4 focus:ring-black focus:border-black sm:text-sm bg-gray-50"
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-black border border-transparent rounded-sm py-4 px-4 text-sm font-medium text-white hover:bg-gray-800 transition-colors uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Continue to Order Summary
          </button>
        </div>
      </form>
    </div>
  );
};

export default Shipping;