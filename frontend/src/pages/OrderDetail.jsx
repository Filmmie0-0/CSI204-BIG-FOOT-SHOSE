import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import StripePayment from '../components/StripePayment';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-24 text-gray-500 uppercase tracking-widest">Loading Order...</div>;
  if (error) return <div className="text-center py-24 text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase mb-2">
        Order <span className="text-gray-500 text-lg">#{order._id}</span>
      </h1>
      <p className="text-sm text-gray-500 mb-10">Placed on {new Date(order.created_at || order.createdAt).toLocaleDateString()}</p>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8 space-y-8">
          
          {/* ข้อมูลการจัดส่งและสถานะ */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-4 tracking-wide">Shipping</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              <span className="font-medium text-gray-900">Name: </span>
              {order.user ? order.user.username : (order.user_id?.username || 'Guest Customer')}
              <br />
              <span className="font-medium text-gray-900">Address: </span>
              {order.shipping_address_id ? `${order.shipping_address_id.address_line1}, ${order.shipping_address_id.city}, ${order.shipping_address_id.postal_code}, ${order.shipping_address_id.state}` : 'N/A'}
            </p>
            {order.order_status === 'delivered' ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-sm text-sm border border-green-200">Delivered</div>
            ) : (
              <div className="bg-red-50 text-red-700 p-3 rounded-sm text-sm border border-red-200">Not Delivered</div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-4 tracking-wide">Payment Method</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">Credit / Debit Card</p>
            {order.order_status !== 'pending' ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-sm text-sm border border-green-200">Paid</div>
            ) : (
              <div>
                <div className="bg-red-50 text-red-700 p-3 rounded-sm text-sm border border-red-200 mb-4">Not Paid</div>
                <StripePayment orderId={order._id} onSuccess={() => window.location.reload()} />
              </div>
            )}
          </div>

          {/* รายการสินค้า */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-4 tracking-wide">Order Items</h2>
            <ul className="divide-y divide-gray-200">
              {order.orderItems.map((item, index) => (
                <li key={index} className="py-4 flex items-center">
                  <img src={item.product_id?.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop'} alt={item.product_id?.name || 'Product'} className="w-16 h-16 rounded-sm object-cover bg-gray-100" />
                  <div className="ml-4 flex-1">
                    <Link to={`/product/${item.product_id?._id}`} className="text-sm font-medium text-gray-900 uppercase hover:text-gray-600">
                      {item.product_id?.name || 'Unknown Product'}
                    </Link>
                    {item.selectedSize && <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize}</p>}
                  </div>
                  <div className="text-sm font-medium text-gray-900 text-right">
                    <span className="text-gray-500 font-normal mr-2">{item.quantity} x ฿{(item.price_per_unit || 0).toLocaleString()}</span>
                    ฿{((item.quantity || 1) * (item.price_per_unit || 0)).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* สรุปยอดเงิน */}
        <div className="mt-8 lg:mt-0 lg:col-span-4">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 uppercase mb-6 tracking-wide">Order Summary</h2>
            <dl className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-medium text-gray-900">
                <dt className="uppercase">Total</dt>
                <dd>฿{(order.total_amount || 0).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;