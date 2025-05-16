"use client"

import CourseCard from '@/components/CourseCard'
import React, { useState } from 'react'
import { courses as initialCourses } from '@/content/data'

const Hosting = () => {

  const [courses, setCourses] = useState(initialCourses)

  const handleCreateCourse = () => {
    //create a separate component for creating the course

    const newCourse = {
      id: courses.length + 1,
      title: "New Course"
    }
    setCourses(prev => [...prev, newCourse])
  }

  return (
    <div className='w-full min-h-screen flex justify-center'>
      <div className='min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10 pt-10 mb-10'>
        <div className='w-full p-8'>
          <div className='flex gap-2 items-center justify-center bg-myred text-white font-medium text-lg px-20 py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]'>
            <img src="/create.svg" alt="Create" className="w-8 h-8" />
            <p className='underline'>Hosting</p>
          </div>
        </div>
        <div className="flex flex-col w-full px-8 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} title={course.title} />
          ))}
        </div>
        <div className='bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center' onClick={handleCreateCourse}>
          <img src="/add.svg" alt="Create" className="w-8 h-8" />
        </div>
      </div>
    </div>
  )
}

export default Hosting
