"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import Link from "next/link";
import router from "next/router";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface Case {
    regNo: string;
    regDate: string;
    plaintiff: string;
    cid: string;
    caseTitle: string;
    status: string;
    types?: string;
    bench?: string;
    clerk?: string;
    nature?: string;
}

interface CaseTableProps {
    userRole: string | null;
}

const CaseTable: React.FC<CaseTableProps> = ({ userRole }) => {
    const [data, setData] = useState<Case[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const router = useRouter();

    const getApiEndpoint = () => {
        switch (userRole) {
            case "Registrar":
                return "http://localhost:3002/casesRegistrar";
            case "Judge":
                return "http://localhost:3002/casesJudge";
            case "Clerk":
                return "http://localhost:3002/casesJudge";
            default:
                return "";
        }
    };

    useEffect(() => {
        const fetchCases = async () => {
            if (!userRole) return;
            setLoading(true);

            try {
                const response = await axios.get(getApiEndpoint());
                setData(response.data);
            } catch (error) {
                console.error("Error fetching case data:", error);
                setError("Failed to fetch cases.");
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, [userRole]);

    // Define Columns Based on User Role
    const columns = useMemo<ColumnDef<Case>[]>(() => {
        let baseColumns: ColumnDef<Case>[] = [
            { accessorKey: "regNo", header: "Reg No", enableSorting: true },
            { accessorKey: "regDate", header: "Reg Date", enableSorting: true },
            { accessorKey: "plaintiff", header: "Plaintiff", enableSorting: true },
            { accessorKey: "cid", header: "CID No", enableSorting: true },
            { accessorKey: "caseTitle", header: "Case Title", enableSorting: true },
            {
                accessorKey: "status",
                header: "Status",
                enableSorting: true,
                cell: ({ row }) => {
                    const status = row.original.status;
                    const colorClass =
                        status === "Ongoing"
                            ? "text-green-500"
                            : status === "Completed"
                                ? "text-blue-500"
                                : "text-red-500";
                    return <span className={colorClass}>{status}</span>;
                },
            },
        ];

        if (userRole === "Judge" || userRole === "Clerk") {
            baseColumns.push(
                { accessorKey: "types", header: "Types", enableSorting: true },
                { accessorKey: "bench", header: "Bench", enableSorting: true },
                { accessorKey: "clerk", header: "Bench Clerk", enableSorting: true },
                { accessorKey: "nature", header: "Nature", enableSorting: true }
            );
        }

        baseColumns.push({
            id: "action",
            header: "Action",
            cell: ({ row }) => (
                <a href={`/cases/${row.original.regNo}`} className="text-blue-500 hover:underline">
                    View
                </a>
            ),
        });

        return baseColumns;
    }, [userRole]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: { pageIndex: 0, pageSize: 5 },
        },
        globalFilterFn: "includesString",
    });

    const { getHeaderGroups, getRowModel, previousPage, nextPage, setPageSize, getState, setGlobalFilter: setTableFilter } = table;
    const { pageIndex, pageSize } = getState().pagination;

    const handleEditClick = (caseDetails: Case) => {
        setSelectedCase(caseDetails);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedCase(null);
    };

    // Apply search filter
    const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
        setTableFilter(e.target.value);
    };

    return (
        <div className="ml-[-16px] p-4">
            <div className="mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h2 className="font-heading font-semibold">
                        {userRole ? `${userRole} Cases` : "Cases"}
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search cases..."
                            value={globalFilter}
                            onChange={(e) => {
                                setGlobalFilter(e.target.value);
                                table.setGlobalFilter(e.target.value);
                            }}
                            className="border rounded px-3 py-2 w-65 sm:w-auto"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStatusFilter(value);
                                table.getColumn("status")?.setFilterValue(value);
                            }}
                            className="border rounded px-3 py-2 w-65 sm:w-auto"
                        >
                            <option value="">All Status</option>
                            <option value="Today">Today</option>
                            <option value="Yesterday">Yesterday</option>
                        </select>
                    </div>
                </div>
            </div>

            <Table className="w-full border border-gray-300 rounded-md">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} onClick={() => header.column.getToggleSortingHandler()}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() ? (
                                        header.column.getIsSorted() === "asc" ? " ↑" : " ↓"
                                    ) : null}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : error ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-red-500">
                                {error ?? "An error occurred"}
                            </TableCell>
                        </TableRow>
                    ) : data.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-4 py-2 text-sm text-gray-1000 border-b border-gray-200">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                No cases found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
                {/* Pagination Controls */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-gray-200 text-gray-700 px-2 py-2 rounded disabled:opacity-50 flex items-center"
                    >
                        <FaChevronLeft />
                    </button>
                    <div className="px-2 text-sm font-medium">
                        {pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <button
                        onClick={() => nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="bg-gray-200 text-gray-700 px-2 py-2 rounded disabled:opacity-50 flex items-center"
                    >
                        <FaChevronRight />
                    </button>
                </div>

                {/* Rows Per Page */}
                <div className="flex items-center">
                    <label htmlFor="pageSize" className="mr-2">Rows per page:</label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="border-gray-300 rounded px-2 py-1"
                    >
                        {[5, 10, 15, 20].map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CaseTable;
