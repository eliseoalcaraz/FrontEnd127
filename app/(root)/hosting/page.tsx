"use client";

import React, { useState, useEffect, useCallback } from "react"; // Add useCallback
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // For notifications
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

import CourseForm from "@/components/CourseForm";
import TitleCard from "@/components/TitleCard";

// Remove the mock data import
// import { coursesSample } from "@/content/data";

// Define an interface for your Course data structure
// Make sure this matches the structure returned by your backend's /courses endpoint
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

const Hosting = () => {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth(); // Get login status and loading state

  const [courses, setCourses] = useState<Course[]>([]); // Initialize as empty array
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Function to fetch courses from the backend
  const fetchHostedCourses = useCallback(async () => {
    // Only attempt to fetch if authentication status is known and user is logged in
    if (authLoading) {
      // Still loading auth status, do nothing yet
      return;
    }
    if (!isLoggedIn) {
      // Not logged in, no courses to fetch for a host
      setIsLoadingCourses(false); // Update loading state even if not fetching
      // toast.error("Please log in to view your hosted courses."); // Already handled by layout
      return;
    }

    setIsLoadingCourses(true); // Start loading
    try {
      const response = await fetch("/api/courses"); // Your backend endpoint
      const data = await response.json();

      if (response.ok) {
        setCourses(data || []); // Assuming your backend returns { "courses": [...] }
      } else {
        toast.error(data.error || "Failed to fetch hosted courses.");
        setCourses([]); // Clear courses on error
      }
    } catch (error) {
      console.error("Error fetching hosted courses:", error);
      toast.error("Network error or unexpected issue when fetching courses.");
      setCourses([]); // Clear courses on network error
    } finally {
      setIsLoadingCourses(false); // End loading
    }
  }, [isLoggedIn, authLoading]); // Dependencies for useCallback

  // useEffect to trigger fetching when component mounts or auth state changes
  useEffect(() => {
    fetchHostedCourses();
  }, [fetchHostedCourses]); // Dependency on fetchHostedCourses (memoized by useCallback)

  // handleCreateCourse now just triggers a refresh of the courses list
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateCourse = (newCourse: Course) => {
    // Type newCourse as Course
    setShowForm(false); // Close the form first
    fetchHostedCourses(); // Re-fetch all courses to ensure consistency
    // Optionally, you could optimistically add the newCourse to state
    // setCourses((prev) => [...prev, newCourse]);
    // but re-fetching is safer for ensuring backend consistency.
  };

  const handleClickCourse = (id: number) => {
    router.push(`/hosting/${id}`);
  };

  // Render loading or "not logged in" states
  if (isLoadingCourses || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your hosted courses...</p>
      </div>
    );
  }

  // This check is also handled by (root)/layout.tsx, but good to have a fallback message
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view and manage your hosted courses.</p>
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
          >
            <img src="/create.svg" alt="Create" className="w-8 h-8" />
            <p 
              className="underline" 
              style={{
                fontFamily: 'Karma',
                fontWeight: '300',
                fontSize: '18px',
                letterSpacing: '0.03em'
              }}
            >
              Hosting
            </p>
          </div>
        </div>

        {/* Courses container - repositioned with better spacing in light area */}
        <div className="flex flex-col w-full px-8 py-8 gap-6 flex-grow">
          {courses.length === 0 ? (
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
                You are not hosting any courses yet. Click the &apos;+&apos;
                button to create one!
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {courses.map((course) => (
                <div 
                  key={course.course_id}
                  className="bg-red-800 text-white px-6 py-6 cursor-pointer shadow-lg flex items-center justify-center text-center hover:bg-red-700 transition-colors duration-200"
                  onClick={() => handleClickCourse(course.course_id)}
                  style={{
                    fontFamily: 'Karma',
                    fontWeight: '400',
                    fontSize: '28px',
                    letterSpacing: '0.03em',
                    borderRadius: '12px',
                    minHeight: '80px'
                  }}
                >
                  {course.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logo at lower-left - fixed position */}
        <div className="fixed bottom-8 left-8 z-40">
          <img src="/Logo.png" alt="Logo" className="w-12 h-12" />
        </div>

        {/* Floating action button to open CourseForm */}
        <div
          className="h-14 w-14 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-40 hover:bg-red-700 transition-colors duration-200"
          style={{
            backgroundColor: '#890000',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
          }}
          onClick={() => setShowForm(true)}
        >
          <img src="/add.svg" alt="Create New Course" className="w-8 h-8" />
        </div>

        {showForm && (
          <CourseForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateCourse} // This will trigger a re-fetch
          />
        )}
      </div>
    </div>
  );
};

export default Hosting;