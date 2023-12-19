import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const Error404Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 ">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <p className="text-6xl font-bold text-gray-700">Page Not Found</p>
      <p className="mt-4 text-xl text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        to="/" 
    
      >
        <Button>Return Home</Button>
      </Link>
    </div>
  );
};

export default Error404Page;
