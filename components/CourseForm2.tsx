// src/components/CourseForm.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Define the structure for a Course object that this form will handle
interface CourseFormData {
  course_id?: number; // Optional, useful for update/delete operations
  name: string;
  join_code: string;
  geolocation_latitude: number | null;
  geolocation_longitude: number | null;
  present_threshold_minutes: number;
  late_threshold_minutes: number;
  // Add other fields as necessary (e.g., host_id, host_name if editable)
}

interface CourseFormProps {
  onClose: () => void;
  // For updating an existing course
  onUpdate?: (courseId: number, updatedData: CourseFormData) => void;
  // For creating a new course (if you decide to support creation)
  onCreate?: (newData: CourseFormData) => void;
  // For deleting an existing course
  onDelete?: (courseId: number) => void;
  // Initial data for the form (optional, makes it an 'update' form if provided)
  initialCourseData?: CourseFormData;
}

const CourseForm: React.FC<CourseFormProps> = ({ onClose, onUpdate, onCreate, onDelete, initialCourseData }) => {
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    join_code: '',
    geolocation_latitude: null,
    geolocation_longitude: null,
    present_threshold_minutes: 0,
    late_threshold_minutes: 0,
    // Initialize course_id if updating
    course_id: initialCourseData?.course_id,
  });

  // Effect to populate form when initialCourseData changes (e.g., when opening modal for different course)
  useEffect(() => {
    if (initialCourseData) {
      setFormData({
        ...initialCourseData,
        // Ensure numbers are not undefined for input fields
        geolocation_latitude: initialCourseData.geolocation_latitude ?? null,
        geolocation_longitude: initialCourseData.geolocation_longitude ?? null,
        present_threshold_minutes: initialCourseData.present_threshold_minutes ?? 0,
        late_threshold_minutes: initialCourseData.late_threshold_minutes ?? 0,
      });
    } else {
      // Reset form if no initial data (e.g., for 'create' mode)
      setFormData({
        name: '',
        join_code: '',
        geolocation_latitude: null,
        geolocation_longitude: null,
        present_threshold_minutes: 0,
        late_threshold_minutes: 0,
      });
    }
  }, [initialCourseData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id.includes('threshold') || id.includes('geolocation') ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleAction = (actionType: 'update' | 'create') => {
    // Basic validation
    if (!formData.name.trim() || !formData.join_code.trim()) {
      alert('Course Name and Join Code cannot be empty.');
      return;
    }
    if (formData.present_threshold_minutes < 0 || formData.late_threshold_minutes < 0) {
        alert('Thresholds cannot be negative.');
        return;
    }

    const dataToSubmit = {
        ...formData,
        // Ensure nulls for empty numeric fields instead of 0 if preferred by API
        geolocation_latitude: formData.geolocation_latitude === null ? null : Number(formData.geolocation_latitude),
        geolocation_longitude: formData.geolocation_longitude === null ? null : Number(formData.geolocation_longitude),
    };


    if (actionType === 'update' && onUpdate && formData.course_id !== undefined) {
      onUpdate(formData.course_id, dataToSubmit);
    } else if (actionType === 'create' && onCreate) {
      onCreate(dataToSubmit);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && formData.course_id !== undefined && window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      onDelete(formData.course_id);
      onClose();
    }
  };

  const isUpdateMode = initialCourseData && initialCourseData.course_id !== undefined;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg flex flex-col gap-5 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isUpdateMode ? 'Edit Course' : 'Create New Course'}
        </h2>

        {/* Input Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., Introduction to Python"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="join_code" className="block text-sm font-medium text-gray-700 mb-1">
              Join Code
            </label>
            <input
              id="join_code"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g., PYTHON101"
              value={formData.join_code}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="geolocation_latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude (Optional)
              </label>
              <input
                id="geolocation_latitude"
                type="number"
                step="0.0001" // For decimal precision
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., 10.3157"
                value={formData.geolocation_latitude ?? ''} // Use empty string for null
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="geolocation_longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude (Optional)
              </label>
              <input
                id="geolocation_longitude"
                type="number"
                step="0.0001" // For decimal precision
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., 123.8854"
                value={formData.geolocation_longitude ?? ''} // Use empty string for null
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="present_threshold_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                Present Threshold (minutes)
              </label>
              <input
                id="present_threshold_minutes"
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.present_threshold_minutes}
                onChange={handleChange}
                min="0" // Thresholds shouldn't be negative
              />
            </div>
            <div>
              <label htmlFor="late_threshold_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                Late Threshold (minutes)
              </label>
              <input
                id="late_threshold_minutes"
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.late_threshold_minutes}
                onChange={handleChange}
                min="0" // Thresholds shouldn't be negative
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {isUpdateMode && onDelete && ( // Only show delete in update mode if onDelete is provided
              <button
                onClick={handleDelete}
                className="px-4 py-3 bg-myred text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
              >
                Delete
              </button>
            )}
            <button
              onClick={() => handleAction(isUpdateMode ? 'update' : 'create')}
              className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              {isUpdateMode ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;