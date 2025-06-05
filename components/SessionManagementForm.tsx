// components/SessionManagementForm.tsx
'use client';

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface Session {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
}

interface SessionManagementFormProps {
  session: Session;
  onClose: () => void;
  onUpdate: (sessionId: number, newEndTime: number) => void;
  onDelete: (sessionId: number) => void;
}

const SessionManagementForm: React.FC<SessionManagementFormProps> = ({
  session,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [editedEndTime, setEditedEndTime] = useState<string>("");

  useEffect(() => {
    // Convert UNIX timestamp (seconds) to a Date object, then to ISO string for datetime-local input
    if (session.end_time) {
      const endDate = new Date(session.end_time * 1000);
      setEditedEndTime(endDate.toISOString().slice(0, 16)); // Format to "YYYY-MM-DDTHH:mm"
    } else {
      setEditedEndTime("");
    }
  }, [session.end_time]);

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEndTime(e.target.value);
  };

  const handleSubmitUpdate = async () => {
    if (!editedEndTime) {
      toast.error("End time cannot be empty.");
      return;
    }
    const newEndTimeTimestamp = Math.floor(new Date(editedEndTime).getTime() / 1000);
    // Ensure new end time is after start time
    if (newEndTimeTimestamp <= session.start_time) {
      toast.error("End time must be after the session's start time.");
      return;
    }
    onUpdate(session.session_id, newEndTimeTimestamp);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      onDelete(session.session_id);
    }
  };

  const getFormattedDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Manage Session</h2>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Start Time:</span>{" "}
          {getFormattedDateTime(session.start_time)}
        </p>
        <div className="mb-4">
          <label htmlFor="endTime" className="block text-gray-700 text-sm font-bold mb-2">
            End Time:
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={editedEndTime}
            onChange={handleEndTimeChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleSubmitUpdate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
          >
            Update
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionManagementForm;