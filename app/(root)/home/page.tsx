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
  }, [email]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full pt-10 mx-2">
      {/* Email Button at the top */}
      <div className="mb-60">
        <Button className="bg-myred hover:bg-red-800 text-white font-medium text-lg px-20 py-8 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]" onClick={() => router.push('/profile')}>
          <img src="/profile.svg" alt="Profile" className="w-10 h-10 mr-2" />
          {email}
        </Button>
      </div>

      {/* Hosting / Attending Buttons centered below */}
      <div className="flex justify-center items-center gap-10 w-full max-w-md">
        <div className="flex flex-col items-center">
          <Button className="bg-myred w-40 h-40 flex items-center justify-center hover:bg-red-800" onClick={() => router.push('/hosting')}>
            <img src="/create.svg" alt="Create" className="w-14 h-14 self-center" />
          </Button>
          <div className="text-xl font-bold text-black mt-2">Hosting</div>
        </div>
        <div className="flex flex-col items-center">
          <Button className="bg-myred w-40 h-40 flex items-center justify-center hover:bg-red-800" onClick={() => router.push('/attending')}>
            <img src="/enter.svg" alt="Enter" className="w-14 h-14 self-center" />
          </Button>
          <div className="text-xl font-bold text-black mt-2">Attending</div>
        </div>
      </div>
    </div>
  )
}

export default Home
