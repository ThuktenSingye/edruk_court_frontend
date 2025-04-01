"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface Case {
    regNo: number;
    regDate: string;
    plaintiff: string;
    cidNo: string;
    caseTitle: string;
    types: string;
    sub_type: string;
    status: "Active" | "Urgent" | "Enforcement" | "Appeal" | "New cases" | "Miscellaneous" | "Judgement";
}

const defaultRowsPerPage = 5;

export default function CaseInfoPage() {
    const { userRole, checkAuth, getUserRole } = useLoginStore();
    const [cases, setCases] = useState<Case[]>([]);
    const [secondTableCases, setSecondTableCases] = useState<Case[]>([]);
    const [tab, setTab] = useState<Case["status"]>("Active");
    const [secondTab, setSecondTab] = useState<"New cases" | "Miscellaneous" | "Judgement">("New cases");
    const [filterCategory, setFilterCategory] = useState<"Civil" | "Criminal" | "All">("All");
    const [subFilter, setSubFilter] = useState<string>("All");
    const [secondTableSubFilter, setSecondTableSubFilter] = useState<string>("All");
    const [secondTableTypeFilter, setSecondTableTypeFilter] = useState<"Civil" | "Criminal" | "All">("All");

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [secondTablePage, setSecondTablePage] = useState(0);
    const [secondTableRowsPerPage, setSecondTableRowsPerPage] = useState(defaultRowsPerPage);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [secondTableSearchQuery, setSecondTableSearchQuery] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get role with multiple fallbacks
    const effectiveRole = searchParams.get('role') || userRole || getUserRole() ||
        (typeof window !== 'undefined' ? localStorage.getItem("userRole") : null);

    useEffect(() => {
        checkAuth(); // Ensure authentication is checked
        const fetchCases = async () => {
            const response = await fetch("http://localhost:3002/cases");
            const data = await response.json();
            setCases(data);
            setSecondTableCases(data);
        };
        fetchCases();
    }, [checkAuth]);

    // Debugging
    useEffect(() => {
        console.log("Current role:", effectiveRole);
    }, [effectiveRole]);

    const filterCases = (data: Case[], status: Case["status"], subTypeFilter: string, typeFilter: string) => {
        return data
            .filter((c) => c.status === status)
            .filter((c) =>
                typeFilter === "All" ||
                (typeFilter === "Civil" && c.types.includes("Civil")) ||
                (typeFilter === "Criminal" && c.types.includes("Criminal"))
            )
            .filter((c) => subTypeFilter === "All" || c.sub_type === subTypeFilter);
    };

    const secondaryFilterCases = (data: Case[], query: string) => {
        return data.filter((c) => c.caseTitle.toLowerCase().includes(query.toLowerCase()));
    };

    const filteredCases = secondaryFilterCases(
        filterCases(cases, tab, subFilter, filterCategory),
        searchQuery
    );

    const filteredSecondTableCases = secondaryFilterCases(
        filterCases(secondTableCases, secondTab, secondTableSubFilter, secondTableTypeFilter),
        secondTableSearchQuery
    );

    const getPaginatedRows = (filteredData: Case[], page: number, rowsPerPage: number) => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const paginatedCases = getPaginatedRows(filteredCases, page, rowsPerPage);
    const paginatedSecondTableCases = getPaginatedRows(filteredSecondTableCases, secondTablePage, secondTableRowsPerPage);

    const totalPages = Math.ceil(filteredCases.length / rowsPerPage);
    const totalSecondTablePages = Math.ceil(filteredSecondTableCases.length / secondTableRowsPerPage);

    const isRegistrar = effectiveRole === "Registrar";

    return (
        <div className="p-4">

            <h1 className="text-xl font-semibold mb-4">Cases</h1>

            {/* First Table - Always Visible */}
            <div className="flex items-center space-x-4 mb-4">
                <Tabs value={tab} onValueChange={(val) => { setTab(val as Case["status"]); setPage(0); }} className="flex-1">
                    <TabsList className="flex justify-start space-x-4 bg-gray-200 p-2 rounded-lg w-fit">
                        {["Active", "Urgent", "Enforcement", "Appeal"].map((status) => (
                            <TabsTrigger key={status} value={status} className="px-4 py-2 data-[state=active]:bg-[#197D41] data-[state=active]:text-white">
                                {status}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <select
                    className="p-2 border rounded"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as "Civil" | "Criminal" | "All")}
                >
                    <option value="All">All</option>
                    <option value="Civil">Civil</option>
                    <option value="Criminal">Criminal</option>
                </select>

                <select
                    className="p-2 border rounded"
                    value={subFilter}
                    onChange={(e) => setSubFilter(e.target.value)}
                >
                    <option value="All">All Sub Types</option>
                    <option value="Land dispute">Land dispute</option>
                    <option value="Contract dispute">Contract dispute</option>
                </select>

                <input
                    type="text"
                    placeholder="Search by Case Title"
                    className="p-2 border rounded w-48 ml-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* First Table */}
            <div className="border rounded-lg p-2 shadow-sm">
                <Table className="bg-white">
                    <TableHeader>
                        <TableRow className="bg-primary-normal">
                            {["Reg No", "Reg Date", "Plaintiff", "CID No", "Case Title", "Types", "Sub Type", "Status", "Action"].map((head) => (
                                <TableHead key={head} className="font-heading">{head}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCases.length > 0 ? (
                            paginatedCases.map((caseItem) => (
                                <TableRow key={caseItem.regNo}>
                                    <TableCell>{caseItem.regNo}</TableCell>
                                    <TableCell>{caseItem.regDate}</TableCell>
                                    <TableCell>{caseItem.plaintiff}</TableCell>
                                    <TableCell>{caseItem.cidNo}</TableCell>
                                    <TableCell>{caseItem.caseTitle}</TableCell>
                                    <TableCell>{caseItem.types}</TableCell>
                                    <TableCell>{caseItem.sub_type}</TableCell>
                                    <TableCell><Badge className="bg-green-600 text-white">{caseItem.status}</Badge></TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mr-2"
                                            onClick={() => router.push(`/pages/users/case/${caseItem.regNo}`)}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center">No cases found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination for the first table */}
            <div className="flex justify-between mt-4 items-center">
                <div className="flex items-center">
                    <span>Rows per page: </span>
                    <select className="p-2 ml-2 border rounded" onChange={(e) => setRowsPerPage(Number(e.target.value))} value={rowsPerPage}>
                        {[5, 10, 15].map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
                        {"<"}
                    </Button>
                    <span>{page + 1} of {totalPages}</span>
                    <Button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={page === totalPages - 1}>
                        {">"}
                    </Button>
                </div>
            </div>

            {/* Second Table - Only for registrar */}
            {isRegistrar && (
                <>
                    <h2 className="text-lg font-semibold mt-8 mb-4">New Cases</h2>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <Tabs value={secondTab} onValueChange={(val) => { setSecondTab(val as "New cases" | "Miscellaneous" | "Judgement"); setSecondTablePage(0); }} className="flex-1">
                            <TabsList className="flex justify-start space-x-4 bg-gray-200 p-2 rounded-lg w-fit">
                                {["New cases", "Miscellaneous", "Judgement"].map((status) => (
                                    <TabsTrigger key={status} value={status} className="px-4 py-2 data-[state=active]:bg-[#197D41] data-[state=active]:text-white">
                                        {status}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center space-x-4">
                            <select
                                className="p-2 border rounded"
                                value={secondTableTypeFilter}
                                onChange={(e) => setSecondTableTypeFilter(e.target.value as "Civil" | "Criminal" | "All")}
                            >
                                <option value="All">All</option>
                                <option value="Civil">Civil</option>
                                <option value="Criminal">Criminal</option>
                            </select>

                            <select
                                className="p-2 border rounded"
                                value={secondTableSubFilter}
                                onChange={(e) => setSecondTableSubFilter(e.target.value)}
                            >
                                <option value="All">All Sub Types</option>
                                <option value="Land dispute">Land dispute</option>
                                <option value="Contract dispute">Contract dispute</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Search by Case Title"
                                className="p-2 border rounded w-48"
                                value={secondTableSearchQuery}
                                onChange={(e) => setSecondTableSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="border rounded-lg p-2 shadow-sm mt-4">
                        <Table className="bg-white">
                            <TableHeader>
                                <TableRow className="bg-primary-normal">
                                    {["Reg No", "Reg Date", "Plaintiff", "CID No", "Case Title", "Types", "Sub Type", "Status", "Action"].map((head) => (
                                        <TableHead key={head} className="font-heading">{head}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedSecondTableCases.length > 0 ? (
                                    paginatedSecondTableCases.map((caseItem) => (
                                        <TableRow key={caseItem.regNo}>
                                            <TableCell>{caseItem.regNo}</TableCell>
                                            <TableCell>{caseItem.regDate}</TableCell>
                                            <TableCell>{caseItem.plaintiff}</TableCell>
                                            <TableCell>{caseItem.cidNo}</TableCell>
                                            <TableCell>{caseItem.caseTitle}</TableCell>
                                            <TableCell>{caseItem.types}</TableCell>
                                            <TableCell>{caseItem.sub_type}</TableCell>
                                            <TableCell><Badge className="bg-green-600 text-white">{caseItem.status}</Badge></TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="mr-2"
                                                    onClick={() => router.push(`/pages/registrar/case/${caseItem.regNo}`)}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center">No cases found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination for the second table */}
                    <div className="flex justify-between mt-4 items-center">
                        <div className="flex items-center">
                            <span>Rows per page: </span>
                            <select className="p-2 ml-2 border rounded" onChange={(e) => setSecondTableRowsPerPage(Number(e.target.value))} value={secondTableRowsPerPage}>
                                {[5, 10, 15].map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button onClick={() => setSecondTablePage((prev) => Math.max(prev - 1, 0))} disabled={secondTablePage === 0}>
                                {"<"}
                            </Button>
                            <span>{secondTablePage + 1} of {totalSecondTablePages}</span>
                            <Button onClick={() => setSecondTablePage((prev) => Math.min(prev + 1, totalSecondTablePages - 1))} disabled={secondTablePage === totalSecondTablePages - 1}>
                                {">"}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}