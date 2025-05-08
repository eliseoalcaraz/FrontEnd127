// import AuthForm from "@/components/AuthForm"
// import Link from 'next/link';
// import React from 'react';

// const Page = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-900 to-red-800 px-4">
//       {/* Logo and Title Section */}
//       <div className="text-center mb-8">
//         <img src="/img/logo.png" alt="Attends Logo" className="h-32 w-auto mx-auto mb-4" />
//         <h1 className="text-white text-3xl font-bold">Welcome to Attends</h1>
//         <p className="text-white/80 mt-2">Create your account to get started</p>
//       </div>

//       {/* Form Section */}
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <AuthForm type="sign-up" />
//       </div>

//       {/* Footer Section */}
//       <div className="mt-8 text-center">
//         <p className="text-white/80">
//           Already have an account?{' '}
//           <Link href="/auth/login" className="text-white font-semibold hover:underline">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Page



// import AuthForm from "@/components/AuthForm"
// import Link from 'next/link';
// import React from 'react';

// const Page = () => {
//   return (
//     <div className="w-full max-w-md">  {/* Changed from min-h-screen to w-full max-w-md */}
//       {/* Logo and Title Section */}
//       <div className="text-center mb-8">
//         <img src="/img/logo.png" alt="Attends Logo" className="h-32 w-auto mx-auto mb-4" />
//         <h1 className="text-white text-3xl font-bold">Welcome to Attends</h1>
//         <p className="text-white/80 mt-2">Create your account to get started</p>
//       </div>

//       {/* Form Section */}
//       <div className="w-full bg-white rounded-2xl shadow-xl p-8">
//         <AuthForm type="sign-up" />
//       </div>

//       {/* Footer Section */}
//       <div className="mt-8 text-center">
//         <p className="text-white/80">
//           Already have an account?{' '}
//           <Link href="/sign-in" className="text-white font-semibold hover:underline">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Page

import AuthForm from "@/components/AuthForm"

const Page = () => {
  return <AuthForm type="sign-up"/>
}

export default Page