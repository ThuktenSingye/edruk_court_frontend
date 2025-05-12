"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useLoginStore } from "@/app/hooks/useLoginStore";

export default function GenerateReportControl() {
    const currentYear = new Date().getFullYear().toString();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [loading, setLoading] = useState(false);
    const token = useLoginStore((state) => state.token);

    const handleGenerateReport = async () => {
        if (!token) {
            toast.error("🔒 Not authenticated. Please log in.");
            return;
        }

        if (!/^\d{4}$/.test(selectedYear)) {
            toast.error("❌ Invalid year. Enter a 4-digit year.");
            return;
        }

        try {
            setLoading(true);
            toast.loading("📊 Report generation in process...");

            const host = window.location.hostname;

            const response = await fetch(
                `http://${host}:3001/api/v1/report/generate?year=${selectedYear}`,
                {

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.dismiss();

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            toast.success(`✅ Report for ${selectedYear} triggered successfully`);
        } catch (error) {
            console.error("❌ Report generation failed:", error);
            toast.error("❌ Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end items-center mb-4 gap-2">
            <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                placeholder="Enter year"
                className="border px-3 py-2 rounded-md shadow-sm text-sm w-[100px]"
                min="1900"
                max="9999"
            />

            <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 text-sm"
            >
                {loading ? "Generating..." : "Generate Report"}
            </button>
        </div>
    );
}