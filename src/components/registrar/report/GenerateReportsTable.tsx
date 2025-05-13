/** @format */

"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useLoginStore } from "@/app/hooks/useLoginStore";

export default function GeneratedReportsTable() {
  const [reports, setReports] = useState<any[]>([]);
  const token = useLoginStore((state) => state.token); // 🟢 Fetch token from Zustand

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log("📡 Fetching reports with token:", token);

        const host = window.location.hostname;

        const res = await fetch(`http://${host}:3001/api/v1/reports`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ Response status:", res.status);

        const text = await res.text(); // read raw response first
        console.log("📦 Raw Response Text:", text);

        const json = JSON.parse(text); // parse manually
        console.log("📦 Parsed JSON:", json);

        setReports(json.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch reports", error);
      }
    };

    //   // 🟢 Check if token is available before making the request
    //   if (!token) {
    //     console.warn("⚠️ No token found. User might not be authenticated.");
    //     return;
    //   }

    //   fetchReports();
    // }

    if (token) fetchReports();
  }, [token]);

  return (
    <div className="mt-12 border border-gray-300 rounded-md shadow-md bg-white p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Generated Reports
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell style={{ color: "white" }}>SL. NO</TableCell>
            <TableCell style={{ color: "white" }}>Filename</TableCell>
            <TableCell style={{ color: "white" }}>Status</TableCell>
            <TableCell style={{ color: "white" }}>Year</TableCell>
            <TableCell style={{ color: "white" }}>Generated At</TableCell>
            <TableCell style={{ color: "white" }}>Download</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <TableRow key={report.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{report.file?.filename || "N/A"}</TableCell>
              <TableCell>{report.report_status}</TableCell>
              <TableCell>{report.year}</TableCell>
              <TableCell>
                {report.generated_at
                  ? new Date(report.generated_at).toLocaleString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <a
                  href={report.file?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline">
                  Download
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
