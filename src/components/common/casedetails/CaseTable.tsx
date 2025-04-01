// components/features/casedetails/CaseTable.tsx
"use client";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Case Item Interface
interface CaseItem {
    id: string;
    regDate: string;
    plaintiff: string;
    cidNo: string;
    caseTitle: string;
    type: string;
    category: string;
}

// Define the props interface for CaseTable
interface CaseTableProps {
    selectedCategory: string | null;
    selectedCaseType: string | null;
    search: string;
    currentPage: number;
    casesPerPage: number;
    setCurrentPage: (page: number) => void;
}

export default function CaseTable({
    selectedCategory,
    selectedCaseType,
    search,
    currentPage,
    casesPerPage,
    setCurrentPage
}: CaseTableProps) {

    const [cases, setCases] = useState<CaseItem[]>([]);

    // Fetch cases from the mock API
    useEffect(() => {
        fetch("http://localhost:3002/case")
            .then((response) => response.json())
            .then((data) => setCases(data))
            .catch((error) => console.error("Error fetching cases:", error));
    }, []);

    // Filter cases based on the selected filters
    const filteredCases = cases.filter((caseItem) => {
        return (
            (!selectedCategory || caseItem.category === selectedCategory) &&
            (!selectedCaseType || caseItem.type === selectedCaseType) &&
            (search === "" || caseItem.caseTitle.toLowerCase().includes(search.toLowerCase()))
        );
    });

    const totalPages = Math.ceil(filteredCases.length / casesPerPage);
    const startIndex = (currentPage - 1) * casesPerPage;
    const paginatedCases = filteredCases.slice(startIndex, startIndex + casesPerPage);

    return (
        <div>
            <Table className="bg-white">
                <TableHeader>
                    <TableRow className="bg-primary-normal">
                        {["Case ID", "Reg Date", "Plaintiff", "CID No", "Case Title", "Type", "Category", "View Case"].map((head) => (
                            <TableHead key={head}>{head}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedCases.length > 0 ? (
                        paginatedCases.map((caseItem) => (
                            <TableRow key={caseItem.id} className="hover:bg-gray-200 transition duration-200">
                                <TableCell>{caseItem.id}</TableCell>
                                <TableCell>{caseItem.regDate}</TableCell>
                                <TableCell>{caseItem.plaintiff}</TableCell>
                                <TableCell>{caseItem.cidNo}</TableCell>
                                <TableCell>{caseItem.caseTitle}</TableCell>
                                <TableCell>{caseItem.type}</TableCell>
                                <TableCell>{caseItem.category}</TableCell>
                                <TableCell>
                                    <Link href={`/user/caseDocs/${caseItem.id}`} className="text-blue-500 hover:underline">
                                        View Case
                                    </Link>

                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                No Cases Found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    ← Previous
                </Button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next →
                </Button>
            </div>
        </div>
    );
}