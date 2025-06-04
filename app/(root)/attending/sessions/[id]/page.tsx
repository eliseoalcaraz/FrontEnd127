// frontend/app/(root)/[hosting_or_attending]/sessions/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

import Header from "@/components/Header";

// Define interfaces for your data structures, matching backend responses
interface SessionDetails {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
  course_name: string; // This comes from the JOIN in the backend's /sessions/<id> route
  host_id: number; // This also comes from the JOIN
}

interface AttendanceRecord {
  attendance_id: number;
  session_id: number;
  user_id: number;
  status: "Present" | "Late" | "Absent";
  late_minutes: number | null;
  joined_at: number;
  message?: string; // Backend might send a message for "Absent" status
}

const SessionSummary = () => {
  const router = useRouter();
  const params = useParams(); // Get URL parameters
  // Ensure sessionId is parsed correctly from the dynamic route segment
  const sessionId = params.id ? parseInt(params.id as string, 10) : null;

  const { isLoggedIn, loading: authLoading, user } = useAuth(); // Assuming 'user' is available from AuthContext

  const [sessionData, setSessionData] = useState<SessionDetails | null>(null);
  const [attendanceRecord, setAttendanceRecord] =
    useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionAndAttendance = useCallback(async () => {
    // Prevent fetching if still authenticating, not logged in, user data is missing, or sessionId is invalid
    if (authLoading || !isLoggedIn || !user || sessionId === null) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      // 1. Fetch Session Details from /api/sessions/<session_id>
      const sessionResponse = await fetch(`/api/sessions/${sessionId}`);
      const sessionJson = await sessionResponse.json();

      if (!sessionResponse.ok) {
        // If session not found or forbidden, set error and redirect
        setError(sessionJson.error || "Failed to fetch session details.");
        toast.error(sessionJson.error || "Failed to fetch session details.");
        router.back(); // Or redirect to a fallback page like /attending or /hosting
        return;
      }
      setSessionData(sessionJson);

      // 2. Fetch User's Attendance Status for this Session from /api/sessions/<session_id>/my-attendance
      const attendanceResponse = await fetch(
        `/api/sessions/${sessionId}/attendances`,
      );
      const attendanceJson = await attendanceResponse.json();

      if (attendanceResponse.ok) {
        // Backend now returns { status: "Absent" } if no record, or the actual record
        setAttendanceRecord(attendanceJson);
      } else {
        // If there's an error fetching attendance, log it but don't block session display
        console.error(
          "Error fetching attendance status:",
          attendanceJson.error,
        );
        toast.error(
          attendanceJson.error || "Failed to fetch attendance status.",
        );
        setAttendanceRecord(null); // Ensure no old attendance data is displayed
      }
    } catch (err) {
      console.error("Network or unexpected error fetching data:", err);
      setError("Network error or unexpected issue fetching session data.");
      toast.error("Network error fetching session data.");
      setSessionData(null);
      setAttendanceRecord(null);
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isLoggedIn, user, sessionId, router]); // Dependencies for useCallback

  // Effect hook to trigger the data fetching
  useEffect(() => {
    fetchSessionAndAttendance();
  }, [fetchSessionAndAttendance]); // Re-run when fetch function itself changes (due to dependency changes)

  // Helper functions for date and time formatting
  const getDateSession = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp (seconds) to milliseconds
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (unix: number) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString("en-US", options);
  };

  // Helper function to get status color
  const getStatusColor = (status: AttendanceRecord["status"] | undefined) => {
    switch (status) {
      case "Present":
        return "text-green-600";
      case "Late":
        return "text-yellow-600";
      case "Absent":
        return "text-red-600";
      default:
        return "text-gray-600"; // Default color if status is undefined/null
    }
  };

  // --- Conditional Rendering for Loading/Error States ---
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Loading session summary...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Please log in to view session summaries.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Session not found or inaccessible.</p>
      </div>
    );
  }

  // Once all data is loaded and available
  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Header
        // Display session date in the header
        title={getDateSession(sessionData.start_time)}
        onBack={() => router.back()} // Allows going back to the previous page (e.g., course page)
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div>
          <h2 className="text-xl font-bold">Session Summary</h2>
          {/* Display the course name associated with the session */}
          <p className="text-gray-600">{sessionData.course_name}</p>
        </div>

        <div>
          <p>
            <span className="font-semibold">Start Time:</span>{" "}
            {formatTime(sessionData.start_time)}
          </p>
          <p>
            <span className="font-semibold">End Time:</span>{" "}
            {formatTime(sessionData.end_time)}
          </p>
        </div>

        <div>
          {attendanceRecord ? (
            <>
              <p
                className={`text-lg font-semibold ${getStatusColor(attendanceRecord.status)}`}
              >
                Status: {attendanceRecord.status}
              </p>
              {attendanceRecord.status === "Late" &&
                attendanceRecord.late_minutes !== null && (
                  <p className="text-sm text-gray-700">
                    Late by {attendanceRecord.late_minutes} minutes.
                  </p>
                )}
              {/* Show joined_at time if not absent and a record exists */}
              {attendanceRecord.joined_at &&
                attendanceRecord.status !== "Absent" && (
                  <p className="text-sm text-gray-700">
                    Joined at: {formatTime(attendanceRecord.joined_at)}
                  </p>
                )}
              {/* You might want to display a message if status was derived as "Absent" from backend */}
              {attendanceRecord.status === "Absent" &&
                attendanceRecord.message && (
                  <p className="text-sm text-gray-700">
                    {attendanceRecord.message}
                  </p>
                )}
            </>
          ) : (
            // Fallback if attendanceRecord is null (e.g., error fetching attendance)
            <p className="text-lg font-semibold text-gray-600">
              Attendance status not available.
            </p>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* "Ats" section. You can expand this to show more details later */}
        <p className="text-myred font-bold text-lg">Attendance Details</p>
      </div>
    </div>
  );
};

export default SessionSummary;
