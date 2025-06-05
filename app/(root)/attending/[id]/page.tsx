// frontend/app/(root)/[hosting_or_attending]/sessions/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { toast } from "sonner"; // For notifications
import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an AuthContext

import CalendarCard from "@/components/CalendarCard";
import JoinSessionForm from "@/components/JoinSessionForm";
import CourseShow from "@/components/CourseShow";
import Header from "@/components/Header";
import { z } from "zod";

// Remove the mock data import
// import { sessionsSample } from "@/content/data";

// Define interfaces for your data structures (adjust as per your backend response)
interface Course {
  course_id: number;
  name: string;
  join_code: string;
  host_id: number;
  host_name: string;
  late_threshold_minutes: number;
  present_threshold_minutes: number;
  geolocation_latitude: number;
  geolocation_longitude: number;
  created_at: number; // Unix timestamp
}

interface Session {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
  // Add other session properties if your backend returns them
}

// Add AttendanceRecord interface here as it's needed for the check
interface AttendanceRecord {
  attendance_id: number;
  session_id: number;
  user_id: number;
  status: "Present" | "Late" | "Absent";
  late_minutes: number | null;
  joined_at: number;
  user_geolocation_latitude: number | null;
  user_geolocation_longitude: number | null;
  proof_base64: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const attendanceFormSchema = z.object({
  number1: z.coerce
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"), // Latitude
  number2: z.coerce
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"), // Longitude
  photo: z.any().optional(), // File input can be tricky with Zod for direct validation
});

const AttendingCourse = () => {
  const router = useRouter();
  const params = useParams(); // Get URL parameters
  const courseId = params.id ? parseInt(params.id as string, 10) : null; // Get course_id from URL

  const { isLoggedIn, loading: authLoading, user } = useAuth(); // Destructure user from useAuth

  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );

  const [showCourseInfo, setShowCourseInfo] = useState(false);

  // Function to fetch specific course details
  const fetchCourseDetails = useCallback(async () => {
    // Only fetch if auth is done loading, user is logged in, and courseId is available
    if (authLoading || !isLoggedIn || courseId === null) {
      setIsLoadingCourse(false); // Ensure loading state is false if we can't fetch
      return;
    }
    setIsLoadingCourse(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();

      if (response.ok) {
        setCourse(data); // Assuming backend returns the course object directly
      } else {
        toast.error(data.error || "Failed to fetch course details.");
        setCourse(null);
        router.push("/attending"); // Redirect if course not found or error
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Network error or unexpected issue fetching course details.");
      setCourse(null);
      router.push("/attending");
    } finally {
      setIsLoadingCourse(false);
    }
  }, [authLoading, isLoggedIn, courseId, router]); // Dependencies for useCallback

  // Function to fetch sessions for the specific course
  const fetchCourseSessions = useCallback(async () => {
    // Only fetch if auth is done loading, user is logged in, and courseId is available
    if (authLoading || !isLoggedIn || courseId === null) {
      setIsLoadingSessions(false); // Ensure loading state is false if we can't fetch
      return;
    }
    setIsLoadingSessions(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/sessions`);
      const data = await response.json();

      if (response.ok) {
        setSessions(data || []); // Assuming backend returns an array, or empty array if null/undefined
      } else {
        toast.error(data.error || "Failed to fetch sessions.");
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Network error or unexpected issue fetching sessions.");
      setSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [authLoading, isLoggedIn, courseId]); // Dependencies for useCallback

  // useEffect to trigger fetches on component mount or relevant dependency changes
  useEffect(() => {
    fetchCourseDetails();
    fetchCourseSessions();
  }, [fetchCourseDetails, fetchCourseSessions]); // Dependencies for useEffect

  const handleJoinSession = async (id: number) => {
    setSelectedSessionId(id);

    // Check if user is logged in and user object is available
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    try {
      // Fetch user's attendance records
      const attendanceResponse = await fetch(
        `/api/users/${user.id}/attendances`,
      );
      const attendanceData = await attendanceResponse.json();

      if (attendanceResponse.ok) {
        // Check if there's an existing attendance record for the selected session
        const existingAttendance = attendanceData.find(
          (record: AttendanceRecord) => record.session_id === id,
        );

        if (existingAttendance) {
          // If an attendance record exists, redirect to the session summary page
          toast.info("You have already marked attendance for this session.");
          router.push(`/attending/sessions/${id}`);
        } else {
          // No existing attendance, proceed to show the join form
          setShowJoinForm(true);
        }
      } else {
        // Handle error if fetching attendance records fails
        toast.error(
          attendanceData.message || "Failed to check attendance status.",
        );
        console.error(
          "Error checking attendance status:",
          attendanceData.error,
        );
        // Even if checking attendance fails, allow user to try marking if no specific error prevents it
        setShowJoinForm(true);
      }
    } catch (error) {
      console.error("Network error while checking attendance:", error);
      toast.error("Network error. Could not check attendance status.");
      // In case of network error, it's safer to not block the form, but let the marking attempt handle it
      setShowJoinForm(true);
    }
  };

  // const form = useForm<z.infer<typeof attendanceFormSchema>>({
  //   resolver: zodResolver(attendanceFormSchema),
  //   defaultValues: {
  //     number1: 0, // Default latitude
  //     number2: 0, // Default longitude
  //     photo: undefined,
  //   },
  // });

  // Function to convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URI scheme prefix (e.g., "data:image/jpeg;base64,")
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFormSubmit = async (
    data: z.infer<typeof attendanceFormSchema>,
  ) => {
    if (selectedSessionId === null) {
      toast.error("Session ID is missing.");
      return;
    }

    let proofBase64 = null;
    if (data.photo instanceof File) {
      try {
        proofBase64 = await fileToBase64(data.photo);
      } catch (error) {
        console.error("Error converting file to Base64:", error);
        toast.error("Failed to process image. Please try again.");
        return;
      }
    }

    try {
      const response = await fetch(
        `/api/sessions/${selectedSessionId}/attendances`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_geolocation_latitude: data.number1,
            user_geolocation_longitude: data.number2,
            proof_base64: proofBase64, // This will be null if no photo was provided
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Attendance marked successfully!");
        // Redirect to the session summary page on success
        router.push(`/attending/sessions/${selectedSessionId}`);
      } else {
        toast.error(result.error || "Failed to mark attendance.");
        console.error("Attendance marking error:", result.error);
      }
    } catch (error) {
      toast.error("Network error. Please try again later.");
      console.error("Network error during attendance marking:", error);
    }
  };

  const getDateSession = (start_time: number) => {
    const date = new Date(start_time * 1000); // Convert Unix timestamp to Date

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 12-hour format
    };

    return date.toLocaleDateString("en-US", options);
  };

  const handleUnenroll = useCallback(
    async (courseId: number) => {
      if (!user?.id) {
        toast.error("User not logged in.");
        return;
      }

      try {
        // Using the specified DELETE /enrollments route with only course_id in the body
        const response = await fetch("/api/enrollments", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course_id: courseId }), // Only course_id as per API spec
          credentials: "include", // Essential for sending session cookies (e.g., JWT, session ID)
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Unenrolled from course successfully!");
          setShowCourseInfo(false); // Close the CourseShow modal after successful unenrollment
        } else {
          // Use data.error from the backend's error response (e.g., "You are not enrolled in this course.")
          toast.error(data.error || "Failed to unenroll from course.");
          console.error("Unenroll error:", data);
        }
      } catch (error) {
        console.error("Network error during unenrollment:", error);
        toast.error("Network error during unenrollment.");
      }
    },
    [user?.id],
  ); // Dependency on user.id

  // --- Conditional Rendering for Loading/Error States ---
  if (authLoading || isLoadingCourse || isLoadingSessions) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading course and sessions...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view course details and sessions.</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Course not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="min-h-screen flex flex-col items-center justify-start w-full gap-10 mb-10">
        {/* Header */}
        <Header
          title="Course Details"
          onClick={() => router.push("/attending")}
        />

        {/* Course Info Box */}
        <div className="w-full max-w-xl bg-white border rounded-xl shadow p-6 flex flex-col gap-4 relative">
          <button
            className="absolute top-4 right-4 bg-myred text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
            onClick={() => setShowCourseInfo(true)}
          >
            Unenroll
          </button>

          <div>
            <span className="block text-xs text-gray-500 font-semibold">
              Course Name
            </span>
            <span className="block text-lg font-bold text-myred">
              {course.name}
            </span>
          </div>

          <div>
            <span className="block text-xs text-gray-500 font-semibold">
              Join Code
            </span>
            <span className="block text-base font-mono">
              {course.join_code}
            </span>
          </div>

          <div className="flex gap-6">
            <div>
              <span className="block text-xs text-gray-500 font-semibold">
                Late Threshold (min)
              </span>
              <span className="block text-base">
                {course.late_threshold_minutes}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-semibold">
                Present Threshold (min)
              </span>
              <span className="block text-base">
                {course.present_threshold_minutes}
              </span>
            </div>
          </div>

          {course.geolocation_latitude !== null &&
            course.geolocation_longitude !== null && (
              <div>
                <span className="block text-xs text-gray-500 font-semibold">
                  Geolocation
                </span>
                <span className="block text-base">
                  {course.geolocation_latitude}, {course.geolocation_longitude}
                </span>
              </div>
            )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full px-8 gap-6">
          {sessions.length === 0 ? (
            <p className="text-center text-gray-600">
              No sessions available for this course yet.
            </p>
          ) : (
            sessions.map((session) => (
              <CalendarCard
                key={session.session_id}
                title={getDateSession(session.start_time)}
                onClick={() => handleJoinSession(session.session_id)}
              />
            ))
          )}
        </div>
        {showCourseInfo && (
          <CourseShow
            course={course}
            onCancel={() => setShowCourseInfo(false)}
            onUnenroll={() => {
              handleUnenroll(courseId ?? course.course_id);
              toast.success("Unenrolled from course!");
              setShowCourseInfo(false);
              router.push("/attending");
            }}
          />
        )}
        {showJoinForm && (
          <JoinSessionForm
            onClose={() => setShowJoinForm(false)}
            onJoin={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AttendingCourse;
