'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import TitleCard from '@/components/TitleCard';
import JoinCourse from '@/components/JoinCourse';

import { enrollmentSample } from '@/content/data';

const Attending = () => {
  const [courses, setCourses] = useState(enrollmentSample);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const router = useRouter();

  const handleJoinCourse = (data: { code: string }) => {

    const newCourse = {
       enrollment_id: 1,
      course_id: 102,
      name: "Web Development Basics",
      join_code: data.code,
      host_id: 2,
      host_name: "Jane Doe",
      enrolled_at: 1701388800
    };
    setCourses((prev) => [...prev, newCourse]);
    setShowJoinForm(false);
  };

  const handleClickCourse = (id: number) => {
    router.push(`/attending/${id}`);
  };

  return (
    <div className="w-full min-h-screen flex justify-center">
      <div className="min-h-screen flex flex-col items-center justify-start w-full max-w-md gap-10 mb-10">
        <div className="w-full p-8">
          <div className="flex gap-2 items-center justify-center bg-myred text-white font-medium text-lg px-20 py-5 rounded-full cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]">
            <img src="/create.svg" alt="Join" className="w-8 h-8" />
            <p className="underline">Attending</p>
          </div>
        </div>

        <div className="flex flex-col w-full px-8 gap-6">
          {courses.map((course) => (
            <TitleCard
              key={course.course_id}
              title={course.name}
              onClick={() => handleClickCourse(course.course_id)}
            />
          ))}
        </div>

        <div
          className="bg-myred h-14 w-14 rounded-full cursor-pointer flex items-center justify-center self-end"
          onClick={() => setShowJoinForm(true)}
        >
          <img src="/add.svg" alt="Join" className="w-8 h-8" />
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
