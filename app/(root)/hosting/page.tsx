"use client";

import React, { useState, useEffect, useCallback } from "react"; // Add useCallback
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // For notifications
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

import CourseForm from "@/components/CourseForm";
import Header from "@/components/Header"; // Import your headers component
import FolderCard from "@/components/FolderCard";

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
    <div className="w-full min-h-screen flex justify-center">
      <div className="min-h-screen flex flex-col items-center justify-start w-full gap-10 mb-10">
        <Header title="Hosting" onClick={() => router.push("/home")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 w-full w-max-3xl px-4 md:px-8 gap-2 mt-10">
          {courses.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              You are not hosting any courses yet. Click the &apos;+&apos;
              button to create one!
            </p>
          ) : (
            courses.map((course) => (
              <FolderCard
                key={course.course_id}
                title={course.name}
                onClick={() => handleClickCourse(course.course_id)}
              />
            ))
          )}
        </div>

        {/* Floating action button to open CourseForm */}
        <div
          className="bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center self-end fixed bottom-8 right-8 z-40" // Added fixed positioning
          onClick={() => setShowForm(true)}
        >
          <img src="/add.svg" alt="Create New Course" className="w-8 h-8" />{" "}
          {/* Changed enter.svg to add.svg for clarity */}
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
