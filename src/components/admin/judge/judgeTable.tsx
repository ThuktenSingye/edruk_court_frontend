"use client"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Court {
    id: string;
    name: string;
    cidNo: string;
    email: string;
    password: string;
    courtName: string;
    contactNo: string;
    gender: string;
}

const JudgeTable = () => {
    const [courtData, setCourtData] = useState<Court[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingJudge, setEditingJudge] = useState<Court | null>(null);
    const [newJudge, setNewJudge] = useState<Court>({
        id: "",
        name: "",
        cidNo: "",
        email: "",
        password: "",
        courtName: "",
        contactNo: "",
        gender: "",
    });

    useEffect(() => {
        const fetchCourtData = async () => {
            try {
                const response = await fetch("http://localhost:3002/judgetable");
                const data = await response.json();
                setCourtData(data);
            } catch (error) {
                console.error("Error fetching court data:", error);
            }
        };
        fetchCourtData();
    }, []);

    const handleEdit = (judge: Court) => {
        setEditingJudge(judge);
        setNewJudge(judge);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setCourtData((prev) => prev.filter((judge) => judge.id !== id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewJudge((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (editingJudge) {
            // Update judge details
            setCourtData((prev) =>
                prev.map((judge) => (judge.id === editingJudge.id ? newJudge : judge))
            );
        } else {
            // Add new judge
            setCourtData((prev) => [...prev, { ...newJudge, id: String(prev.length + 1) }]);
        }
        setIsDialogOpen(false);
        setEditingJudge(null);
        setNewJudge({ id: "", name: "", cidNo: "", email: "", password: "", courtName: "", contactNo: "", gender: "" });
    };

    const columns = useMemo<ColumnDef<Court>[]>(() => [
        { accessorKey: "id", header: "Sl No" },
        { accessorKey: "name", header: "Judge Name" },
        { accessorKey: "cidNo", header: "CID No" },
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
        data: courtData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageIndex: 0, pageSize: 9 } },
    });

    const { getHeaderGroups, getRowModel, previousPage, nextPage, setPageSize, getState } = table;
    const { pageIndex, pageSize } = getState().pagination;

    return (
        <div className="ml-[-4px] p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-semibold">Judge</h2>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-primary-normal text-white px-4 py-2 rounded flex items-center gap-2 transition-transform duration-300 hover:scale-105"
                >
                    <span>Add Judge</span>
                </button>
            </div>

            <Table className="w-full border border-gray-300 rounded-md">
                <TableHeader>
                    {getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
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

            <div className="flex justify-end items-center mt-4 gap-4">
                <button onClick={previousPage} disabled={!table.getCanPreviousPage()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50 flex items-center">
                    <FaChevronLeft className="mr-2" />
                </button>
                <span>{pageIndex + 1} of {table.getPageCount()}</span>
                <button onClick={nextPage} disabled={!table.getCanNextPage()} className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:opacity-50 flex items-center">
                    <FaChevronRight className="ml-2" />
                </button>

                <label htmlFor="pageSize" className="ml-4">
                    Rows per page:
                </label>
                <select id="pageSize" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border-gray-300 rounded px-2 py-1">
                    {[5, 10, 15, 20].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingJudge ? "Edit Judge" : "Add Judge"}</DialogTitle>
                    </DialogHeader>
                    {["name", "cidNo", "email", "password", "contactNo", "gender"].map((field) => (
                        <div key={field} className="mb-1">
                            <label htmlFor={field} className="block font-medium mb-1 capitalize">
                                {field}
                            </label>
                            <input
                                id={field}
                                name={field}
                                value={(newJudge as any)[field]}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded px-2 py-1 w-full"
                                required
                            />
                        </div>
                    ))}
                    {/* Court Name Dropdown */}
                    <div className="mb-1">
                        <label htmlFor="courtName" className="block font-medium mb-1">Court Name</label>
                        <select
                            id="courtName"
                            name="courtName"
                            value={newJudge.courtName}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded p-2 w-full"
                        >
                            <option value="Phuentsholing Court">Phuentsholing Court</option>
                            <option value="Thimphu">Thimphu Court</option>
                        </select>
                    </div>
                    <button onClick={handleSubmit} className="bg-primary-normal text-white px-2 py-2 rounded hover:scale-105 transition-transform duration-300">
                        {editingJudge ? "Save Changes" : "Add Judge"}
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JudgeTable;
