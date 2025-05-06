import React, { ReactNode } from 'react'

const AuthLayout = ({ children }: {children: ReactNode}) => {
  return (
    <div className='flex items-center justify-center mx-auto max-w-7xl min-h-screen max-sm:px-4  bg-back'>{children}</div>
  )
}

export default AuthLayout