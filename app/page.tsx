import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#FDFDFD' }}>
      <img src="/img/logo.png" alt="Attends Logo" className="h-64 w-auto" />
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link href="/sign-up">
        <button className="w-full text-red-900 font-semibold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-black-100" style={{ backgroundColor: '#FDFDFD', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.15)'}}>
            Get Started
          </button>
        </Link>
        <Link href="/sign-in">
          <button className="w-full bg-red-800 bg-opacity-70 text-white py-3 rounded-xl text-base transition hover:bg-opacity-90"
            style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.15)'}}
            >Already have an account?</button>
        </Link>
      </div>
    </div>
  );
} 