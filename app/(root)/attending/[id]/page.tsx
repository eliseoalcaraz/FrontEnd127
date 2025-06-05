// frontend/app/(root)/attending/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { toast } from "sonner"; // For notifications
import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an AuthContext

import TitleCard from "@/components/TitleCard";

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

const AttendingCourse = () => {
  const router = useRouter();
  const params = useParams(); // Get URL parameters
  const courseId = params.id ? parseInt(params.id as string, 10) : null; // Get course_id from URL

  const { isLoggedIn, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch specific course details
  const fetchCourseDetails = useCallback(async () => {
    // Only fetch if auth is done loading, user is logged in, and courseId is available
    if (authLoading || !isLoggedIn || courseId === null) {
      setIsLoadingCourse(false); // Ensure loading state is false if we can't fetch
      return;
    }
    setIsLoadingCourse(true);
    setError(null);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();

      if (response.ok) {
        setCourse(data); // Assuming backend returns the course object directly
      } else {
        setError(data.error || "Failed to fetch course details.");
        toast.error(data.error || "Failed to fetch course details.");
        setCourse(null);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      setError("Network error or unexpected issue fetching course details.");
      toast.error("Network error or unexpected issue fetching course details.");
      setCourse(null);
    } finally {
      setIsLoadingCourse(false);
    }
  }, [authLoading, isLoggedIn, courseId]); // Dependencies for useCallback

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
    router.push(`/attending/sessions/${id}`);
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

  if (error || !course) {
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
              onClick={() => router.push('/attending')}
            >
              <img src="/create.svg" alt="Course" className="w-8 h-8" />
              <p 
                className="underline" 
                style={{
                  fontFamily: 'Karma',
                  fontWeight: '300',
                  fontSize: '18px',
                  letterSpacing: '0.03em'
                }}
              >
                Course Details
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
                {error || "Course not found or an error occurred."}
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
            onClick={() => router.push('/attending')}
          >
            <img src="/create.svg" alt="Course" className="w-8 h-8" />
            <p 
              className="underline" 
              style={{
                fontFamily: 'Karma',
                fontWeight: '300',
                fontSize: '18px',
                letterSpacing: '0.03em'
              }}
            >
              {course.name}
            </p>
          </div>
        </div>

        {/* Sessions container in light area */}
        <div className="flex flex-col w-full px-8 py-8 gap-6 flex-grow">
          {sessions.length === 0 ? (
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
                No sessions available for this course yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {sessions.map((session) => (
                <div 
                  key={session.session_id}
                  className="bg-red-800 text-white px-6 py-6 cursor-pointer shadow-lg flex items-center justify-center text-center hover:bg-red-700 transition-colors duration-200"
                  onClick={() => handleJoinSession(session.session_id)}
                  style={{
                    fontFamily: 'Karma',
                    fontWeight: '400',
                    fontSize: '18px',
                    letterSpacing: '0.03em',
                    borderRadius: '12px',
                    minHeight: '80px'
                  }}
                >
                  {getDateSession(session.start_time)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logo at lower-left - fixed position */}
        <div className="fixed bottom-8 left-8 z-40">
          <img src="/home-logo.png" alt="Logo" className="w-12 h-12" />
        </div>
      </div>
    </div>
  );
};

export default AttendingCourse;