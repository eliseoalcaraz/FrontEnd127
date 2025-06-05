// frontend/app/(root)/[hosting_or_attending]/sessions/[id]/page.tsx
"use client";

import { useParams } from "next/navigation"; // Import useParams to get the session ID
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import Header from "@/components/Header";
import StatButton from "@/components/StatButton";

// Define the expected structure of a single attendance record from the new API
interface RawAttendanceRecord {
  attendance_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  status: "Present" | "Late" | "Absent";
  joined_at: number;
  user_geolocation_latitude: number | null;
  user_geolocation_longitude: number | null;
  proof_base64: string | null;
}

// Define the expected structure of the entire API response for session attendances
interface RawAttendanceSummaryResponse {
  session_id: number;
  course_id: number;
  session_start_time: number;
  session_end_time: number;
  attendances: RawAttendanceRecord[];
}

// Define the structure needed for your existing StatButton components and overall summary
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
  const params = useParams();
  const sessionId = params.id ? parseInt(params.id as string, 10) : null;

  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummaryData | null>(null);
  const [rawAttendanceRecords, setRawAttendanceRecords] = useState<
    RawAttendanceRecord[]
  >([]); // New state to store individual records
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
      const response = await fetch(`/api/sessions/${sessionId}/attendances`); // Using the new route
      const data:
        | RawAttendanceSummaryResponse
        | { message: string; error?: string } = await response.json();

      if (response.ok) {
        // Process the raw attendance data into the format needed for StatButtons
        const presentNames: string[] = [];
        const lateNames: string[] = [];
        const absentNames: string[] = [];
        let totalAttendees = 0;

        // Ensure data is of type RawAttendanceSummaryResponse before accessing .attendances
        if ("attendances" in data && Array.isArray(data.attendances)) {
          data.attendances.forEach((record) => {
            totalAttendees++;
            if (record.status === "Present") {
              presentNames.push(record.user_name);
            } else if (record.status === "Late") {
              lateNames.push(record.user_name);
            } else if (record.status === "Absent") {
              absentNames.push(record.user_name);
            }
          });

          setAttendanceSummary({
            present: { count: presentNames.length, names: presentNames },
            late: { count: lateNames.length, names: lateNames },
            absent: { count: absentNames.length, names: absentNames },
            total_attendees_recorded: totalAttendees,
            session_details: {
              session_id: data.session_id,
              course_id: data.course_id,
              start_time: data.session_start_time,
              end_time: data.session_end_time,
            },
          });
          setRawAttendanceRecords(data.attendances); // Store raw records
        } else {
          // Handle case where 'attendances' might be missing but response.ok is true (e.g., empty session)
          setAttendanceSummary({
            present: { count: 0, names: [] },
            late: { count: 0, names: [] },
            absent: { count: 0, names: [] },
            total_attendees_recorded: 0,
            session_details: {
              // Default session details if no attendance data comes
              session_id: sessionId,
              course_id: 0, // Placeholder
              start_time: Date.now() / 1000, // Placeholder
              end_time: Date.now() / 1000, // Placeholder
            },
          });
          setRawAttendanceRecords([]);
          toast.info(
            (data as { message: string }).message ||
              "No attendance records found for this session.",
          );
        }
      } else {
        // Handle error response from the API
        setError(
          (data as { error?: string; message?: string }).error ||
            (data as { message: string }).message ||
            "Failed to fetch attendance summary.",
        );
        toast.error(
          (data as { error?: string; message?: string }).error ||
            (data as { message: string }).message ||
            "Failed to fetch attendance summary.",
        );
        setAttendanceSummary(null);
        setRawAttendanceRecords([]);
      }
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
      setError("Network error or unexpected issue.");
      toast.error(
        "Network error or unexpected issue fetching attendance summary.",
      );
      setAttendanceSummary(null);
      setRawAttendanceRecords([]);
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

  // Helper function for date and time formatting
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
  const getStatusColor = (
    status: RawAttendanceRecord["status"] | undefined,
  ) => {
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
          onClick={() => window.history.back()}
        />
        <div className="flex-1 flex flex-col items-center justify-center text-red-500 p-4">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  // If no attendance summary but no error, means no records found.
  if (!attendanceSummary) {
    return (
      <div className="min-h-screen flex flex-col bg-white w-full">
        <Header
          title="Attendance Summary"
          onClick={() => window.history.back()}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p>No attendance summary available for this session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Header title={formattedDate} onClick={() => window.history.back()} />

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
      </div>

      {rawAttendanceRecords.length > 0 && (
        <div className="w-full px-4 mt-6 mb-10">
          <h3 className="text-xl font-bold text-myred mb-4 text-center">
            Individual Attendance Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rawAttendanceRecords.map((record) => (
              <div
                key={record.attendance_id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm"
              >
                <p className="font-semibold text-lg">{record.user_name}</p>
                <p className="text-sm text-gray-600">
                  Email: {record.user_email}
                </p>
                <p className={`font-medium ${getStatusColor(record.status)}`}>
                  Status: {record.status}
                </p>
                {record.joined_at && (
                  <p className="text-xs text-gray-500">
                    Joined: {formatTime(record.joined_at)}
                  </p>
                )}
                {record.user_geolocation_latitude !== null &&
                  record.user_geolocation_longitude !== null && (
                    <p className="text-xs text-gray-500">
                      Location: ({record.user_geolocation_latitude},{" "}
                      {record.user_geolocation_longitude})
                    </p>
                  )}
                {record.proof_base64 && (
                  <div className="mt-2 flex flex-col items-center">
                    <p className="text-xs text-gray-700">Proof:</p>
                    <img
                      src={`data:image/jpeg;base64,${record.proof_base64}`}
                      alt="Proof of attendance"
                      className="mt-1 w-40 h-auto object-contain border border-gray-300 rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
