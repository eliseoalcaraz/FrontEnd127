//this is a copy of the root path/directory. for editing of the dashboard and other pages

"use client"

import { Button } from "@/components/ui/button"

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full gap-10 pt-10">
      {/* Email Button at the top */}
      <div className="mb-60">
        <Button className="bg-back text-white font-medium text-lg px-20 py-8 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]">
          <img src="/profile.svg" alt="Profile" className="w-10 h-10 mr-2" />
          elipalcaraz@up.edu.ph
        </Button>
      </div>

      {/* Hosting / Attending Buttons centered below */}
      <div className="flex justify-center items-center gap-10 w-full max-w-md">
        <div className="flex flex-col items-center">
          <Button className="bg-back w-40 h-40 flex items-center justify-center">
            <img src="/create.svg" alt="Create" className="w-20 h-20" />
          </Button>
          <div className="text-xl font-bold text-back mt-2">Hosting</div>
        </div>
        <div className="flex flex-col items-center">
          <Button className="bg-back w-40 h-40 flex items-center justify-center">
            <img src="/enter.svg" alt="Enter" className="w-20 h-20" />
          </Button>
          <div className="text-xl font-bold text-back mt-2">Attending</div>
        </div>
      </div>
    </div>
  )
}

export default Home
