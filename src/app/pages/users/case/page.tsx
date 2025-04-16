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
    id: number;
    case_number: string;
    registration_number: string;
    judgement_number: string | null;
    title: string;
    summary: string;
    case_priority: string;
    is_appeal: boolean;
    is_enforced: boolean;
    is_remanded: boolean;
    is_reopened: boolean;
    case_status: string;
    court_id: number;
    case_subtype_id: number | null;
    case_type_id: number | null;
    bench_id: number | null;
    created_at: string;
    updated_at: string;
}

const defaultRowsPerPage = 5;

export default function CaseInfoPage() {
    const { userRole, checkAuth, getUserRole } = useLoginStore();
    const [cases, setCases] = useState<Case[]>([]);
    const [secondTableCases, setSecondTableCases] = useState<Case[]>([]);
    const [tab, setTab] = useState<Case["case_status"] | "All">("All");
    const [secondTab, setSecondTab] = useState<"New cases" | "Miscellaneous" | "Judgement" | "All">("All");
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
            try {
                const token = localStorage.getItem("authToken");
                console.log("Auth Token:", token); // Debug token

                if (!token) {
                    console.error("No authentication token found");
                    return;
                }

                const response = await fetch("http://nganglam.lvh.me:3001/api/v1/cases", {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log("Response status:", response.status); // Debug response status

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("API Response:", data); // Debug API response

                if (data.status === "ok" && Array.isArray(data.data)) {
                    console.log("Cases data:", data.data); // Debug cases data
                    setCases(data.data);
                    setSecondTableCases(data.data);
                } else {
                    console.error("Invalid response format:", data);
                }
            } catch (error) {
                console.error("Error fetching cases:", error);
            }
        };
        fetchCases();
    }, [checkAuth]);

    // Debug state changes
    useEffect(() => {
        console.log("Current cases state:", cases);
        console.log("Current secondTableCases state:", secondTableCases);
    }, [cases, secondTableCases]);

    // Debugging
    useEffect(() => {
        console.log("Current role:", effectiveRole);
    }, [effectiveRole]);

    const filterCases = (data: Case[], status: Case["case_status"], subTypeFilter: string, typeFilter: string) => {
        console.log("Filtering cases with:", { status, subTypeFilter, typeFilter });
        console.log("Total cases before filtering:", data.length);

        const filtered = data
            .filter((c) => {
                const matchesStatus = status === "All" || c.case_status === status;
                console.log(`Case ${c.id} status: ${c.case_status}, matches: ${matchesStatus}`);
                return matchesStatus;
            })
            .filter((c) => {
                const matchesType = typeFilter === "All" ||
                    (typeFilter === "Civil" && c.case_type_id === 2) ||
                    (typeFilter === "Criminal" && c.case_type_id === 1);
                console.log(`Case ${c.id} type: ${c.case_type_id}, matches: ${matchesType}`);
                return matchesType;
            })
            .filter((c) => {
                const matchesSubType = subTypeFilter === "All" || c.case_subtype_id === 1;
                console.log(`Case ${c.id} subtype: ${c.case_subtype_id}, matches: ${matchesSubType}`);
                return matchesSubType;
            });

        console.log("Total cases after filtering:", filtered.length);
        return filtered;
    };

    const secondaryFilterCases = (data: Case[], query: string) => {
        console.log("Secondary filtering with query:", query);
        console.log("Cases before secondary filtering:", data.length);

        const filtered = data.filter((c) => {
            const matches = c.title.toLowerCase().includes(query.toLowerCase());
            console.log(`Case ${c.id} title: ${c.title}, matches: ${matches}`);
            return matches;
        });

        console.log("Cases after secondary filtering:", filtered.length);
        return filtered;
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

    const getCaseTypeLabel = (caseTypeId: number | null): string => {
        switch (caseTypeId) {
            case 1:
                return "Criminal";
            case 2:
                return "Civil";
            default:
                return "Other";
        }
    };

    const getCaseSubTypeLabel = (caseSubTypeId: number | null): string => {
        switch (caseSubTypeId) {
            case 1:
                return "Land dispute";
            case 2:
                return "Contract dispute";
            default:
                return "Other";
        }
    };

    return (
        <div className="p-4">

            <h1 className="text-xl font-semibold mb-4">Cases</h1>

            {/* First Table - Always Visible */}
            <div className="flex items-center space-x-4 mb-4">
                <Tabs value={tab} onValueChange={(val) => { setTab(val as Case["case_status"] | "All"); setPage(0); }} className="flex-1">
                    <TabsList className="flex justify-start space-x-4 bg-gray-200 p-2 rounded-lg w-fit">
                        {["All", "Active", "Urgent", "Enforcement", "Appeal"].map((status) => (
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
                            <TableHead className="font-heading">Reg No</TableHead>
                            <TableHead className="font-heading">Reg Date</TableHead>
                            <TableHead className="font-heading">Case Title</TableHead>
                            <TableHead className="font-heading">Types</TableHead>
                            <TableHead className="font-heading">Sub Type</TableHead>
                            <TableHead className="font-heading">Priority</TableHead>
                            <TableHead className="font-heading">Status</TableHead>
                            <TableHead className="font-heading">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedCases.length > 0 ? (
                            paginatedCases.map((caseItem) => (
                                <TableRow key={caseItem.id}>
                                    <TableCell>{caseItem.registration_number}</TableCell>
                                    <TableCell>{new Date(caseItem.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{caseItem.title}</TableCell>

                                    <TableCell>{getCaseTypeLabel(caseItem.case_type_id)}</TableCell>
                                    <TableCell>{getCaseSubTypeLabel(caseItem.case_subtype_id)}</TableCell>
                                    <TableCell>
                                        <Badge className={
                                            caseItem.case_priority === "high" ? "bg-red-600 text-white" :
                                                caseItem.case_priority === "medium" ? "bg-yellow-600 text-white" :
                                                    "bg-green-600 text-white"
                                        }>
                                            {caseItem.case_priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell><Badge className="bg-green-600 text-white">{caseItem.case_status}</Badge></TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mr-2"
                                            onClick={() => router.push(`/pages/users/case/${caseItem.id}`)}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">No cases found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
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
                        <Tabs value={secondTab} onValueChange={(val) => { setSecondTab(val as "New cases" | "Miscellaneous" | "Judgement" | "All"); setSecondTablePage(0); }} className="flex-1">
                            <TabsList className="flex justify-start space-x-4 bg-gray-200 p-2 rounded-lg w-fit">
                                {["All", "New cases", "Miscellaneous", "Judgement"].map((status) => (
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
                                    <TableHead className="font-heading">Reg No</TableHead>
                                    <TableHead className="font-heading">Reg Date</TableHead>
                                    <TableHead className="font-heading">Case Title</TableHead>
                                    <TableHead className="font-heading">Priority</TableHead>
                                    <TableHead className="font-heading">Types</TableHead>
                                    <TableHead className="font-heading">Sub Type</TableHead>
                                    <TableHead className="font-heading">Status</TableHead>
                                    <TableHead className="font-heading">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedSecondTableCases.length > 0 ? (
                                    paginatedSecondTableCases.map((caseItem) => (
                                        <TableRow key={caseItem.id}>
                                            <TableCell>{caseItem.registration_number}</TableCell>
                                            <TableCell>{new Date(caseItem.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{caseItem.title}</TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    caseItem.case_priority === "high" ? "bg-red-600 text-white" :
                                                        caseItem.case_priority === "medium" ? "bg-yellow-600 text-white" :
                                                            "bg-green-600 text-white"
                                                }>
                                                    {caseItem.case_priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{getCaseTypeLabel(caseItem.case_type_id)}</TableCell>
                                            <TableCell>{getCaseSubTypeLabel(caseItem.case_subtype_id)}</TableCell>
                                            <TableCell><Badge className="bg-green-600 text-white">{caseItem.case_status}</Badge></TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="mr-2"
                                                    onClick={() => router.push(`/pages/registrar/case/${caseItem.id}`)}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">No cases found</TableCell>
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