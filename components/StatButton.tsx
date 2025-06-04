'use client';

import { useState } from 'react';

interface StatButtonProps {
  label: string;
  count: number;
  names: string[]; // Array of names to show in the table
}

export default function StatButton({ label, count, names }: StatButtonProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <button
        className="flex items-center justify-between w-full p-4 bg-myred text-white rounded-lg shadow-md hover:bg-red-700 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-lg font-medium">{label} | {count}</span>
        <img
          src="/arrowdown.svg"
          alt="Arrow Down"
          className={`h-3 w-6 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="bg-white border border-red-300 rounded-md mt-2 overflow-hidden">
          <table className="w-full text-sm text-left text-black">
            <thead className="bg-red-100 text-red-800 font-semibold">
              <tr>
                <th className="px-4 py-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {names.map((name, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
