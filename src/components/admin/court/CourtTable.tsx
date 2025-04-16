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
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
} from "@tanstack/react-table";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Court {
    id: string;
    name: string;
    type: string;
    parent_court_id: string;
    contact_no: string;
    email: string;
    sub_domain: string;
}

const CourtTable = () => {
    const [courtData, setCourtData] = useState<Court[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCourt, setNewCourt] = useState<Court>({
        id: "",
        name: "",
        type: "",
        parent_court_id: "",
        contact_no: "",
        email: "",
        sub_domain: "",
    });
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);

    useEffect(() => {
        const fetchCourtData = async () => {
            try {
                const response = await fetch("http://localhost:3002/courtstable");
                const data = await response.json();
                setCourtData(data);
            } catch (error) {
                console.error("Error fetching court data:", error);
            }
        };
        fetchCourtData();
    }, []);

    const columns = useMemo<ColumnDef<Court>[]>(() => [
        {
            accessorKey: "id",
            header: "Sl No",
        },
        {
            accessorKey: "name",
            header: "Court Name",
        },
        {
            accessorKey: "type",
            header: "Court Type",
        },
        {
            accessorKey: "parent_court_id",
            header: "Parent Court",
        },
        {
            accessorKey: "contact_no",
            header: "Contact Number",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "sub_domain",
            header: "Subdomain",
        },
        {
            id: "action",
            header: "Action",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEditCourt(row.original)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteCourt(row.original.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ], []);

    const table = useReactTable({
        data: courtData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
        },
    });

    const { getHeaderGroups, getRowModel, previousPage, nextPage, setPageSize, getState } = table;
    const { pageIndex, pageSize } = getState().pagination;

    const handleAddCourt = () => {
        setNewCourt({
            id: "",
            name: "",
            type: "",
            parent_court_id: "",
            contact_no: "",
            email: "",
            sub_domain: "",
        });
        setEditingCourt(null);
        setIsDialogOpen(true);
    };

    const handleEditCourt = (court: Court) => {
        setEditingCourt(court);
        setNewCourt({ ...court });
        setIsDialogOpen(true);
    };

    const handleDeleteCourt = (id: string) => {
        setCourtData((prevData) => prevData.filter((court) => court.id !== id));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (editingCourt) {
            setEditingCourt((prev) => prev ? { ...prev, [name]: value } : null);
        } else {
            setNewCourt((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        if (editingCourt) {
            setCourtData((prev) =>
                prev.map((court) => (court.id === editingCourt.id ? editingCourt : court))
            );
        } else {
            setCourtData((prev) => [...prev, { ...newCourt, id: Date.now().toString() }]);
        }
        setIsDialogOpen(false);
        setEditingCourt(null);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold">Court Details</h2>
                <button
                    onClick={handleAddCourt}
                    className="bg-primary-normal text-white px-4 py-2 rounded flex items-center gap-2 transition-transform duration-300 hover:scale-105"
                >
                    <FaPlus />
                    <span>Add Court</span>
                </button>
            </div>

            <Table className="w-full border border-gray-300 rounded-md">
                <TableHeader>
                    {getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : typeof header.column.columnDef.header === "function"
                                            ? header.column.columnDef.header(header.getContext())
                                            : header.column.columnDef.header}
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
                                    {typeof cell.column.columnDef.cell === "function"
                                        ? cell.column.columnDef.cell(cell.getContext())
                                        : cell.column.columnDef.cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end items-center mt-4 space-x-4">
                <button
                    onClick={() => previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50 flex items-center"
                >
                    <FaChevronLeft className="mr-0" />
                </button>

                <div className="px-4">
                    {pageIndex + 1} of {table.getPageCount()}
                </div>

                <button
                    onClick={() => nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50 flex items-center"
                >
                    <FaChevronRight className="ml-0" />
                </button>

                <div className="flex items-center">
                    <label htmlFor="pageSize" className="mr-2">
                        Rows per page:
                    </label>
                    <select
                        id="pageSize"
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCourt ? "Edit Court" : "Add New Court"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input name="name" value={editingCourt ? editingCourt.name : newCourt.name} onChange={handleChange} placeholder="Court Name" />
                        <select
                            name="type"
                            value={editingCourt ? editingCourt.type : newCourt.type}
                            onChange={handleChange}
                            className="border border-gray-300 text-gray-500 rounded p-2 w-full"
                        >
                            <option value="">Select Court Type</option>
                            <option value="Dzongkhag">Dzongkhag</option>
                            <option value="Dungkhag">Dungkhag</option>
                            <option value="Supreme">Supreme</option>
                            <option value="High">High</option>
                            <option value="Bench">Bench</option>
                        </select>
                        <Input name="parent_court_id" value={editingCourt ? editingCourt.parent_court_id : newCourt.parent_court_id} onChange={handleChange} placeholder="Parent Court" />
                        <Input name="contact_no" value={editingCourt ? editingCourt.contact_no : newCourt.contact_no} onChange={handleChange} placeholder="Contact No" />
                        <Input name="email" value={editingCourt ? editingCourt.email : newCourt.email} onChange={handleChange} placeholder="Email" />
                        <Input name="sub_domain" value={editingCourt ? editingCourt.sub_domain : newCourt.sub_domain} onChange={handleChange} placeholder="Subdomain" />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)} variant="secondary">Cancel</Button>
                        <Button onClick={handleSubmit}>{editingCourt ? "Save Changes" : "Add Court"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourtTable;
