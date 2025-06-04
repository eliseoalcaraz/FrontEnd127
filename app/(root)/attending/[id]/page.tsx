// frontend/app/(root)/attending/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { toast } from "sonner"; // For notifications
import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an AuthContext

import TitleCard from "@/components/TitleCard";

import JoinSessionForm from "@/components/JoinSessionForm";
import CourseShow from "@/components/CourseShow";

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


import Header from '@/components/Header'

const AttendingCourse = () => {
  const router = useRouter();
  const params = useParams(); // Get URL parameters
  const courseId = params.id ? parseInt(params.id as string, 10) : null; // Get course_id from URL

  const { isLoggedIn, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

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

  const handleJoinSession = (id: number) => {
      setSelectedSessionId(id);
    setShowJoinForm(true);
  };

  const handleFormSubmit = (data: { number1: number; number2: number; photo: File | null }) => {
    console.log("Joining with:", data);

    if (selectedSessionId !== null) {
      router.push(`/attending/sessions/${selectedSessionId}`);
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
      <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10 mb-10">
        <div className="w-full p-8">
          <div onClick={() => setShowCourseInfo(true)} className="flex gap-2 items-center justify-center bg-myred text-white font-medium text-lg px-20 py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]">
            <img src="/create.svg" alt="Course" className="w-8 h-8" />
            <p className="underline">{course.name}</p>{" "}
            {/* Display actual course name */}
          </div>
        </div>

        <div className="flex flex-col w-full px-8 gap-6">
          {sessions.length === 0 ? (
            <p className="text-center text-gray-600">
              No sessions available for this course yet.
            </p>
          ) : (
            sessions.map((session) => (
              <TitleCard
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
