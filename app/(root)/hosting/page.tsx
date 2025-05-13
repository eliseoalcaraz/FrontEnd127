import React from 'react'

const Hosting = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-start w-full gap-10 pt-10'>
      <div>
        <div className='flex  items-center  justify-center bg-myred text-white font-medium text-lg px-20  py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]'>
          <img src="/create.svg" alt="Create" className="w-8 h-8" />
          <p className='underline'>Hosting</p>
        </div>
      </div>
    </div>
  )
}

export default Hosting