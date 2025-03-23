"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Eye, Trash } from "lucide-react";

interface Case {
    regNo: number;
    regDate: string;
    plaintiff: string;
    cidNo: string;
    caseTitle: string;
    types: string;
    bench: string;
    benchClerk: string;
    status: "Active" | "Urgent" | "Enforcement" | "Appeal";
    nature: string;
}

const initialCases: Case[] = Array.from({ length: 3 }, (_, i) => ({
    regNo: 20020 + i,
    regDate: "20/11/2024",
    plaintiff: "Karma Dorji",
    cidNo: "1010104841",
    caseTitle: i % 2 === 0 ? "Divorce" : "Murder Case",
    types: i % 2 === 0 ? "Civil Case" : "Criminal Case",
    bench: "Bench I",
    benchClerk: "Kinley Dorji",
    status: (i % 4 === 0 ? "Urgent" : "Active") as Case["status"],
    nature: "Severe",
}));

export default function CaseInfoPage() {
    const [cases, setCases] = useState<Case[]>(initialCases);
    const [tab, setTab] = useState<Case["status"]>("Active");
    const [page, setPage] = useState(0);
    const rowsPerPage = 9;
    const router = useRouter(); // Initialize the router

    const filteredCases = cases
        .filter((c) => c.status === tab)
        .slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    // Handle delete case
    const handleDelete = (regNo: number) => {
        setCases((prevCases) => prevCases.filter((c) => c.regNo !== regNo));
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Cases</h1>

            {/* Tabs aligned to the left */}
            <Tabs
                value={tab}
                onValueChange={(val) => {
                    setTab(val as Case["status"]);
                    setPage(0);
                }}
                className="mb-4"
            >
                <TabsList className="flex justify-start space-x-4 bg-gray-200 p-2 rounded-lg w-fit">
                    <TabsTrigger
                        value="Active"
                        className="px-4 py-2 focus:outline-none data-[state=active]:border-none data-[state=active]:bg-[#197D41] data-[state=active]:px-5 data-[state=active]:py-3 data-[state=active]:text-white text-gray-800 transition-all duration-300"
                    >
                        ACTIVE
                    </TabsTrigger>
                    <TabsTrigger
                        value="Urgent"
                        className="px-4 py-2 focus:outline-none data-[state=active]:border-none data-[state=active]:bg-[#197D41] data-[state=active]:px-5 data-[state=active]:py-3 data-[state=active]:text-white text-gray-800 transition-all duration-300"
                    >
                        URGENT
                    </TabsTrigger>
                    <TabsTrigger
                        value="Enforcement"
                        className="px-4 py-2 focus:outline-none data-[state=active]:border-none data-[state=active]:bg-[#197D41] data-[state=active]:px-5 data-[state=active]:py-3 data-[state=active]:text-white text-gray-800 transition-all duration-300"
                    >
                        ENFORCEMENT
                    </TabsTrigger>
                    <TabsTrigger
                        value="Appeal"
                        className="px-4 py-2 focus:outline-none data-[state=active]:border-none data-[state=active]:bg-[#197D41] data-[state=active]:px-5 data-[state=active]:py-3 data-[state=active]:text-white text-gray-800 transition-all duration-300"
                    >
                        APPEAL
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Table */}
            <div className="border rounded-lg p-2 shadow-sm">
                <Table className="bg-white">
                    <TableHeader>
                        <TableRow className="bg-primary-normal">
                            {["Reg No", "Reg Date", "Plaintiff", "CID No", "Case Title", "Types", "Bench", "Bench Clerk", "Status", "Nature", "Action"].map((head) => (
                                <TableHead key={head} className="font-heading">{head}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCases.length > 0 ? (
                            filteredCases.map((caseItem) => (
                                <TableRow key={caseItem.regNo}>
                                    <TableCell>{caseItem.regNo}</TableCell>
                                    <TableCell>{caseItem.regDate}</TableCell>
                                    <TableCell>{caseItem.plaintiff}</TableCell>
                                    <TableCell>{caseItem.cidNo}</TableCell>
                                    <TableCell>{caseItem.caseTitle}</TableCell>
                                    <TableCell>{caseItem.types}</TableCell>
                                    <TableCell>{caseItem.bench}</TableCell>
                                    <TableCell>{caseItem.benchClerk}</TableCell>
                                    <TableCell><Badge className="bg-green-600 text-white">{caseItem.status}</Badge></TableCell>
                                    <TableCell>{caseItem.nature}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mr-2"
                                            onClick={() => router.push(`/pages/registrar/case/${caseItem.regNo}`)}
                                        >
                                            <Eye size={16} />
                                        </Button>

                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(caseItem.regNo)}>
                                            <Trash size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center">No cases found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between items-center p-2">
                    <p className="text-sm">
                        Rows per page: {rowsPerPage} | {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, cases.filter(c => c.status === tab).length)} of {cases.filter(c => c.status === tab).length}
                    </p>
                    <div>
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>◀</Button>
                        <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * rowsPerPage >= cases.filter(c => c.status === tab).length}>▶</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
