"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import TitleCard from "@/components/TitleCard";
import JoinCourse from "@/components/JoinCourse";
import Header from "@/components/Header";
import FolderCard from "@/components/FolderCard";

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
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Please log in to view the courses you are attending.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="min-h-screen flex flex-col items-center justify-start w-full gap-10 mb-10">
        <Header title="Attending" onClick={() => router.push('/home')}/>

        <div className="grid grid-cols-1 lg:grid-cols-3 w-full px-4 md:px-8 gap-10 mt-10">
          {courses.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              You are not attending any courses yet. Click the &apos;+&apos; button to join one!
            </p>
          ) : (
            courses.map((course) => (
              <FolderCard
                key={course.enrollment_id}
                title={course.name}
                onClick={() => handleClickCourse(course.course_id)}
              />
            ))
          )}
        </div>

        <div
          className="bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center self-end fixed bottom-8 right-8 z-40"
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
