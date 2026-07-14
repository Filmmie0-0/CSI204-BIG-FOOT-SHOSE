import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import StripePayment from '../components/StripePayment';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [slipName, setSlipName] = useState('');
  const [slipUploading, setSlipUploading] = useState(false);
  const [slipError, setSlipError] = useState('');

  const handlePromptPayPay = async () => {
    setSlipUploading(true);
    setSlipError('');
    try {
      await api.put(`/orders/${order._id}/pay`, {
        payment_method: 'PromptPay / Bank Transfer',
        transaction_id: 'PP_SLIP_' + Date.now()
      });
      window.location.reload();
    } catch (err) {
      setSlipError('เกิดข้อผิดพลาดในการยืนยันสลิป');
    } finally {
      setSlipUploading(false);
    }
  };

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
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {order.payment_method || 'Credit / Debit Card'}
            </p>
            
            {order.order_status !== 'pending' ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-sm text-sm border border-green-200">
                Paid (ชำระเงินเรียบร้อยแล้ว)
              </div>
            ) : (
              <div>
                <div className="bg-red-50 text-red-700 p-3 rounded-sm text-sm border border-red-200 mb-4">
                  Not Paid (ยังไม่ชำระเงิน)
                </div>

                {/* 1. PromptPay Flow */}
                {order.payment_method === 'PromptPay / Bank Transfer' && (
                  <div className="border border-gray-200 p-4 rounded bg-gray-50 flex flex-col items-center space-y-4">
                    <p className="text-sm font-semibold text-gray-800 text-center">
                      สแกน QR Code เพื่อโอนเงินเข้าบัญชีพร้อมเพย์
                    </p>
                    <div className="bg-white p-4 border border-gray-200 rounded shadow-sm">
                      <img 
                        src={`https://promptpay.io/0987654321/${order.total_amount}.png`} 
                        alt="PromptPay QR Code" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                    <div className="text-xs text-gray-600 text-center leading-relaxed">
                      <span className="font-bold text-gray-800 text-sm">พร้อมเพย์: 098-765-4321</span><br />
                      บจก. บิ๊กฟุต ชูส์ (Big Foot Shoes Co., Ltd.)<br />
                      ยอดโอนที่ถูกต้อง: <span className="font-bold text-[#ff7f50] text-sm">฿{order.total_amount.toLocaleString()}</span>
                    </div>

                    <div className="w-full border-t border-gray-200 pt-4">
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">อัปโหลดสลิปการโอนเงิน</label>
                      <div className="flex items-center space-x-2">
                        <label className="bg-white border border-gray-300 hover:border-gray-400 text-gray-750 text-xs px-3 py-2 rounded cursor-pointer transition-colors shadow-sm">
                          เลือกรูปภาพสลิป
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setSlipName(e.target.files[0].name);
                              }
                            }}
                            className="hidden" 
                          />
                        </label>
                        <span className="text-xs text-gray-500 truncate max-w-xs">{slipName || 'ไม่ได้เลือกไฟล์ใดๆ'}</span>
                      </div>
                    </div>

                    {slipError && <div className="text-red-500 text-xs w-full">{slipError}</div>}

                    <button
                      disabled={slipUploading || !slipName}
                      onClick={handlePromptPayPay}
                      className="w-full bg-[#ff7f50] hover:bg-[#e06b3e] text-white text-xs py-3 uppercase tracking-widest font-semibold rounded shadow transition-colors disabled:bg-gray-400"
                    >
                      {slipUploading ? 'กำลังประมวลผล...' : 'แจ้งโอนเงิน (Confirm Bank Transfer)'}
                    </button>
                  </div>
                )}

                {/* 2. Credit / Debit Card Flow */}
                {(order.payment_method === 'Credit / Debit Card' || !order.payment_method) && (
                  <StripePayment orderId={order._id} onSuccess={() => window.location.reload()} />
                )}

                {/* 3. Cash On Delivery Flow */}
                {order.payment_method === 'Cash On Delivery' && (
                  <div className="border border-blue-200 p-4 rounded bg-blue-50 text-blue-800 space-y-4">
                    <p className="text-sm font-semibold">
                      📦 ชำระเงินปลายทาง (Cash On Delivery)
                    </p>
                    <p className="text-xs leading-relaxed">
                      คำสั่งซื้อได้รับการบันทึกเรียบร้อยแล้ว กรุณาเตรียมเงินสดจำนวน <span className="font-bold text-lg">฿{order.total_amount.toLocaleString()}</span> เพื่อชำระให้กับเจ้าหน้าที่จัดส่งสินค้าเมื่อพัสดุเดินทางไปถึง
                    </p>
                    
                    {/* Mock delivery confirmation button for simulation */}
                    <div className="border-t border-blue-100 pt-3 flex flex-col space-y-2">
                      <span className="text-[10px] text-blue-500 uppercase tracking-widest font-bold">
                        สำหรับเจ้าหน้าที่จัดส่งสินค้า (จำลองการรับเงิน)
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            await api.put(`/orders/${order._id}/pay`, {
                              payment_method: 'Cash On Delivery',
                              transaction_id: 'COD_CASH_' + Date.now()
                            });
                            window.location.reload();
                          } catch (err) {
                            alert('เกิดข้อผิดพลาดในการยืนยันการรับเงินสด');
                          }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded transition-colors"
                      >
                        ยืนยันการได้รับเงินสดปลายทาง
                      </button>
                    </div>
                  </div>
                )}
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