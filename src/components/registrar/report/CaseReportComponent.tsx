'use client';
import React, { useState, useRef } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CaseReport, useFetchCaseReports } from "@/app/hooks/usefetchCaseReports";

const CaseReportComponent = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [isYearlyReport, setIsYearlyReport] = useState<boolean>(false);

    const tableRef = useRef<HTMLDivElement>(null);

    // Use the custom hook for fetching case reports data
    const { data, isLoading, error } = useFetchCaseReports();

    const handlePrint = useReactToPrint({
        // content: () => tableRef.current,
        documentTitle: "Case Report",
        onAfterPrint: () => console.log("Printed successfully!"),
    });

    const handleDownloadPDF = async () => {
        if (!tableRef.current) return;

        const canvas = await html2canvas(tableRef.current);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Case_Report.pdf");
    };

    const years = Array.from({ length: 11 }, (_, i) => i + 2015);
    const benchClerks = ['Sangay Dorji', 'Pema', 'Namgay', 'Ugyen'];

    const filteredData = data.filter(
        (row) =>
            (row.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.year.toString().includes(searchTerm)) &&
            (selectedYear === row.year || !selectedYear) &&
            (selectedMonth === row.month || !selectedMonth)
    );

    const groupedByMonth = new Map<
        string,
        {
            month: string;
            openingBalance: number;
            newRegistration: number;
            totalRegistered: number;
            decidedCases: number;
            pendingCases: number;
            appeal: number;
            remarks: number;
        }
    >();

    filteredData.forEach((row) => {
        if (!groupedByMonth.has(row.month)) {
            groupedByMonth.set(row.month, {
                month: row.month,
                openingBalance: 0,
                newRegistration: 0,
                totalRegistered: 0,
                decidedCases: Math.floor(row.decidedCases),
                pendingCases: row.pendingCases,
                appeal: row.appeal,
                remarks: row.remarks,
            });
        }

        const monthData = groupedByMonth.get(row.month)!;

        monthData.openingBalance += row.openingBalance;
        monthData.newRegistration += row.newRegistration;
        monthData.totalRegistered += row.totalRegistered;
        monthData.decidedCases += Math.floor(row.decidedCases);
        monthData.pendingCases += row.pendingCases;
        monthData.appeal += row.appeal;
        monthData.remarks += row.remarks;
    });

    const processedData: CaseReport[] = Array.from(groupedByMonth.entries()).flatMap(([month, data]) => {
        const appealsDistribution = distributeRandomly(data.appeal, benchClerks.length);

        return benchClerks.map((benchClerk, index) => ({
            month,
            benchClerk,
            openingBalance: data.openingBalance / benchClerks.length,
            newRegistration: data.newRegistration / benchClerks.length,
            totalRegistered: data.totalRegistered / benchClerks.length,
            decidedCases: Math.floor(data.decidedCases / benchClerks.length),
            pendingCases: data.pendingCases / benchClerks.length,
            appeal: appealsDistribution[index],
            remarks: data.remarks / benchClerks.length,
            year: filteredData.find((row) => row.month === month)?.year || selectedYear,
        }));
    });

    const toggleReport = (reportType: string) => {
        setIsYearlyReport(reportType === "year");
        setSelectedMonth('');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-semibold mb-4">Case Report</h1>

            {/* Search Bar + Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by month or year"
                    className="p-2 border rounded-md w-full md:w-auto flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Report Type Toggle */}
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            checked={!isYearlyReport}
                            onChange={() => toggleReport("month")}
                        />
                        <span>Month</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            checked={isYearlyReport}
                            onChange={() => toggleReport("year")}
                        />
                        <span>Year</span>
                    </label>
                </div>

                {/* Year and Month Selectors */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="p-2 border rounded-md"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    {!isYearlyReport && (
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            <option value="">All Months</option>
                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Loading and Error messages */}
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Table */}
            <div ref={tableRef} className="overflow-x-auto">
                <Table className="bg-white shadow-md text-center min-w-full">
                    <TableHeader className="text-white ">
                        <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell>Bench Clerk</TableCell>
                            <TableCell>Opening Balance</TableCell>
                            <TableCell>New Registration</TableCell>
                            <TableCell>Total Registered</TableCell>
                            <TableCell>Decided Cases</TableCell>
                            <TableCell>Pending Cases</TableCell>
                            <TableCell>Appeal</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from(new Set(processedData.map(row => row.month))).map(month => (
                            <React.Fragment key={month}>
                                {processedData.filter(row => row.month === month).map((row, index) => (
                                    <TableRow key={index}>
                                        {index === 0 && (
                                            <TableCell rowSpan={benchClerks.length} className="text-center">{month}</TableCell>
                                        )}
                                        <TableCell className="text-center">{row.benchClerk}</TableCell>
                                        <TableCell className="text-center">{row.openingBalance}</TableCell>
                                        <TableCell className="text-center">{row.newRegistration}</TableCell>
                                        <TableCell className="text-center">{row.totalRegistered}</TableCell>
                                        <TableCell className="text-center">{row.decidedCases}</TableCell>
                                        <TableCell className="text-center">{row.pendingCases}</TableCell>
                                        <TableCell className="text-center">{row.appeal}</TableCell>
                                    </TableRow>
                                ))}
                                {/* Monthly Total Row */}
                                <TableRow className="bg-gray-50 font-semibold">
                                    <TableCell colSpan={2} className="text-center">Total for {month}</TableCell>
                                    <TableCell className="text-center">{processedData.filter(row => row.month === month).reduce((sum, row) => sum + row.openingBalance, 0)}</TableCell>
                                    <TableCell className="text-center">{processedData.filter(row => row.month === month).reduce((sum, row) => sum + row.newRegistration, 0)}</TableCell>
                                    <TableCell className="text-center">{processedData.filter(row => row.month === month).reduce((sum, row) => sum + row.totalRegistered, 0)}</TableCell>
                                    <TableCell className="text-center">{processedData.filter(row => row.month === month).reduce((sum, row) => sum + row.decidedCases, 0)}</TableCell>
                                    <TableCell className="text-center">{processedData.filter(row => row.month === month).reduce((sum, row) => sum + row.pendingCases, 0)}</TableCell>
                                    <TableCell className="text-center">{processedData.filter(row => row.month === month).reduce((sum, row) => sum + row.appeal, 0)}</TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
                <button onClick={handleDownloadPDF} className="bg-primary-normal text-white p-2 rounded-md">
                    Download
                </button>
                {/* <button onClick={handlePrint} className="bg-primary-normal text-white p-2 rounded-md">
                    Print
                </button> */}
            </div>
        </div>
    );
};

export default CaseReportComponent;

// Helper function to distribute appeal across bench clerks randomly
function distributeRandomly(total: number, numClerks: number) {
    const result = Array(numClerks).fill(0);
    let remaining = total;

    for (let i = 0; i < numClerks - 1; i++) {
        const allocation = Math.floor(Math.random() * remaining);
        result[i] = allocation;
        remaining -= allocation;
    }

    result[numClerks - 1] = remaining;
    return result;
}