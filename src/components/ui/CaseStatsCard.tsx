"use client";

import React, { useState, useEffect } from "react";

interface CaseStats {
  total_cases: number;
  resolved_cases: number;
  pending_cases: number;
  assigned_cases: number;
}

interface CaseStatsCardProps {
  userId: string; // Now we pass userId instead of stats
}

const CaseStatsCard: React.FC<CaseStatsCardProps> = ({ userId }) => {
  const [stats, setStats] = useState<CaseStats>({
    total_cases: 0,
    resolved_cases: 0,
    pending_cases: 0,
    assigned_cases: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4OGQ3NDgyNS0zOTNmLTRiM2MtYmZjMy0zNDZhODUyYjQxOWUiLCJzdWIiOiI3Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzQzNDQzNjA2LCJleHAiOjE3NDM0NDQ1MDZ9.S5uuhSJ-0UJ0V_1LMSzCYbzuDVtHhZGVXHHyWyWYcHI";

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  });

  const fetchCaseStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://nganglam.lvh.me:3001/api/v1/users/${userId}/case_stats`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      setStats(result.data);
    } catch (error) {
      console.error("Error fetching case stats:", error);
      setError(error instanceof Error ? error.message : "Failed to load case stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStats();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
        <button 
          onClick={fetchCaseStats}
          className="ml-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <h2 className="text-xl font-semibold mb-6">Your Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800">Total Cases Conducted</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total_cases}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-medium text-green-800">Cases Resolved</h3>
          <p className="text-2xl font-bold text-green-600">{stats.resolved_cases}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="font-medium text-yellow-800">Pending Cases</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending_cases}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-medium text-purple-800">Cases Assigned</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.assigned_cases}</p>
        </div>
      </div>
    </div>
  );
};

export default CaseStatsCard;