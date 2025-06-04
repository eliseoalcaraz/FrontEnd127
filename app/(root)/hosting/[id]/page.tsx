// frontend/app/(root)/hosting/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

import TitleCard from "@/components/TitleCard";
import SessionForm from "@/components/SessionForm";

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
  created_at: number;
}

interface Session {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
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
  const [showForm, setShowForm] = useState(false);

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

  // UPDATED: Make the newSession parameter optional to match SessionForm's onCreate prop
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateSession = (newSession?: Session) => {
    setShowForm(false);
    fetchCourseSessions(); // Re-fetch to ensure data consistency
  };

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
      <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10 mb-10">
        <div className="w-full p-8">
          <div className="flex gap-2 items-center justify-center bg-myred text-white font-medium text-lg px-20 py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]">
            <img src="/create.svg" alt="Create" className="w-8 h-8" />
            <p className="underline">{course.name}</p>
          </div>
        </div>

        <div className="flex flex-col w-full px-8 gap-6">
          {sessions.length === 0 ? (
            <p className="text-center text-gray-600">
              No sessions available for this course yet. Click the &apos;+&apos;
              button to create one!
            </p>
          ) : (
            sessions.map((session) => (
              <TitleCard
                key={session.session_id}
                title={getDateSession(session.start_time)}
                onClick={() => handleCheckSession(session.session_id)}
              />
            ))
          )}
        </div>

        <div
          className="bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center self-end fixed bottom-8 right-8 z-40"
          onClick={() => setShowForm(true)}
        >
          <img src="/add.svg" alt="Create New Session" className="w-8 h-8" />
        </div>

        {showForm && courseId && (
          <SessionForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateSession}
            courseId={courseId}
          />
        )}
      </div>
    </div>
  );
};

export default HostingCourse;
