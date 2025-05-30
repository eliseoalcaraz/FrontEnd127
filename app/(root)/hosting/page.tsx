"use client"

import CourseCard from '@/components/CourseCard'
import React, { useState } from 'react'
import { courses as initialCourses } from '@/content/data'
import CourseForm from '@/components/CourseForm'

const Hosting = () => {
  const [courses, setCourses] = useState(initialCourses)
  const [showForm, setShowForm] = useState(false)

  const handleCreateCourse = (title: string) => {
    const newCourse = {
      id: courses.length + 1,
      title,
    }
    setCourses(prev => [...prev, newCourse])
  }

  return (
    <div className='w-full min-h-screen flex justify-center'>
      <div className='min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10 mb-10'>
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
        <div
          className='bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center self-end'
          onClick={() => setShowForm(true)}
        >
          <img src="/add.svg" alt="Create" className="w-8 h-8" />
        </div>

        {showForm && (
          <CourseForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateCourse}
          />
        )}
      </div>
    </div>
  )
}

export default Hosting
