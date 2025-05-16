import CourseCard from '@/components/CourseCard'
import React from 'react'
import { courses } from '@/content/data'

const Attending = () => {
  return (
    <div className='w-full min-h-screen flex justify-center'>
      <div className='min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10'>
        <div className='w-full p-8'>
          <div className='flex gap-2 items-center justify-center bg-myred text-white font-medium text-lg px-20 py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]'>
            <img src="/enter.svg" alt="Create" className="w-8 h-8" />
            <p className='underline'>Attending</p>
          </div>
        </div>
        <div className="flex flex-col w-full px-8 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} title={course.title} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Attending