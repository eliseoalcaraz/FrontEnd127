'use client'

import React, { useState } from 'react'

interface JoinSessionFormProps {
  onClose: () => void
  onJoin: (data: { code: string }) => void
}

const JoinSessionForm: React.FC<JoinSessionFormProps> = ({ onClose, onJoin }) => {
  const [joinCode, setJoinCode] = useState('')

  const handleJoin = () => {
    if (!joinCode.trim()) {
      alert('Please enter a join code.')
      return
    }

    onJoin({ code: joinCode.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Join Session</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="joinCode" className="text-sm font-medium text-gray-700">
            Join Code
          </label>
          <input
            id="joinCode"
            type="text"
            className="border rounded px-3 py-2"
            placeholder="Enter session code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
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
            onClick={handleJoin}
            className="px-4 py-2 bg-myred text-white rounded hover:bg-red-600"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinSessionForm
