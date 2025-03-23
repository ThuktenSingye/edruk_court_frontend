"use client";

import React, { useMemo, useState } from "react";
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
import useFetch from "../../../app/hooks/usefetchDashboard";

interface Case {
    regNo: string;
    regDate: string;
    plaintiff: string;
    cid: string;
    caseTitle: string;
    types: string;
    bench: string;
    clerk: string;
    status: string;
    nature: string;
}

const CaseTable = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const { data, loading, error } = useFetch(
        "http://localhost:3002/casesJudge",
        {}
    );

    // Ensure that the data is an array or fallback to an empty array
    const caseData: Case[] = Array.isArray(data) ? data : [];

    const columns = useMemo<ColumnDef<Case>[]>(() => [
        { accessorKey: "regNo", header: "Reg No", enableSorting: true },
        { accessorKey: "regDate", header: "Reg Date", enableSorting: true },
        { accessorKey: "plaintiff", header: "Plaintiff", enableSorting: true },
        { accessorKey: "cid", header: "CID No", enableSorting: true },
        { accessorKey: "caseTitle", header: "Case Title", enableSorting: true },
        { accessorKey: "types", header: "Types", enableSorting: true },
        { accessorKey: "bench", header: "Bench", enableSorting: true },
        { accessorKey: "clerk", header: "Bench Clerk", enableSorting: true },
        {
            accessorKey: "status",
            header: "Status",
            enableSorting: true,
            cell: ({ row }) => {
                const status = row.original.status;
                const colorClass =
                    status === "Ongoing"
                        ? "text-green-500"
                        : status === "Ongoing"
                            ? "text-blue-500"
                            : "text-red-500";
                return <span className={colorClass}>{status}</span>;
            },
        },
        { accessorKey: "nature", header: "Nature", enableSorting: true },
        {
            id: "action",
            header: "Action",
            cell: ({ row }) => (
                <a
                    href={`/cases/${row.original.regNo}`}
                    className="text-blue-500 hover:underline"
                >
                    View
                </a>
            ),
        },
    ], []);

    const table = useReactTable({
        data: caseData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
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
                    <h2 className="font-heading font-semibold">Case Details</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search cases..."
                            value={globalFilter}
                            onChange={handleGlobalFilterChange}
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
                            <option value="Ongoing">Ongoing</option>
                            <option value="Scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>
            </div>

            <Table className="w-full border border-gray-300 rounded-md">
                <TableHeader>
                    {getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} onClick={() => header.column.getToggleSortingHandler()}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() ? (
                                        header.column.getIsSorted() === "asc" ? (
                                            <span> ↑</span>
                                        ) : (
                                            <span> ↓</span>
                                        )
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
                    ) : caseData && caseData.length > 0 ? (
                        getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="bg-white">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
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

            {/* Pagination Controls */}
            {/* Pagination and Rows Per Page Controls */}
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
        </div >
    );
};

export default CaseTable;
