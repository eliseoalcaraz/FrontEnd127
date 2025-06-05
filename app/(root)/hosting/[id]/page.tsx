"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

import SessionForm from "@/components/SessionForm";
import CourseForm2 from "@/components/CourseForm2"; // <--- IMPORT YOUR COURSE FORM HERE
import Header from "@/components/Header";
import CalendarCard from "@/components/CalendarCard";

interface Course {
  course_id: number;
  name: string;
  join_code: string;
  host_id: number;
  host_name: string;
  late_threshold_minutes: number;
  present_threshold_minutes: number;
  geolocation_latitude: number | null; // <--- ADD | null for robustness
  geolocation_longitude: number | null; // <--- ADD | null for robustness
  created_at: number;
}

// Ensure Session interface matches what your SessionForm expects for onCreate
interface Session {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
}

// Define the structure for CourseFormData expected by CourseForm
// This should match the initialCourseData prop type in CourseForm.tsx
interface CourseFormData {
  course_id?: number;
  name: string;
  join_code: string;
  geolocation_latitude: number | null;
  geolocation_longitude: number | null;
  present_threshold_minutes: number;
  late_threshold_minutes: number;
}

const HostingCourse = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;

  const { isLoggedIn, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [showSessionForm, setShowSessionForm] = useState(false); // Renamed from showForm for clarity
  const [showCourseForm, setShowCourseForm] = useState(false); // <--- NEW STATE FOR COURSE FORM

  const fetchCourseDetails = useCallback(async () => {
    if (authLoading || !isLoggedIn || courseId === null) {
      return;
    }
    setIsLoadingCourse(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();

      if (response.ok) {
        setCourse(data);
      } else {
        toast.error(data.error || "Failed to fetch course details.");
        setCourse(null);
        router.push("/hosting");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Network error or unexpected issue fetching course details.");
      setCourse(null);
      router.push("/hosting");
    } finally {
      setIsLoadingCourse(false);
    }
  }, [authLoading, isLoggedIn, courseId, router]);

  const fetchCourseSessions = useCallback(async () => {
    if (authLoading || !isLoggedIn || courseId === null) {
      return;
    }
    setIsLoadingSessions(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/sessions`);
      const data = await response.json();

      if (response.ok) {
        setSessions(data || []);
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
  }, [authLoading, isLoggedIn, courseId]);

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseSessions();
  }, [fetchCourseDetails, fetchCourseSessions]);

  const handleCheckSession = (id: number) => {
    router.push(`/hosting/sessions/${id}`);
  };

  // Handler for creating a new session
  const handleCreateSession = () => {
    setShowSessionForm(false);
    fetchCourseSessions(); // Re-fetch to ensure data consistency
  };

  // <--- NEW HANDLERS FOR COURSE FORM ---
  const handleUpdateCourse = async (
    id: number,
    updatedData: CourseFormData,
  ) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Include authorization token if needed, e.g., 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Course updated successfully!");
        fetchCourseDetails(); // Re-fetch course details to update UI
        setShowCourseForm(false); // Close the form
      } else {
        toast.error(data.error || "Failed to update course.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Network error or unexpected issue updating course.");
    }
  };

  const handleDeleteCourse = async (id: number) => {
    // Optional: Add a confirmation dialog before deleting
    if (
      !window.confirm(
        "Are you sure you want to delete this course? All associated sessions will also be removed.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        // Include authorization token if needed
      });

      if (response.ok) {
        toast.success("Course deleted successfully!");
        router.push("/hosting"); // Redirect to hosting page as course is deleted
        setShowCourseForm(false); // Close the form
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Network error or unexpected issue deleting course.");
    }
  };
  // <--- END NEW HANDLERS ---

  const getDateSession = (start_time: number) => {
    const date = new Date(start_time * 1000);

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
      <div className="min-h-screen flex flex-col items-center justify-start  w-full gap-10 mb-10">
        <Header title="Hosting" onClick={() => router.push("/hosting")} />
        <div className="w-full max-w-xl bg-white border rounded-xl shadow p-6 flex flex-col gap-3 relative">
          <button
            className="absolute top-4 right-4 bg-myred text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
            onClick={() => setShowCourseForm(true)}
          >
            Edit
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
            <p className="text-center text-gray-600 col-span-full">
              No sessions available for this course yet. Click the &apos;+&apos;
              button to create one!
            </p>
          ) : (
            sessions.map((session) => (
              <CalendarCard
                key={session.session_id}
                title={getDateSession(session.start_time)}
                onClick={() => handleCheckSession(session.session_id)}
              />
            ))
          )}
        </div>

        <div
          className="bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center self-end fixed bottom-8 right-8 z-40"
          onClick={() => setShowSessionForm(true)} // <--- Renamed to setShowSessionForm
        >
          <img src="/add.svg" alt="Create New Session" className="w-8 h-8" />
        </div>

        {/* Conditional Rendering for SessionForm */}
        {showSessionForm && courseId && (
          <SessionForm
            onClose={() => setShowSessionForm(false)}
            onCreate={handleCreateSession}
            courseId={courseId}
          />
        )}

        {/* Conditional Rendering for CourseForm */}
        {showCourseForm &&
          course && ( // <--- RENDER COURSE FORM HERE
            <CourseForm2
              onClose={() => setShowCourseForm(false)}
              initialCourseData={course} // Pass the current course data to pre-fill the form
              onUpdate={handleUpdateCourse}
              onDelete={handleDeleteCourse}
            />
          )}
      </div>
    </div>
  );
};

export default HostingCourse;

