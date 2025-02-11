'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type StatisticsData = {
  totalWords: number;
  masteredCount: number;
  familiarCount: number;
  forgottenCount: number;
  reviewHistory: {
    date: string;
    count: number;
  }[];
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatisticsData | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/statistics');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  if (!stats) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading statistics...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Learning Statistics</h1>

        {/* Overview cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Words</h3>
            <p className="text-xl sm:text-2xl font-bold mt-2">{stats.totalWords}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Mastered</h3>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-green-600">{stats.masteredCount}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Familiar</h3>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-yellow-600">{stats.familiarCount}</p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h3 className="text-xs sm:text-sm font-medium text-gray-500">Need Review</h3>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-red-600">{stats.forgottenCount}</p>
          </div>
        </div>

        {/* Progress chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Review History</h2>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.reviewHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}