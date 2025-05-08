// import React from 'react';

// export default function LandingPage() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-black">
//       {/* Landing content here */}
//     </div>
//   );
// } 

import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-red-900 rounded-3xl px-4">
    <div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ backgroundColor: '#FDFDFD' }}>
      {/* <h1 className="text-white text-3xl font-bold mb-8">Attends</h1> */}
      <img src="/img/logo.png" alt="Attends Logo" className="h-64 w-auto" />
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link href="/sign-up">
          {/* <button className="w-full bg-white text-red-900 font-semibold py-3 rounded-xl text-lg shadow-2xl transition hover:bg-gray-100">Get Started</button> */}
          <button className="w-full text-red-900 font-semibold py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-black-100" style={{ backgroundColor: '#FDFDFD', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.15)'}}>
            Get Starteddd
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