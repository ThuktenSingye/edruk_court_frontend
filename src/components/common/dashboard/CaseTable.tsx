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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CaseTableSkeleton } from "./CaseTableSkeleton";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface Case {
    id: number;
    case_number: string;
    registration_number: string;
    judgement_number: string;
    title: string;
    summary: string;
    case_priority: string;
    case_status: string;
    case_subtype: number;
    court: number;
}

interface CaseTableProps {
    userRole: string | null;
}

const CaseTable: React.FC<CaseTableProps> = ({ userRole }) => {
    const [data, setData] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const router = useRouter();
    const { token, isAuthenticated } = useLoginStore();

    useEffect(() => {
        const fetchCases = async () => {
            if (!userRole || !token || !isAuthenticated) {
                setLoading(false);
                setError("Please log in to view cases.");
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const host = window.location.hostname;

                const response = await axios.get(`http://nganglam.lvh.me:3001/api/v1/cases`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data && response.data.status === "ok" && Array.isArray(response.data.data)) {
                    setData(response.data.data);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching case data:", error);
                if (axios.isAxiosError(error)) {
                    console.log("Response data:", error.response?.data);
                    console.log("Response status:", error.response?.status);
                    if (error.response?.status === 401) {
                        setError("Session expired. Please log in again.");
                    } else {
                        setError(error.response?.data?.message || `Failed to fetch cases: ${error.message}`);
                    }
                } else {
                    setError(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, [userRole, token, isAuthenticated]);

    // Define Columns Based on User Role
    const columns = useMemo<ColumnDef<Case>[]>(() => {
        if (!userRole) return [];

        let baseColumns: ColumnDef<Case>[] = [
            {
                accessorKey: "registration_number",
                header: "Reg No",
                enableSorting: true
            },
            {
                accessorKey: "case_number",
                header: "Case No",
                enableSorting: true
            },
            {
                accessorKey: "title",
                header: "Title",
                enableSorting: true
            },
            {
                accessorKey: "summary",
                header: "Summary",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="max-w-xs truncate">
                        {row.original.summary}
                    </div>
                ),
            },
            {
                accessorKey: "case_status",
                header: "Status",
                enableSorting: true,
                cell: ({ row }) => {
                    const status = row.original.case_status;
                    const colorClass =
                        status === "Ongoing"
                            ? "text-green-500"
                            : status === "Completed"
                                ? "text-blue-500"
                                : "text-red-500";
                    return <span className={colorClass}>{status}</span>;
                },
            },
            {
                accessorKey: "case_priority",
                header: "Priority",
                enableSorting: true,
                cell: ({ row }) => {
                    const priority = row.original.case_priority;
                    const colorClass =
                        priority === "High"
                            ? "text-red-500"
                            : priority === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500";
                    return <span className={colorClass}>{priority}</span>;
                },
            },
        ];

        if (userRole === "Judge" || userRole === "Clerk") {
            baseColumns.push(
                {
                    accessorKey: "case_subtype",
                    header: "Subtype",
                    enableSorting: true
                },
                {
                    accessorKey: "court",
                    header: "Court",
                    enableSorting: true
                }
            );
        }

        baseColumns.push({
            id: "action",
            header: "Action",
            cell: ({ row }) => (
                <Button
                    onClick={() => router.push(`/pages/users/case/${row.original.id}`)}
                    variant="link"
                    className="text-blue-500 hover:underline p-0"
                >
                    View
                </Button>
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
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    if (loading) {
        return <CaseTableSkeleton userRole={userRole} />;
    }

    if (!userRole || !isAuthenticated) {
        return (
            <div className="p-4">
            </div>
        );
    }

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
                            }}
                            className="border rounded px-3 py-2 w-65 sm:w-auto"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStatusFilter(value);
                                table.getColumn("case_status")?.setFilterValue(value);
                            }}
                            className="border rounded px-3 py-2 w-65 sm:w-auto"
                        >
                            <option value="">All Status</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            <Table className="w-full border border-gray-300 rounded-md">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    onClick={() => header.column.getToggleSortingHandler()}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
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
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="px-4 py-2 text-sm text-gray-1000 border-b border-gray-200"
                                    >
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
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="bg-gray-200 text-gray-700 px-2 py-2 rounded disabled:opacity-50 flex items-center"
                    >
                        <FaChevronLeft />
                    </button>
                    <div className="px-2 text-sm font-medium">
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <button
                        onClick={() => table.nextPage()}
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
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
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