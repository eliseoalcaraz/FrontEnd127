"use client"; // This layout uses client-side hooks

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook
import { useRouter } from "next/navigation"; // For client-side navigation

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn, loading } = useAuth(); // Get login status and loading state
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and user is already logged in
    if (!loading && isLoggedIn) {
      router.replace("/home"); // Redirect to your main app page
    }
  }, [isLoggedIn, loading, router]); // Re-run effect if these values change

  // While loading, or if already logged in, you might show a loading spinner
  // or just nothing before redirect. If already logged in, children won't render anyway.
  if (loading || isLoggedIn) {
    return null; // Or a loading spinner, or a simple message
  }
  return (
    <div className="flex items-center justify-center mx-auto max-w-7xl min-h-screen max-sm:px-4  bg-back">
      {children}
    </div>
  );
}

export default AuthLayout;
