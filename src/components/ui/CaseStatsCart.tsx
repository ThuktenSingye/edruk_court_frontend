
import React from "react";
import ReportTable from "@/components/registrar/report/CaseReportComponent";

export default function Report() {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-semibold mb-4">Report</h1>
            <ReportTable />
        </div>
    );
}