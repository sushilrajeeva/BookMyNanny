import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const PaymentSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-9xl font-bold text-green-600">✓</h1>
      <p className="text-6xl font-bold text-gray-700">Payment Successful</p>
      <p className="mt-4 text-xl text-gray-600">
        Thank you! Your payment has been processed successfully.
      </p>
      <Link to="/">
        <Button>Return to Homepage</Button>
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;
