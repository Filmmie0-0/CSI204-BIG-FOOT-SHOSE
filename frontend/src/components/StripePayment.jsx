import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

// Note: Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'); 

const CheckoutForm = ({ orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { userInfo } = useAuthStore();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.post(`/orders/${orderId}/create-payment-intent`, {}, config);
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError('Could not initialize payment.');
      }
    };
    fetchClientSecret();
  }, [orderId, userInfo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await api.put(`/orders/${orderId}/pay`, {
          payment_method: 'credit_card',
          transaction_id: payload.paymentIntent.id
        }, config);
        onSuccess();
      } catch (err) {
        setError('Payment succeeded but failed to update order status.');
      }
    }
  };

  const handleMockPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await api.put(`/orders/${orderId}/pay`, {
        payment_method: 'Credit / Debit Card (Mock)',
        transaction_id: 'MOCK_TX_' + Date.now()
      }, config);
      onSuccess();
    } catch (err) {
      setError('Mock payment failed');
      setProcessing(false);
    }
  };

  if (error === 'Could not initialize payment.') {
    return (
      <div className="mt-4 p-4 border rounded-4 bg-light text-center shadow-sm">
        <p className="text-secondary small mb-3 fw-bold">
          [Demo Mode] ระบบชำระเงินขัดข้อง (ไม่มี API Key จริง) <br/> 
          ท่านสามารถจำลองการสแกน QR Code ด้านล่างเพื่อชำระเงิน
        </p>
        
        <div className="bg-white p-3 rounded-4 shadow-sm border mx-auto mb-3 d-flex flex-column align-items-center" style={{ width: 'fit-content' }}>
          <img 
            src={`https://promptpay.io/0987654321.png`} 
            alt="Demo QR Code" 
            className="img-fluid mb-2" 
            style={{ width: '150px', height: '150px', objectFit: 'contain' }}
          />
          <span className="small fw-bold text-muted">แสกนเพื่อจ่ายเงิน (Demo)</span>
        </div>

        <button 
          onClick={handleMockPayment}
          disabled={processing}
          className="btn w-100 py-3 text-uppercase fw-bold rounded-pill text-white shadow-sm border-0"
          style={{ letterSpacing: '1px', backgroundColor: '#ff5722', transition: 'all 0.3s' }}
          onMouseEnter={(e) => { if(!e.target.disabled) { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 10px 20px rgba(255,87,34,0.3)'; } }} 
          onMouseLeave={(e) => { if(!e.target.disabled) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'; } }}
        >
          {processing ? 'Processing...' : 'จำลองการสแกนจ่ายสำเร็จ (Confirm Mock Payment)'}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 d-flex flex-column gap-3">
      <div className="p-3 border rounded-3 bg-white shadow-sm">
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
      </div>
      {error && <div className="text-danger small">{error}</div>}
      <button 
        disabled={processing || !stripe || !clientSecret}
        className="btn w-100 py-3 text-uppercase fw-bold rounded-pill text-white shadow-sm border-0"
        style={{ letterSpacing: '1px', backgroundColor: '#ff5722', transition: 'all 0.3s' }}
        onMouseEnter={(e) => { if(!e.target.disabled) { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 10px 20px rgba(255,87,34,0.3)'; } }} 
        onMouseLeave={(e) => { if(!e.target.disabled) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'; } }}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const StripePayment = ({ orderId, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderId={orderId} onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripePayment;
