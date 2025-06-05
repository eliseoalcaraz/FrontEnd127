"use client";

import { useState } from "react";
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
  onUpdate: (updatedSession: Session) => void;
  onDelete: (deletedSessionId: number) => void;
}

export default function SessionManagementForm({
  session,
  onClose,
  onUpdate,
  onDelete,
}: SessionManagementFormProps) {
  // Convert Unix timestamps to local datetime strings for input fields
  const originalStart = new Date(session.start_time).toLocaleDateString()
  const originalEnd = new Date(session.end_time).toLocaleDateString()

  const [startTime, setStartTime] = useState(originalStart);
  const [endTime, setEndTime] = useState(originalEnd);
  const [loading, setLoading] = useState(false);

  // Determine if there are any changes from the original session times
  const hasChanges = startTime !== originalStart || endTime !== originalEnd;

  /**
   * Formats a Unix timestamp into a human-readable date and time string.
   * @param unix The Unix timestamp to format.
   * @returns Formatted date and time string.
   */
  const formatTime = (unix: number) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(unix * 1000); // Convert seconds to milliseconds
    return date.toLocaleTimeString("en-US", options);
  };


  /**
   * Handles the update action for the session.
   * Converts local datetime strings back to Unix timestamps before sending to the API.
   */
  const handleUpdate = async () => {
    const updatedStart = new Date(startTime).getTime();
    const updatedEnd = new Date(endTime).getTime();

    // Validate the input times
    if (isNaN(updatedStart) || isNaN(updatedEnd)) {
      toast.error("Please enter valid start and end times.");
      return;
    }

    // Basic validation for end time not being before start time
    if (updatedEnd < updatedStart) {
      toast.error("End time cannot be before start time.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${session.session_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Convert milliseconds back to seconds for Unix timestamp
        body: JSON.stringify({
          start_time: Math.floor(updatedStart / 1000),
          end_time: Math.floor(updatedEnd / 1000),
        }),
      });

      if (!res.ok) {
        // Attempt to parse error message from response body
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update session");
      }

      const updated = await res.json();
      toast.success("Session updated successfully");
      onUpdate(updated); // Call the onUpdate prop with the new session data
      onClose(); // Close the form after successful update
    } catch (err: any) {
      toast.error(`Error updating session: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the delete action for the session.
   * Confirms with the user before proceeding with deletion.
   */
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this session?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${session.session_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete session");
      }

      toast.success("Session deleted successfully");
      onDelete(session.session_id); // Call the onDelete prop with the deleted session ID
      onClose(); // Close the form after successful deletion
    } catch (err: any) {
      toast.error(`Error deleting session: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        disabled={loading} // Disable close button during loading
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">Edit Session</h2>

      {/* Display current session times for reference */}
      <div className="mb-4 text-sm text-gray-600 text-center">
        <p>Current Start: {formatTime(session.start_time)}</p>
        <p>Current End: {formatTime(session.end_time)}</p>
      </div>

      <div className="mb-6">
        <label htmlFor="end-time" className="block text-sm font-semibold mb-1">End Time</label>
        <input
          id="end-time"
          type="datetime-local"
          className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          className="bg-myred text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Session"}
        </button>

        <button
          className={`px-4 py-2 rounded transition text-sm font-medium
            ${hasChanges && !loading
              ? "bg-blue-800 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`
          }
          onClick={handleUpdate}
          disabled={!hasChanges || loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}