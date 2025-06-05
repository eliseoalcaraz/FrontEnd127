// src/components/SimpleUnenrollModal.tsx (or whatever name you choose)
'use client';

import React from 'react';

// Define the interface for the 'course' data
// (Assuming 'session' in your original code refers to a course object given the fields)
interface CourseDetails {
  course_id: number;
  name: string;
  join_code: string;
  geolocation_latitude: number | null;
  geolocation_longitude: number | null;
  late_threshold_minutes: number;
  present_threshold_minutes: number;
}

interface SimpleUnenrollModalProps {
  course: CourseDetails; // Renamed from 'session' to 'course' for clarity
  onCancel: () => void;
  onUnenroll: () => void;
}

export default function SimpleUnenrollModal({ course, onCancel, onUnenroll }: SimpleUnenrollModalProps) {
  return (
    // Modal Overlay
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      {/* Modal Content Card */}
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm flex flex-col gap-5 border border-gray-100 animate-scale-in">
        {/* Course Name / Title Section */}
        <div className="text-center pb-2 border-b border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-800 leading-tight">
            {course.name}
          </h2>
        </div>

        {/* Confirmation Message */}
        <p className="text-gray-700 text-center text-md pt-2 border-t border-gray-200">
          Are you sure you want to unenroll from this course?
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onUnenroll}
            className="flex-1 px-4 py-3 bg-myred text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Unenroll
          </button>
        </div>
      </div>
    </div>
  );
}