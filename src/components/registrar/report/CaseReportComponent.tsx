/** @format */

"use client";
import React, { useState, useRef, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { CaseReport } from "@/app/hooks/usefetchCaseReports";
import { Edit, Save, Menu, ChevronDown } from "lucide-react";
import ManualEntryTable from "@/components/ui/ManualEntryTable";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import GenerateReportControl from "./GenerateReportControl";
import GeneratedReportsTable from "./GenerateReportsTable";

interface ApiResponse {
  status: string;
  message: string;
  data: {
    cases: {
      criminal: number;
      civil: number;
      other: number;
    };
    cases_overview: {
      total: number;
      decided: number;
      pending: number;
      appeal: number;
      enforced: number;
    };
    court_case_statistic: {
      [bench: string]: {
        [month: string]: {
          [benchClerk: string]: {
            opening_balance: number;
            registered: number;
            decided: number;
            appeal: number;
            pending: number;
          };
        };
      };
    };
  };
}

const CaseReportComponent = () => {
  // State management
  const [selectedBench, setSelectedBench] = useState<string>("one");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);
  const { token, checkAuth } = useLoginStore();
  const manualEntryRef = useRef<HTMLDivElement>(null);

  // Constants
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Fetch data using TanStack Query
  const {
    data: caseStats,
    isLoading,
    error,
  } = useQuery<ApiResponse["data"]>({
    queryKey: ["caseStatistics", selectedYear],
    queryFn: async () => {
      const isAuthenticated = checkAuth();
      if (!isAuthenticated) {
        throw new Error("Authentication required");
      }

      const currentToken = useLoginStore.getState().token;
      if (!currentToken) {
        throw new Error("Authentication token not found");
      }

      const host = window.location.hostname;

      const response = await fetch(
        `http://${host}:3001/api/v1/case_statistics?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result: ApiResponse = await response.json();

      if (result.status !== "ok") {
        throw new Error(result.message || "Failed to fetch data");
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

  // Get available benches
  const availableBenches = useMemo(() => {
    if (!caseStats?.court_case_statistic) return [];
    return Object.keys(caseStats.court_case_statistic);
  }, [caseStats]);

  const handleManualSave = (newManualData: CaseReport[]) => {
    // Handle manual data save
    console.log("Manual data saved:", newManualData);
    setShowManualEntry(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Case Statistics</h1>

      {isLoading && <p>Loading...</p>}
      {error && (
        <p className="text-red-500 mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
      )}

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded-md">
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedBench}
          onChange={(e) => setSelectedBench(e.target.value)}
          className="p-2 border rounded-md">
          {availableBenches.map((bench) => (
            <option key={bench} value={bench}>
              Bench {bench}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded-md">
          <option value="">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* System Data Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">System Data</h2>
        <div className="overflow-x-auto">
          <Table className="bg-white shadow-md text-center min-w-full">
            <TableHeader className="text-white">
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Bench Clerk</TableCell>
                <TableCell>Opening Balance</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell>Decided</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>Appeal</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {caseStats?.court_case_statistic[selectedBench] &&
                Object.entries(caseStats.court_case_statistic[selectedBench])
                  .filter(
                    ([month]) => !selectedMonth || month === selectedMonth
                  )
                  .map(([month, monthData]) => (
                    <React.Fragment key={month}>
                      {Object.entries(monthData).map(
                        ([benchClerk, stats], index) => (
                          <TableRow key={`${month}-${benchClerk}`}>
                            {index === 0 ? (
                              <TableCell
                                rowSpan={Object.keys(monthData).length}
                                className="align-middle">
                                {month}
                              </TableCell>
                            ) : null}
                            <TableCell>{benchClerk}</TableCell>
                            <TableCell>{stats.opening_balance}</TableCell>
                            <TableCell>{stats.registered}</TableCell>
                            <TableCell>{stats.decided}</TableCell>
                            <TableCell>{stats.pending}</TableCell>
                            <TableCell>{stats.appeal}</TableCell>
                          </TableRow>
                        )
                      )}
                      <TableRow className="bg-gray-50 font-semibold">
                        <TableCell colSpan={2} className="text-center">
                          Total for {month}
                        </TableCell>
                        <TableCell className="text-center">
                          {Object.values(monthData).reduce(
                            (sum, stats) => sum + stats.opening_balance,
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {Object.values(monthData).reduce(
                            (sum, stats) => sum + stats.registered,
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {Object.values(monthData).reduce(
                            (sum, stats) => sum + stats.decided,
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {Object.values(monthData).reduce(
                            (sum, stats) => sum + stats.pending,
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {Object.values(monthData).reduce(
                            (sum, stats) => sum + stats.appeal,
                            0
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <GenerateReportControl />
        <GeneratedReportsTable />
      </div>

      {/* Manual Entry Table */}
      {/* <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">Manual Entries</h2>
                    <button
                        onClick={() => setShowManualEntry(!showManualEntry)}
                        className="bg-primary-normal text-white px-3 py-1 rounded-md text-sm"
                    >
                        {showManualEntry ? 'Hide' : 'Add Manual Data'}
                    </button>
                </div>
                {showManualEntry && (
                    <div ref={manualEntryRef}>
                        <ManualEntryTable onSave={handleManualSave} />
                    </div>
                )}
            </div> */}
    </div>
  );
};

export default CaseReportComponent;
