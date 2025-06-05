import type { Metadata } from "next";
import { Geist, Geist_Mono, Karma, Bree_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const karma = Karma({
  variable: "--font-karma",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const breeSerif = Bree_Serif({
  variable: "--font-bree-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Attends",
  description: "Check your attendees",
  icons: {
    icon: '/home-logo.png',
    shortcut: '/home-logo.png',
    apple: '/home-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/home-logo.png" sizes="any" />
        <link rel="icon" type="image/png" href="/home-logo.png" />
        <link rel="apple-touch-icon" href="/home-logo.png" />
        <meta name="theme-color" content="#8B0000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${karma.variable} ${breeSerif.variable} antialiased bg-back`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}