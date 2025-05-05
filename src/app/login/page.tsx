import React from 'react'

const Signup = () => {

  const handleSubmit = () => {

  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#890000]">
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">Attends</h1>
        </div>
        <div className="bg-white rounded-t-3xl p-8 w-full max-w-md shadow-2xl md:mx-32">
          <div className="mb-8 mt-6">
            <input
              type="text"
              className="shadow appearance-none border-[0.3px] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline"
              placeholder="Email"
            />
          </div>
          <div className="mb-8">
            <input
              type="text"
              className="shadow appearance-none border-[0.3px] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus-shadow-outline"
              placeholder="Password"
            />
          </div>
          <div className='mb-4 bg-primary-100 py-4 rounded-full text-white font-semibold text-center cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]'>
            Log In
          </div>
          <div className='text-black text-center'>
            Don't have an Account? <span className='font-bold text-primary-100 cursor-pointer'>Sign Up</span>
          </div>
        </div>
    </div>
  )
}

export default Signup