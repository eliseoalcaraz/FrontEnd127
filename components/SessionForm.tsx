'use client'

import React, { useState } from 'react'

import { sessionsSample } from '@/content/data'

interface SessionFormProps {
  onClose: () => void
  onCreate: (session: {
    session_id: number
    start_time: number // Unix timestamp in seconds
    end_time: number
    course_id: number   // Unix timestamp in seconds
  }) => void
}

const SessionForm: React.FC<SessionFormProps> = ({ onClose, onCreate }) => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const toUnix = (timeStr: string): number | null => {
    const date = new Date(timeStr)
    if (isNaN(date.getTime())) return null
    return Math.floor(date.getTime() / 1000) // Convert to Unix (seconds)
  }

  const handleSubmit = () => {
    const unixStart = toUnix(startTime)
    const unixEnd = toUnix(endTime)

    if (!unixStart || !unixEnd) {
      alert('Invalid date/time format. Please use a valid format (e.g., 2025-06-04T14:00).')
      return
    }

    const newSession = {
      session_id: sessionsSample.length + 1, // Incremental ID for simplicity
      start_time: unixStart,
      end_time: unixEnd,
      course_id: 1, // Assuming a static course ID for this example
    }

    onCreate(newSession)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Create New Session</h2>

        <div className="flex flex-col gap-1">
        <label htmlFor="startTime" className="text-sm font-medium text-gray-700">
            Start Time
        </label>
        <input
            id="startTime"
            type="datetime-local"
            className="border rounded px-3 py-2 w-full"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
        />
        </div>

        <div className="flex flex-col gap-1">
        <label htmlFor="endTime" className="text-sm font-medium text-gray-700">
            End Time
        </label>
        <input
            id="endTime"
            type="datetime-local"
            className="border rounded px-3 py-2 w-full"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
        />
        </div>

        <div className="flex justify-between mt-4">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
            Cancel
        </button>
        <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-myred text-white rounded hover:bg-red-600"
        >
            Create
        </button>
        </div>
    </div>
    </div>

  )
}

export default SessionForm
