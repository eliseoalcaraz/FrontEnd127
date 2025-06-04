'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import TitleCard from '@/components/TitleCard'
import { sessionsSample } from '@/content/data'

const AttendingCourse = () => {
  const [sessions, setSessions] = useState(sessionsSample)

  const router = useRouter()

  const handleJoinSession = (id: number) => {
    router.push(`/attending/sessions/${id}`)
  }

  const getCourseName = () => {
    return 'Company'
  }

  const getDateSession = (start_time: number) => {
    const date = new Date(start_time * 1000)

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }

    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10 mb-10">
        <div className="w-full p-8">
          <div className="flex gap-2 items-center justify-center bg-myred text-white font-medium text-lg px-20 py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]">
            <img src="/create.svg" alt="Create" className="w-8 h-8" />
            <p className="underline">{getCourseName()}</p>
          </div>
        </div>

        <div className="flex flex-col w-full px-8 gap-6">
          {sessions.map((session) => (
            <TitleCard
              key={session.session_id}
              title={getDateSession(session.start_time)}
              onClick={() => handleJoinSession(session.session_id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AttendingCourse
