'use client'
import { useRouter } from 'next/navigation'

import TitleCard from '@/components/TitleCard'
import { sessionsSample } from '@/content/data'

import Header from '@/components/Header'

const AttendingCourse = () => {
  const sessions = sessionsSample;

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
        <Header title={getCourseName()} onBack={() => router.back()} />
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
