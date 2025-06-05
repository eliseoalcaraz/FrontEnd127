"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import JoinCourse from "@/components/JoinCourse";

interface CourseEnrollment {
  enrollment_id: number;
  course_id: number;
  name: string;
  join_code: string;
  host_id: number;
  host_name: string;
  enrolled_at: number;
}

const Attending = () => {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, user } = useAuth(); // Get user object from AuthContext

  const [courses, setCourses] = useState<CourseEnrollment[]>([]);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch enrolled courses
  const fetchEnrollments = useCallback(async () => {
    // Only fetch if auth is done loading and user is logged in AND user ID is available
    if (authLoading || !isLoggedIn || !user?.id) {
      setIsLoading(false); // Ensure loading state is false if we can't fetch
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Construct the URL with the user's ID
      const response = await fetch(`/api/users/${user.id}/enrollments`);
      const data = await response.json();

      if (response.ok) {
        setCourses(data);
      } else {
        setError(data.error || "Failed to fetch courses you are attending.");
        toast.error(data.error || "Failed to fetch courses.");
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Network error or unexpected issue.");
      toast.error("Network error fetching courses.");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isLoggedIn, user]); // Dependencies now include the 'user' object

  // useEffect to trigger fetching enrollments
  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleJoinCourse = async (data: { code: string }) => {
    setShowJoinForm(false);
    if (!isLoggedIn) {
      toast.error("You must be logged in to join a course.");
      return;
    }

    try {
      const response = await fetch("/api/enrollments", {
        // This route remains the same (POST to /enrollments)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ join_code: data.code }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || "Successfully joined course!");
        fetchEnrollments(); // Re-fetch the list of courses to update the UI
      } else {
        toast.error(responseData.error || "Failed to join course.");
      }
    } catch (err) {
      console.error("Error joining course:", err);
      toast.error("Network error or unexpected issue while joining course.");
    }
  };

  const handleClickCourse = (id: number) => {
    router.push(`/attending/${id}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view the courses you are attending.</p>
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
            >
              <img src="/create.svg" alt="Join" className="w-8 h-8" />
              <p 
                className="underline" 
                style={{
                  fontFamily: 'Karma',
                  fontWeight: '300',
                  fontSize: '18px',
                  letterSpacing: '0.03em'
                }}
              >
                Attending
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
            <img src="/create.svg" alt="Join" className="w-8 h-8" />
            <p 
              className="underline" 
              style={{
                fontFamily: 'Karma',
                fontWeight: '300',
                fontSize: '18px',
                letterSpacing: '0.03em'
              }}
            >
              Attending
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
                You are not attending any courses yet. Click the &apos;+&apos;
                button to join one!
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {courses.map((course) => (
                <div 
                  key={course.enrollment_id}
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
          <img src="/home-logo.png" alt="Logo" className="w-12 h-12" />
        </div>

        {/* Floating action button to open JoinCourse form */}
        <div
          className="h-14 w-14 cursor-pointer flex items-center justify-center fixed bottom-8 right-8 z-40 hover:bg-red-700 transition-colors duration-200"
          style={{
            backgroundColor: '#890000',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
          }}
          onClick={() => setShowJoinForm(true)}
        >
          <img src="/add.svg" alt="Join Course" className="w-8 h-8" />
        </div>

        {showJoinForm && (
          <JoinCourse
            onClose={() => setShowJoinForm(false)}
            onJoin={handleJoinCourse}
          />
        )}
      </div>
    </div>
  );
};

export default Attending;