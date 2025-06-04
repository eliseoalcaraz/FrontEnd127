'use client'

import React, { useState } from 'react'

interface JoinSessionFormProps {
  onClose: () => void
  onJoin: (data: {
    number1: number
    number2: number
    photo: File | null
  }) => void
}

const JoinSessionForm: React.FC<JoinSessionFormProps> = ({ onClose, onJoin }) => {
  const [number1, setNumber1] = useState(55)
  const [number2, setNumber2] = useState(31)
  const [photo, setPhoto] = useState<File | null>(null)

  const handleJoin = () => {
    if (!photo) {
      alert('Please upload a photo before joining.')
      return
    }

    onJoin({
      number1,
      number2,
      photo
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Join Session</h2>

        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <div className="flex flex-col flex-1 min-w-0">
                    <label className="text-sm font-medium">Latitude</label>
                    <input
                    type="number"
                    value={number1}
                    onChange={(e) => setNumber1(parseFloat(e.target.value))}
                    className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <label className="text-sm font-medium">Longitude</label>
                    <input
                    type="number"
                    value={number2}
                    onChange={(e) => setNumber2(parseFloat(e.target.value))}
                    className="border rounded px-3 py-2 w-full"
                    />
                </div>
            </div>
          <label className="text-sm font-medium">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="border rounded px-3 py-2"
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
            className="px-4 py-2 bg-myred text-white rounded hover:bg-red-800"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinSessionForm
