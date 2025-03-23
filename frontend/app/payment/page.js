'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

// Load your Stripe publishable key from your environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// PaymentForm for employers (making a payment)
function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [amount, setAmount] = useState(50); // default amount in dollars
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert amount from dollars to cents
      const amountInCents = Math.round(Number(amount) * 100);
      // Create a PaymentIntent with the dynamic amount
      const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount: amountInCents,
        currency: 'usd',
        milestoneId: 'SOME_MILESTONE_ID', // Replace with dynamic data if needed
        metadata: {}
      });

      // Confirm the card payment on the client
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccess('Payment successful!');
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.error || 'Payment failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Amount ($)</label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="p-4 border border-gray-300 rounded bg-gray-100">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#171717',
                '::placeholder': { color: '#a0aec0' },
              },
              invalid: { color: '#e53e3e' },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
}

// PaymentDetails for freelancers (showing payment information)
function PaymentDetails() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/payments/details')
      .then((res) => {
        // Expected response: { payment: { amount: number, status: string, date: string, ... } }
        setPaymentDetails(res.data.payment);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load payment details');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading payment details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
      <p>
        <strong>Amount:</strong> ${paymentDetails.amount / 100}
      </p>
      <p>
        <strong>Status:</strong> {paymentDetails.status}
      </p>
      <p>
        <strong>Date:</strong> {new Date(paymentDetails.date).toLocaleDateString()}
      </p>
      {/* Add any additional payment details as needed */}
    </div>
  );
}

// Main Payment Page: Render PaymentForm for employers and PaymentDetails for freelancers
export default function PaymentPage() {
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) setUserRole(role);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-md rounded-md p-8 w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Payment</h1>
          {userRole === 'employer' ? (
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          ) : (
            <PaymentDetails />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
