"use client";

import { useParams } from "next/navigation"; // Import useParams to get the session ID
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import Header from "@/components/Header";
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
      <div className="min-h-screen flex flex-col bg-white w-full items-center justify-center">
        <p>Loading attendance summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white w-full">
        <Header
          title="Attendance Summary"
          onBack={() => window.history.back()}
        />
        <div className="flex-1 flex flex-col items-center justify-center text-red-500 p-4">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!attendanceSummary) {
    return (
      <div className="min-h-screen flex flex-col bg-white w-full">
        <Header
          title="Attendance Summary"
          onBack={() => window.history.back()}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p>No attendance summary available for this session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Header title={formattedDate} onBack={() => window.history.back()} />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
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

      <div className="p-4">
        <p className="text-myred font-bold text-lg">
          Total Attendees Recorded: {attendanceSummary.total_attendees_recorded}
        </p>
        {/* You can add more session details here if needed */}
      </div>
    </div>
  );
}
