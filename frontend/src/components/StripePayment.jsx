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
        await api.put(`/orders/${orderId}/pay`, {}, config);
        onSuccess();
      } catch (err) {
        setError('Payment succeeded but failed to update order status.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="p-3 border border-gray-300 rounded">
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button 
        disabled={processing || !stripe || !clientSecret}
        className="w-full bg-black text-white py-3 uppercase tracking-widest font-semibold disabled:bg-gray-400"
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
