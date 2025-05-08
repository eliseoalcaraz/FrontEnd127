import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-900 rounded-3xl px-4">
      <h1 className="text-white text-3xl font-bold mb-8">Attends</h1>
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link href="/auth/signup">
          <button className="w-full bg-white text-red-900 font-semibold py-3 rounded-xl text-lg shadow-md transition hover:bg-gray-100">Get Started</button>
        </Link>
        <Link href="/auth/login">
          <button className="w-full bg-red-800 bg-opacity-70 text-white py-3 rounded-xl text-base transition hover:bg-opacity-90">Already have an account?</button>
        </Link>
      </div>
    </div>
  );
} 