"use client";

import { useParams } from "next/navigation"; // Import useParams to get the session ID
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import StatButton from "@/components/StatButton";

// Define the expected structure of the attendance summary from the backend
interface AttendanceSummaryData {
  present: { count: number; names: string[] };
  late: { count: number; names: string[] };
  absent: { count: number; names: string[] };
  total_attendees_recorded: number;
  session_details: {
    session_id: number;
    course_id: number;
    start_time: number;
    end_time: number;
  };
}

export default function AttendanceSummaryPage() {
  // Renamed to AttendanceSummaryPage to avoid conflict with interface
  const params = useParams();
  const sessionId = params.id ? parseInt(params.id as string, 10) : null;

  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendanceSummary = useCallback(async () => {
    if (sessionId === null || isNaN(sessionId)) {
      setError("Invalid session ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/attendances`);
      const data = await response.json();

      if (response.ok) {
        setAttendanceSummary(data); // Backend returns { "summary": { ... } }
      } else {
        setError(
          data.error || data.message || "Failed to fetch attendance summary.",
        );
        toast.error(
          data.error || data.message || "Failed to fetch attendance summary.",
        );
        setAttendanceSummary(null);
      }
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
      setError("Network error or unexpected issue.");
      toast.error(
        "Network error or unexpected issue fetching attendance summary.",
      );
      setAttendanceSummary(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchAttendanceSummary();
  }, [fetchAttendanceSummary]);

  // Function to convert Unix timestamp to a readable date string
  const formatUnixTimestampToDate = (timestamp: number | undefined) => {
    if (!timestamp) return "Loading Date...";
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatUnixTimestampToDate(
    attendanceSummary?.session_details?.start_time,
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading attendance summary...</p>
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
              onClick={() => window.history.back()}
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
                Attendance Summary
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

  if (!attendanceSummary) {
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
              onClick={() => window.history.back()}
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
                Attendance Summary
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
                No attendance summary available for this session.
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
            onClick={() => window.history.back()}
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
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Attendance stats container in light area */}
        <div className="flex flex-col w-full px-8 py-8 gap-6 flex-grow">
          <div className="space-y-4 mt-4">
            <StatButton
              label="Present"
              count={attendanceSummary.present.count}
              names={attendanceSummary.present.names}
            />
            <StatButton
              label="Absent"
              count={attendanceSummary.absent.count}
              names={attendanceSummary.absent.names}
            />
            <StatButton
              label="Late"
              count={attendanceSummary.late.count}
              names={attendanceSummary.late.names}
            />
          </div>

          {/* Total attendees section */}
          <div className="mt-8 px-4">
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
              Total Attendees Recorded: {attendanceSummary.total_attendees_recorded}
            </div>
          </div>
        </div>

        {/* Logo at lower-left - fixed position */}
        <div className="fixed bottom-8 left-8 z-40">
          <img src="/home-logo.png" alt="Logo" className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
}