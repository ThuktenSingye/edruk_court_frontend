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

interface Registrar {
    id: string;
    name: string;
    cidNo: string;
    email: string;
    password: string;
    courtName: string;
    contactNo: string;
    gender: string;
}

const RegistrarTable = () => {
    const [registrarData, setRegistrarData] = useState<Registrar[]>([]);
    const [newRegistrar, setNewRegistrar] = useState<Registrar>({
        id: "",
        name: "",
        cidNo: "",
        email: "",
        password: "",
        courtName: "",
        contactNo: "",
        gender: "",
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
    const [editRegistrar, setEditRegistrar] = useState<Registrar | null>(null); // For editing registrar

    useEffect(() => {
        const fetchRegistrarData = async () => {
            try {
                const response = await fetch("http://localhost:3002/registrartable");
                const data = await response.json();
                setRegistrarData(data);
            } catch (error) {
                console.error("Error fetching registrar data:", error);
            }
        };
        fetchRegistrarData();
    }, []);

    const columns = useMemo<ColumnDef<Registrar>[]>(() => [
        { accessorKey: "id", header: "Sl.No" },
        { accessorKey: "name", header: "Registrar Name" },
        { accessorKey: "cidNo", header: "CID NO" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "password", header: "Password" },
        { accessorKey: "courtName", header: "Court Name" },
        { accessorKey: "contactNo", header: "Contact No" },
        { accessorKey: "gender", header: "Gender" },
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
        data: registrarData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageIndex: 0, pageSize: 9 } },
    });

    const { getHeaderGroups, getRowModel, previousPage, nextPage, setPageSize, getState } = table;
    const { pageIndex, pageSize } = getState().pagination;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editRegistrar) {
            setEditRegistrar({ ...editRegistrar, [e.target.name]: e.target.value });
        } else {
            setNewRegistrar({ ...newRegistrar, [e.target.name]: e.target.value });
        }
    };

    const handleAddRegistrar = () => {
        setRegistrarData((prev) => [
            ...prev,
            { ...newRegistrar, id: String(prev.length + 1) },
        ]);
        setNewRegistrar({
            id: "",
            name: "",
            cidNo: "",
            email: "",
            password: "",
            courtName: "",
            contactNo: "",
            gender: "",
        });
        setIsDialogOpen(false); // Close the dialog after adding
    };

    const handleEditRegistrar = () => {
        if (editRegistrar) {
            setRegistrarData((prev) =>
                prev.map((registrar) =>
                    registrar.id === editRegistrar.id ? editRegistrar : registrar
                )
            );
            setEditRegistrar(null); // Clear the edit form
            setIsDialogOpen(false); // Close the dialog after editing
        }
    };

    const handleEdit = (registrar: Registrar) => {
        setEditRegistrar(registrar);
        setIsDialogOpen(true); // Open the dialog for editing
    };

    const handleDelete = (id: string) => {
        setRegistrarData((prev) => prev.filter((registrar) => registrar.id !== id));
    };

    return (
        <div className="ml-[-4px] p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold">Registrar</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsDialogOpen(true)} className="bg-primary-normal text-white flex items-center gap-2 transition-transform duration-300 hover:scale-110">
                            {editRegistrar ? "Edit Registrar" : "Add Registrar"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editRegistrar ? "Edit Registrar" : "Add New Registrar"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input name="name" value={editRegistrar ? editRegistrar.name : newRegistrar.name} onChange={handleInputChange} placeholder="Registrar Name" />
                            <Input name="courtName" value={editRegistrar ? editRegistrar.courtName : newRegistrar.courtName} onChange={handleInputChange} placeholder="Court Name" />
                            <Input name="cidNo" value={editRegistrar ? editRegistrar.cidNo : newRegistrar.cidNo} onChange={handleInputChange} placeholder="Cid No" />
                            <Input name="email" value={editRegistrar ? editRegistrar.cidNo : newRegistrar.email} onChange={handleInputChange} placeholder="Email" />
                            <Input name="password" value={editRegistrar ? editRegistrar.cidNo : newRegistrar.password} onChange={handleInputChange} placeholder="Password" />
                            <Input name="contactNo" value={editRegistrar ? editRegistrar.contactNo : newRegistrar.contactNo} onChange={handleInputChange} placeholder="Contact No" />
                            <Input name="gender" value={editRegistrar ? editRegistrar.gender : newRegistrar.gender} onChange={handleInputChange} placeholder="Gender" />
                        </div>
                        <DialogFooter>
                            <Button onClick={editRegistrar ? handleEditRegistrar : handleAddRegistrar} className="bg-green-700">
                                {editRegistrar ? "Save Changes" : "Add Registrar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Table className="w-full border border-gray-300 rounded-md">
                <TableHeader>
                    {getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-green-700 text-white">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {typeof header.column.columnDef.header === "function"
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
        </div>
    );
};

export default RegistrarTable;
