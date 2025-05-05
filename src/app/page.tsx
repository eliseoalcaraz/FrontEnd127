// app/page.tsx (or pages/index.tsx if using pages directory)
import Link from 'next/link';
import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#890000]">
      <div className="w-full max-w-md mx-auto flex-1 px-4 pt-4 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">Attends</h1>
        </div>
        <div className="w-full space-y-4 mb-16">
          <Link href="/signup" className="block w-full bg-white text-black py-5 rounded-2xl text-center font-medium">
            Get Started
          </Link>
          <Link href="/login" className="block w-full bg-[rgba(0,0,0,0.2)] text-white py-5 rounded-2xl text-center">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;