'use client'

import React, { useState } from 'react'

interface UpdateProfileFormProps {
  onClose: () => void
  onUpdate: (data: { name: string; email: string }) => void
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ onClose, onUpdate }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleUpdate = () => {
    if (!name.trim() || !email.trim()) {
      alert('Please enter both name and email.')
      return
    }

    onUpdate({ name: name.trim(), email: email.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Update Profile</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="border rounded px-3 py-2"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border rounded px-3 py-2"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfileForm
