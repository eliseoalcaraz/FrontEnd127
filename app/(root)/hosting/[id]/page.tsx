'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import TitleCard from '@/components/TitleCard'
import SessionForm from '@/components/SessionForm'
import { sessionsSample } from '@/content/data'

const HostingCourse = () => {
  const [sessions, setSessions] = useState(sessionsSample)
  const [showForm, setShowForm] = useState(false)

  const router = useRouter()

  const handleCheckSession = (id: number) => {
    router.push(`/hosting/sessions/${id}`)
  }

  const handleCreateSession = (newSession: {
    session_id: number
    start_time: number
    end_time: number
    course_id: number
  }) => {
    setSessions(prev => [...prev, newSession])
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
              onClick={() => handleCheckSession(session.session_id)}
            />
          ))}
        </div>

        <div
          className="bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center self-end"
          onClick={() => setShowForm(true)}
        >
          <img src="/add.svg" alt="Create" className="w-8 h-8" />
        </div>

        {showForm && (
          <SessionForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateSession}
          />
        )}
      </div>
    </div>
  )
}

export default HostingCourse
