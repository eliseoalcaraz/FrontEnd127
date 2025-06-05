import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{
        background: 'linear-gradient(167deg, #890000 0%, #890000 47.38%, #890000 100%)'
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h1 className="text-white text-4xl font-bold mb-10">Attends</h1>
      </div>
      <div className="w-full max-w-xs flex flex-col gap-4 mb-8">
        <Link href="/sign-up">
          <button
            className="w-full font-semibold py-5 rounded-xl text-base shadow-lg transition-all duration-300"
            style={{
              backgroundColor: '#fff',
              color: '#000',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
          >
            Get Started
          </button>
        </Link>
        <Link href="/sign-in">
          <button
            className="w-full py-5 rounded-xl text-base transition"
            style={{
              backgroundColor: 'rgba(60, 0, 0, 0.35)',
              color: '#fff'
            }}
          >
            Already have an account?
          </button>
        </Link>
      </div>
    </div>
  );
}