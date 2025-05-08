import React, { ReactNode } from 'react'

const RootLayout = ({children} : {children: ReactNode}) => {
  return (
    <div className='bg-white flex w-full min-h-screen'>{children}</div>
  )
}

export default RootLayout