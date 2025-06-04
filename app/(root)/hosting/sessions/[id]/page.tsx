'use client';

import Header from '@/components/Header';
import StatButton from '@/components/StatButton';

const defaultNames = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie Davis"];

export default function AttendanceSummary() {
  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Header title="March 7, 2025" onBack={() => console.log('Go back')} />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <StatButton label="Present" count={20} names={defaultNames}/>
        <StatButton label="Absent" count={10} names={defaultNames}/>
        <StatButton label="Late" count={5} names={defaultNames}/>
      </div>

      <div className="p-4">
        <p className="text-myred font-bold text-lg">Ats</p>
      </div>
    </div>
  );
}
