import CourseCard from '@/components/CourseCard'
import React from 'react'

const courses = [
  { id: 1, title: "Company" },
  { id: 2, title: "Sport Org" },
  { id: 3, title: "Group Project" },
  { id: 4, title: "Company 2" },
];

const Hosting = () => {
  return (
    <div className='w-full min-h-screen flex justify-center'>
      <div className='min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10 pt-10'>
        <div className='w-full p-8'>
          <div className='flex  items-center justify-center bg-myred text-white font-medium text-lg px-20 py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]'>
            <img src="/create.svg" alt="Create" className="w-8 h-8" />
            <p className='underline'>Hosting</p>
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

export default Hosting