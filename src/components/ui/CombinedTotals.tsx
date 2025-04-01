/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useRef } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { CaseReport } from "@/app/hooks/usefetchCaseReports";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

interface CombinedDataTableProps {
    systemData: CaseReport[];
    manualData: CaseReport[];
}

const CombinedDataTable: React.FC<CombinedDataTableProps> = ({ systemData, manualData }) => {
    const tableRef = useRef<HTMLDivElement>(null);

    // Combine both data sources
    const allData = [...systemData, ...manualData];

    // Calculate totals by month
    const monthlyTotals = allData.reduce((acc, row) => {
        if (!acc[row.month]) {
            acc[row.month] = {
                openingBalance: 0,
                newRegistration: 0,
                totalRegistered: 0,
                decidedCases: 0,
                pendingCases: 0,
                appeal: 0,
            };
        }

        acc[row.month].openingBalance += row.openingBalance;
        acc[row.month].newRegistration += row.newRegistration;
        acc[row.month].totalRegistered += row.totalRegistered;
        acc[row.month].decidedCases += row.decidedCases;
        acc[row.month].pendingCases += row.pendingCases;
        acc[row.month].appeal += row.appeal;

        return acc;
    }, {} as Record<string, {
        openingBalance: number;
        newRegistration: number;
        totalRegistered: number;
        decidedCases: number;
        pendingCases: number;
        appeal: number;
    }>);

    // Calculate grand totals
    const grandTotals = Object.values(monthlyTotals).reduce(
        (acc, month) => {
            acc.openingBalance += month.openingBalance;
            acc.newRegistration += month.newRegistration;
            acc.totalRegistered += month.totalRegistered;
            acc.decidedCases += month.decidedCases;
            acc.pendingCases += month.pendingCases;
            acc.appeal += month.appeal;
            return acc;
        },
        {
            openingBalance: 0,
            newRegistration: 0,
            totalRegistered: 0,
            decidedCases: 0,
            pendingCases: 0,
            appeal: 0,
        }
    );

    const handleDownloadPDF = async () => {
        if (!tableRef.current) return;

        const canvas = await html2canvas(tableRef.current);
        const pdf = new jsPDF('landscape');
        const imgData = canvas.toDataURL('image/png');

        // Calculate aspect ratio to fit the PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("Combined_Case_Report.pdf");
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Combined Case Report</h2>

            </div>

            <div ref={tableRef}>
                <Table className="bg-white shadow-md text-center">
                    <TableHeader className="text-white bg-primary-normal">
                        <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell>Opening Balance</TableCell>
                            <TableCell>New Registration</TableCell>
                            <TableCell>Total Registered</TableCell>
                            <TableCell>Decided Cases</TableCell>
                            <TableCell>Pending Cases</TableCell>
                            <TableCell>Appeal</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(monthlyTotals).map(([month, totals]) => (
                            <TableRow key={month}>
                                <TableCell className="text-center">{month}</TableCell>
                                <TableCell className="text-center">{totals.openingBalance}</TableCell>
                                <TableCell className="text-center">{totals.newRegistration}</TableCell>
                                <TableCell className="text-center">{totals.totalRegistered}</TableCell>
                                <TableCell className="text-center">{totals.decidedCases}</TableCell>
                                <TableCell className="text-center">{totals.pendingCases}</TableCell>
                                <TableCell className="text-center">{totals.appeal}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="bg-gray-100 font-bold">
                            <TableCell className="text-center">Grand Total</TableCell>
                            <TableCell className="text-center">{grandTotals.openingBalance}</TableCell>
                            <TableCell className="text-center">{grandTotals.newRegistration}</TableCell>
                            <TableCell className="text-center">{grandTotals.totalRegistered}</TableCell>
                            <TableCell className="text-center">{grandTotals.decidedCases}</TableCell>
                            <TableCell className="text-center">{grandTotals.pendingCases}</TableCell>
                            <TableCell className="text-center">{grandTotals.appeal}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default CombinedDataTable;