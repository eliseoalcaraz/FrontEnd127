'use client';

import Header from '@/components/Header';

const SessionSummary = () => {
  // Sample session data (UNIX timestamps in seconds)
  const session = {
    course: 'CMSC 123',
    startTime: 1741344000, // March 7, 2025 08:00 AM UTC
    endTime: 1741351200,   // March 7, 2025 10:00 AM UTC
    status: 'Late' as 'Present' | 'Late' | 'Absent',
  };

  const getDateSession = (start_time: number) => {
    const date = new Date(start_time * 1000);

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (unix: number) => {
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: typeof session.status) => {
    switch (status) {
      case 'Present':
        return 'text-green-600';
      case 'Late':
        return 'text-yellow-600';
      case 'Absent':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white w-full">
      <Header
        title={getDateSession(session.startTime)}
        onBack={() => console.log('Go back')}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div>
          <h2 className="text-xl font-bold">Session Summary</h2>
          <p className="text-gray-600">{session.course}</p>
        </div>

        <div>
          <p>
            <span className="font-semibold">Start Time:</span>{' '}
            {formatTime(session.startTime)}
          </p>
          <p>
            <span className="font-semibold">End Time:</span>{' '}
            {formatTime(session.endTime)}
          </p>
        </div>

        <div>
          <p className={`text-lg font-semibold ${getStatusColor(session.status)}`}>
            Status: {session.status}
          </p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-myred font-bold text-lg">Ats</p>
      </div>
    </div>
  );
};

export default SessionSummary;
