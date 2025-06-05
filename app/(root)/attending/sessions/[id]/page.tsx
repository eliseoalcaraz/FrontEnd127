// frontend/app/(root)/[hosting_or_attending]/sessions/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading session summary...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view session summaries.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="w-full min-h-screen flex justify-center relative"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #4D0000 20%, #D9A3A3 20%, #D9A3A3 100%)',
          boxShadow: '0px 4px 4px rgba(76, 0, 0, 0.4)'
        }}
      >
        <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-md mb-10">
          {/* Header section in dark area */}
          <div className="w-full pt-12 pb-4 flex justify-center items-center" style={{ height: '20vh' }}>
            <div 
              className="flex gap-2 items-center justify-center text-white px-20 py-5 cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]"
              style={{
                backgroundColor: '#890000',
                border: '1.5px solid #F7C9C9',
                borderRadius: '10px'
              }}
              onClick={() => router.back()}
            >
              <img src="/back.svg" alt="Back" className="w-8 h-8" />
              <p 
                className="underline" 
                style={{
                  fontFamily: 'Karma',
                  fontWeight: '300',
                  fontSize: '18px',
                  letterSpacing: '0.03em'
                }}
              >
                Session Summary
              </p>
            </div>
          </div>

          {/* Error container in light area */}
          <div className="flex flex-col w-full px-8 py-8 gap-6 flex-grow">
            <div className="flex items-center justify-center h-64">
              <p 
                className="text-center text-red-600 px-4"
                style={{
                  fontFamily: 'Karma',
                  fontWeight: '400',
                  fontSize: '16px',
                  letterSpacing: '0.03em'
                }}
              >
                Error: {error}
              </p>
            </div>
          </div>

          {/* Logo at lower-left - fixed position */}
          <div className="fixed bottom-8 left-8 z-40">
            <img src="/Logo.png" alt="Logo" className="w-12 h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div 
        className="w-full min-h-screen flex justify-center relative"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, #4D0000 20%, #D9A3A3 20%, #D9A3A3 100%)',
          boxShadow: '0px 4px 4px rgba(76, 0, 0, 0.4)'
        }}
      >
        <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-md mb-10">
          {/* Header section in dark area */}
          <div className="w-full pt-12 pb-4 flex justify-center items-center" style={{ height: '20vh' }}>
            <div 
              className="flex gap-2 items-center justify-center text-white px-20 py-5 cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]"
              style={{
                backgroundColor: '#890000',
                border: '1.5px solid #F7C9C9',
                borderRadius: '10px'
              }}
              onClick={() => router.back()}
            >
              <img src="/back.svg" alt="Back" className="w-8 h-8" />
              <p 
                className="underline" 
                style={{
                  fontFamily: 'Karma',
                  fontWeight: '300',
                  fontSize: '18px',
                  letterSpacing: '0.03em'
                }}
              >
                Session Summary
              </p>
            </div>
          </div>

          {/* No data container in light area */}
          <div className="flex flex-col w-full px-8 py-8 gap-6 flex-grow">
            <div className="flex items-center justify-center h-64">
              <p 
                className="text-center text-gray-600 px-4"
                style={{
                  fontFamily: 'Karma',
                  fontWeight: '400',
                  fontSize: '16px',
                  letterSpacing: '0.03em'
                }}
              >
                Session not found or inaccessible.
              </p>
            </div>
          </div>

          {/* Logo at lower-left - fixed position */}
          <div className="fixed bottom-8 left-8 z-40">
            <img src="/Logo.png" alt="Logo" className="w-12 h-12" />
          </div>
        </div>
      </div>
    );
  }

  // Once all data is loaded and available
  return (
    <div 
      className="w-full min-h-screen flex justify-center relative"
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #4D0000 20%, #D9A3A3 20%, #D9A3A3 100%)',
        boxShadow: '0px 4px 4px rgba(76, 0, 0, 0.4)'
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-md mb-10">
        {/* Header section in dark area */}
        <div className="w-full pt-12 pb-4 flex justify-center items-center" style={{ height: '20vh' }}>
          <div 
            className="flex gap-2 items-center justify-center text-white px-20 py-5 cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]"
            style={{
              backgroundColor: '#890000',
              border: '1.5px solid #F7C9C9',
              borderRadius: '10px'
            }}
            onClick={() => router.back()}
          >
            <img src="/back.svg" alt="Back" className="w-8 h-8" />
            <p 
              className="underline" 
              style={{
                fontFamily: 'Karma',
                fontWeight: '300',
                fontSize: '18px',
                letterSpacing: '0.03em'
              }}
            >
              {getDateSession(sessionData.start_time)}
            </p>
          </div>
        </div>

        {/* Session details container in light area */}
        <div className="flex flex-col w-full px-8 py-8 gap-6 flex-grow">
          {/* Course name section */}
          <div className="text-center mb-6">
            <h2 
              className="text-gray-800 mb-2"
              style={{
                fontFamily: 'Karma',
                fontWeight: '600',
                fontSize: '24px',
                letterSpacing: '0.03em'
              }}
            >
              Session Summary
            </h2>
            <p 
              className="text-gray-600"
              style={{
                fontFamily: 'Karma',
                fontWeight: '400',
                fontSize: '18px',
                letterSpacing: '0.03em'
              }}
            >
              {sessionData.course_name}
            </p>
          </div>

          {/* Session times card */}
          <div 
            className="bg-red-800 text-white px-6 py-6 shadow-lg"
            style={{
              fontFamily: 'Karma',
              fontWeight: '400',
              fontSize: '16px',
              letterSpacing: '0.03em',
              borderRadius: '12px'
            }}
          >
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Start Time:</span>{" "}
                <br />
                {formatTime(sessionData.start_time)}
              </div>
              <div>
                <span className="font-semibold">End Time:</span>{" "}
                <br />
                {formatTime(sessionData.end_time)}
              </div>
            </div>
          </div>

          {/* Attendance status card */}
          <div 
            className="bg-red-800 text-white px-6 py-6 shadow-lg"
            style={{
              fontFamily: 'Karma',
              fontWeight: '400',
              fontSize: '16px',
              letterSpacing: '0.03em',
              borderRadius: '12px'
            }}
          >
            {attendanceRecord ? (
              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Attendance Status:</span>
                  <br />
                  <span 
                    className={`text-lg font-semibold ${
                      attendanceRecord.status === "Present" ? "text-green-300" :
                      attendanceRecord.status === "Late" ? "text-yellow-300" :
                      "text-red-300"
                    }`}
                  >
                    {attendanceRecord.status}
                  </span>
                </div>
                
                {attendanceRecord.status === "Late" &&
                  attendanceRecord.late_minutes !== null && (
                    <div className="text-sm">
                      Late by {attendanceRecord.late_minutes} minutes
                    </div>
                  )}
                
                {attendanceRecord.joined_at &&
                  attendanceRecord.status !== "Absent" && (
                    <div className="text-sm">
                      <span className="font-semibold">Joined at:</span>
                      <br />
                      {formatTime(attendanceRecord.joined_at)}
                    </div>
                  )}
                
                {attendanceRecord.status === "Absent" &&
                  attendanceRecord.message && (
                    <div className="text-sm">
                      {attendanceRecord.message}
                    </div>
                  )}
              </div>
            ) : (
              <div>
                <span className="font-semibold">Attendance Status:</span>
                <br />
                <span className="text-gray-300">
                  Status not available
                </span>
              </div>
            )}
          </div>

          {/* Attendance details footer */}
          <div className="mt-8">
            <div 
              className="bg-red-800 text-white px-6 py-4 text-center shadow-lg"
              style={{
                fontFamily: 'Karma',
                fontWeight: '600',
                fontSize: '18px',
                letterSpacing: '0.03em',
                borderRadius: '12px'
              }}
            >
              Attendance Details
            </div>
          </div>
        </div>

        {/* Logo at lower-left - fixed position */}
        <div className="fixed bottom-8 left-8 z-40">
          <img src="/Logo.png" alt="Logo" className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;