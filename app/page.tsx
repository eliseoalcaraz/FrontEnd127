import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4" 
         style={{ 
           background: 'linear-gradient(180deg, black 0%, rgba(140, 0, 0, 1) 50%, rgba(77, 0, 0, 1) 100%)'
         }}>
      
      {/* Logo */}
      <img src="/Logo.png" alt="Attends Logo" className="h-32 w-auto mb-4" />
      
      {/* Attends Text */}
      <h1 className="text-white mb-16" 
          style={{ 
            fontFamily: 'var(--font-bree-serif)',
            fontWeight: 400, 
            fontSize: '40px', 
            letterSpacing: '0.05em' 
          }}>
        ATTENDS
      </h1>
      
      {/* Buttons Container */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        
        {/* Get Started Button */}
        <Link href="/sign-up">
          <button className="w-full bg-transparent text-white py-3 text-lg transition-all duration-300 hover:bg-[rgba(15,110,67,1)]" 
                  style={{ 
                    border: '2px solid rgba(10, 245, 139, 1)',
                    borderRadius: '16px',
                    fontFamily: 'var(--font-karma)',
                    fontWeight: 400,
                    fontSize: '18px'
                  }}>
            Get Started
          </button>
        </Link>
        
        {/* Already have an account Button */}
        <Link href="/sign-in">
          <button className="w-full text-white py-3 transition-all duration-300 hover:bg-transparent" 
                  style={{ 
                    backgroundColor: 'rgba(15, 110, 67, 1)',
                    border: '2px solid rgba(42, 184, 79, 1)',
                    borderRadius: '16px',
                    fontFamily: 'var(--font-karma)',
                    fontWeight: 400,
                    fontSize: '18px'
                  }}>
            Already have an account?
          </button>
        </Link>
        
      </div>
    </div>
  );
}