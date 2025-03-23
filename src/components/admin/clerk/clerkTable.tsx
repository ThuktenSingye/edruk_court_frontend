"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Clerk {
    id: number;
    name: string;
    cidNo: string;
    email: string;
    password: string;
    courtName: string;
    contactNo: string;
    gender: string;
}

const ClerkTable = () => {
    const [clerkData, setClerkData] = useState<Clerk[]>([]);
    const [currentClerk, setCurrentClerk] = useState<Clerk | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchClerkData = async () => {
            try {
                const response = await fetch("http://localhost:3002/clerkstable");
                const data = await response.json();
                setClerkData(data);
            } catch (error) {
                console.error("Error fetching clerk data:", error);
            }
        };
        fetchClerkData();
    }, []);

    const columns = useMemo<ColumnDef<Clerk>[]>(() => [
        { accessorKey: "id", header: "Sl No" },
        { accessorKey: "name", header: "Clerk Name" },
        { accessorKey: "cidNo", header: "CID No" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "password", header: "Password" },
        { accessorKey: "courtName", header: "Court Name" },
        { accessorKey: "gender", header: "Gender" },
        { accessorKey: "contactNo", header: "Contact No" },
        {
            id: "action",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(row.original)}
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: clerkData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageIndex: 0, pageSize: 9 } },
    });

    const { getHeaderGroups, getRowModel, previousPage, nextPage, setPageSize, getState } = table;
    const { pageIndex, pageSize } = getState().pagination;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (currentClerk) {
            setCurrentClerk({
                ...currentClerk,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleAddClerk = () => {
        if (!currentClerk) return;

        if (isEditing) {
            setClerkData((prev) =>
                prev.map((clerk) =>
                    clerk.id === currentClerk.id ? currentClerk : clerk
                )
            );
        } else {
            setClerkData((prev) => [
                ...prev,
                { ...currentClerk, id: prev.length + 1 },
            ]);
        }

        resetDialog();
    };

    const handleEdit = (clerk: Clerk) => {
        setCurrentClerk(clerk);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        setClerkData((prev) => prev.filter((clerk) => clerk.id !== id));
    };

    const resetDialog = () => {
        setCurrentClerk({
            id: 0,
            name: "",
            cidNo: "",
            email: "",
            password: "",
            courtName: "",
            contactNo: "",
            gender: "",
        });
        setIsEditing(false);
        setIsDialogOpen(false);
    };

    return (
        <div className="ml-[-4px] p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold">Clerk</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                setIsDialogOpen(true);
                            }}
                            className="bg-green-800 text-white hover:scale-105 transition-transform"
                        >
                            Add Clerk
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEditing ? "Edit Clerk" : "Add Clerk"}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            {["name", "cidNo", "courtName", "contactNo", "gender"].map((field) => (
                                <Input
                                    key={field}
                                    name={field}
                                    value={currentClerk?.[field as keyof Clerk] || ""}
                                    onChange={handleInputChange}
                                    placeholder={field}
                                />
                            ))}
                        </div>

                        <DialogFooter>
                            <Button onClick={handleAddClerk} className="bg-green-800">
                                {isEditing ? "Update Clerk" : "Add Clerk"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table className="w-full border border-gray-300 rounded-md">
                <TableHeader>
                    {getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {typeof header.column.columnDef.header === 'function'
                                        ? header.column.columnDef.header(header.getContext())
                                        : header.column.columnDef.header ?? header.column.id}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="bg-white hover:bg-gray-100">
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {typeof cell.column.columnDef.cell === 'function'
                                        ? cell.column.columnDef.cell(cell.getContext())
                                        : cell.getValue()}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end items-center mt-4 space-x-4">
                <button
                    onClick={previousPage}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    <FaChevronLeft />
                </button>

                <span>{pageIndex + 1} of {table.getPageCount()}</span>

                <button
                    onClick={nextPage}
                    disabled={!table.getCanNextPage()}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    <FaChevronRight />
                </button>

                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border-gray-300 rounded px-2 py-1"
                >
                    {[5, 10, 15, 20].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ClerkTable;
