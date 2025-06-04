// frontend/components/SessionForm.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner"; // Import toast for notifications

// Remove the mock data import, as sessions will be created via API
// import { sessionsSample } from '@/content/data';

interface SessionFormProps {
  onClose: () => void;
  // onCreate will now trigger a re-fetch in the parent component
  // so we don't necessarily need to pass the new session object back here directly,
  // but it's good practice for consistency if the backend sends it.
  onCreate: (session?: {
    // Make session optional as parent might just re-fetch
    session_id: number;
    start_time: number;
    end_time: number;
    course_id: number;
    // ... any other properties returned by backend
  }) => void;
  courseId: number; // NEW: Prop to receive the course ID
}

const SessionForm: React.FC<SessionFormProps> = ({
  onClose,
  onCreate,
  courseId,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent double submissions

  const toUnix = (timeStr: string): number | null => {
    // Ensure the date string is in a format Date constructor can reliably parse (ISO 8601)
    // datetime-local inputs usually provide "YYYY-MM-DDTHH:MM" which is fine.
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string for conversion:", timeStr);
      return null;
    }
    return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp (seconds)
  };

  const handleSubmit = async () => {
    // Make handleSubmit async
    if (isSubmitting) return; // Prevent multiple clicks

    const unixStart = toUnix(startTime);
    const unixEnd = toUnix(endTime);

    if (!unixStart || !unixEnd) {
      toast.error(
        "Invalid date/time format. Please select valid start and end times.",
      );
      return;
    }

    if (unixStart >= unixEnd) {
      toast.error("Start time must be before end time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/sessions`, {
        // API endpoint for creating a session
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: unixStart,
          end_time: unixEnd,
          // course_id is already in the URL path, no need to send in body
        }),
      });

      const data = await response.json(); // Parse response data

      if (response.ok) {
        toast.success(data.message || "Session created successfully!");
        onCreate(data.session); // Pass the session object returned by backend, if any
        onClose(); // Close the form on success
      } else {
        // Handle specific error messages from the backend
        toast.error(data.error || "Failed to create session.");
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      toast.error("Network error or unexpected issue creating session.");
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Create New Session</h2>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="startTime"
            className="text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            id="startTime"
            type="datetime-local"
            className="border rounded px-3 py-2 w-full"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="endTime"
            className="text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            id="endTime"
            type="datetime-local"
            className="border rounded px-3 py-2 w-full"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-myred text-white rounded hover:bg-red-600"
            disabled={isSubmitting} // Disable during submission
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;
