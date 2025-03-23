"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SendToModal } from "@/components/common/courtOrder/SendToModal";
import { Pagination } from "@/components/common/pagination";
import FileUploader from "@/components/common/courtOrder/fileUploader";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type CourtOrder = {
    id: string;
    document: string;
    date: string;
    courtId: string;
    status: string;
};

export const CourtOrder = () => {
    const [courtOrders, setCourtOrders] = useState<CourtOrder[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(9);

    useEffect(() => {
        fetch("http://localhost:3000/courtOrders")
            .then((res) => res.json())
            .then((data) => setCourtOrders(data))
            .catch((error) => console.error("Error fetching court orders:", error));
    }, []);

    // ✅ Handle sending files to court
    const handleSendToCourt = async (data: { court: string; user: string }) => {
        setSelectedCourt(data.court);
        setSelectedUser(data.user);

        if (pendingFiles.length === 0) return; // No files to send

        const newOrders = pendingFiles.map((file) => ({
            id: Math.random().toString(36).substring(2, 6),
            document: file.name,
            date: new Date().toISOString().split("T")[0],
            courtId: data.court,
            status: "Pending",
        }));

        try {
            const promises = newOrders.map((order) =>
                fetch("http://localhost:3000/courtOrders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(order),
                })
            );

            await Promise.all(promises);
            setCourtOrders((prev) => [...prev, ...newOrders]);
            setPendingFiles([]); // Clear pending files
            setModalOpen(false); // Close modal
        } catch (error) {
            console.error("Error sending court orders:", error);
        }
    };

    // ✅ Handle file uploads (Drag & Drop + Manual Upload)
    const handleFilesUploaded = (files: File[]) => {
        setPendingFiles((prev) => [...prev, ...files]);
    };

    const filteredOrders = courtOrders.filter((order) =>
        order.document.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div style={{ fontFamily: "Poppins" }}>
            <p className="text-black text-lg">Court Order</p>

            <div className="w-full bg-white border border-gray-300 shadow-lg rounded-lg p-6 text-green-600">
                <div className="flex items-center justify-between">
                    <p className="text-black text-lg">Attach File</p>
                    <SendToModal
                        open={modalOpen}
                        onOpenChange={setModalOpen}
                        onSend={handleSendToCourt} // ✅ Fixed the missing function
                    />
                </div>

                {/* ✅ File Uploader Component (Drag & Drop + Upload Manually) */}
                <FileUploader onFilesUploaded={handleFilesUploaded} />

                {/* ✅ Pending Files List */}
                <div className="mt-4">
                    <p className="text-black font-semibold">Pending Files:</p>
                    {pendingFiles.length > 0 ? (
                        <ul className="list-disc ml-5">
                            {pendingFiles.map((file, index) => (
                                <li key={index} className="text-gray-700 flex items-center justify-between">
                                    <span>{file.name}</span>
                                    <button
                                        className="ml-4 text-red-600 hover:underline"
                                        onClick={() => setPendingFiles((prev) => prev.filter((_, i) => i !== index))}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No files uploaded.</p>
                    )}
                </div>

                {/* ✅ Court Orders Table */}
                <div className="mt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white shadow-md">
                        <h2 className="font-semibold text-gray-900 text-lg">List of Court Orders Sent</h2>
                        <Input
                            placeholder="Search Document Name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64"
                        />
                    </div>

                    <Table>
                        <TableHeader className="bg-primary-normal text-white">
                            <TableRow>
                                <TableHead>SL.NO</TableHead>
                                <TableHead>Order Document</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Court ID</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOrders.map((order, index) => (
                                <TableRow key={order.id} className="hover:bg-gray-100 text-black">
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>{order.document}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.courtId}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination
                        totalItems={filteredOrders.length}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};
