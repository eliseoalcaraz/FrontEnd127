"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Home = () => {

  const router = useRouter();

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch('/api/auth/status');

        const data = await response.json();

        if (response.ok) {
          setEmail(data.user.email || "No email found");
        } else {
          console.error("Failed to fetch email:", data.message);
          setEmail("No email found");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    }

    fetchEmail();
  }, []);

  return (
    <>
      {/* Load Google Fonts */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Karma:wght@300;700&display=swap" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen w-full" style={{
        background: 'linear-gradient(180deg, #000000 0%, #4D0000 50%, #4D0000 100%)'
      }}>
        <div className="w-full min-h-screen flex flex-col" style={{
          background: 'linear-gradient(180deg, #000000 0%, #4D0000 50%, #4D0000 100%)'
        }}>
          {/* Header Section */}
          <div className="w-full py-12 flex justify-center" style={{
            background: 'linear-gradient(180deg, #000000 0%, #4D0000 50%, #4D0000 100%)',
            boxShadow: '0 4px 4px rgba(76, 0, 0, 0.4)'
          }}>
            <div className="max-w-2xl rounded-xl p-4 flex items-center justify-center gap-4" style={{
              backgroundColor: '#D9D9D9'
            }}>
              <div className="flex-shrink-0">
                <img src="/home-profile.svg" alt="Profile" style={{ width: '29.17px', height: '29.17px' }} />
              </div>
              <Button 
                className="text-left p-0 h-auto bg-transparent hover:bg-transparent border-none shadow-none text-lg underline" 
                style={{
                  fontFamily: 'Karma, serif',
                  fontWeight: 300,
                  color: '#890000'
                }}
                onClick={() => router.push('/profile')}
              >
                {email}
              </Button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center py-20" style={{
            backgroundColor: '#E8B4B4'
          }}>
            <div className="flex gap-16 justify-center">
              {/* Hosting Button */}
              <div className="flex flex-col items-center">
                <Button 
                  className="w-48 h-48 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-200 hover:-translate-y-2 hover:shadow-xl" 
                  style={{
                    backgroundColor: '#890000'
                  }}
                  onClick={() => router.push('/hosting')}
                >
                  <img 
                    src="/create.svg" 
                    alt="Create Event" 
                    className="brightness-0 invert" 
                    style={{ 
                      width: '60px', 
                      height: '60px'
                    }} 
                  />
                </Button>
                <div className="text-xl text-center" style={{
                  fontFamily: 'Karma, serif',
                  fontWeight: 700,
                  color: '#890000',
                  letterSpacing: '0.48px'
                }}>
                  Hosting
                </div>
              </div>
              
              {/* Attending Button */}
              <div className="flex flex-col items-center">
                <Button 
                  className="w-48 h-48 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-all duration-200 hover:-translate-y-2 hover:shadow-xl" 
                  style={{
                    backgroundColor: '#890000'
                  }}
                  onClick={() => router.push('/attending')}
                >
                  <img 
                    src="/enter.svg" 
                    alt="Enter Event" 
                    className="brightness-0 invert" 
                    style={{ 
                      width: '46.88px', 
                      height: '50px'
                    }} 
                  />
                </Button>
                <div className="text-xl text-center" style={{
                  fontFamily: 'Karma, serif',
                  fontWeight: 700,
                  color: '#890000',
                  letterSpacing: '0.48px'
                }}>
                  Attending
                </div>
              </div>
            </div>
          </div>
          
          {/* Logo */}
          <div className="absolute bottom-8 left-8 w-20">
            <img src="/Logo.png" alt="Logo" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home