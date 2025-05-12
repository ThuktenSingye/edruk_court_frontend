"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { SendToModal } from "@/components/common/courtOrder/SendToModal";
import FileUploader from "@/components/common/courtOrder/fileUploader";
import { CourtOrdersReceived } from "@/components/common/courtOrder/CourtOrderReceived";
import { Pagination } from "@/components/common/pagination";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Documents } from "@/components/common/courtOrder/documentCourtOrder";
import { toast } from "react-hot-toast";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface DocumentFile {
    fileName: string;
    fileDate: string;
    fileUrl: string;
    verified: boolean | null;
}

type CourtOrder = {
    id: string;
    message: string;
    order_type: string;
    created_at: string;
    documents: {
        id: number;
        filename: string;
        url: string;
        created_at?: string;
        verified?: boolean;
    }[];
    user_sender?: {
        first_name: string;
        last_name: string;
    };
};



export const CourtOrder = () => {
    const [courtOrders, setCourtOrders] = useState<CourtOrder[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(9);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    const token = useLoginStore((state) => state.token);

    useEffect(() => {
        const fetchSentCourtOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/v1/court_orders/sent", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data?.data || [];
                console.log("✅ Sent Court Orders:", data);
                setCourtOrders(data);
            } catch (error) {
                console.error("❌ Failed to fetch sent court orders", error);
                toast.error("Could not load sent court orders");
            }
        };

        if (token) fetchSentCourtOrders();
    }, [token]);

    const handleSendToCourt = async (data: {
        court?: string;
        user?: string;
        message: string;
        orderType: string;
    }) => {
        if (pendingFiles.length === 0) {
            toast.error("No files uploaded");
            console.log("❌ No files uploaded");
            return;
        }

        const formData = new FormData();
        formData.append("court_order[message]", data.message);
        formData.append("court_order[order_type]", data.orderType);

        if (data.court) {
            formData.append("court_order[order_recipient_courts_attributes][0][court_id]", data.court);
        }

        if (data.user) {
            formData.append("court_order[order_recipient_users_attributes][0][user_id]", data.user);
        }

        pendingFiles.forEach((file) => {
            formData.append("court_order[documents][]", file);
        });

        console.log("📤 FormData to be sent:");
        for (let [key, val] of formData.entries()) {
            console.log(`${key}:`, val instanceof File ? val.name : val);
        }

        try {
            const response = await fetch("http://nganglam.lvh.me:3001/api/v1/court_orders", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to send court order");

            const result = await response.json();
            console.log("✅ Court Order Sent:", result);
            toast.success("Court order sent successfully");

            setCourtOrders((prev) => [...prev, result]);
            setPendingFiles([]);
            setModalOpen(false);
        } catch (error) {
            console.error("❌ Error sending court order:", error);
            toast.error("Failed to send court order");
        }
    };

    const handleFilesUploaded = (files: File[]) => {
        console.log("📥 Files received from uploader:", files);
        setPendingFiles((prev) => [...prev, ...files]);
    };

    const filteredOrders = courtOrders.filter((order) =>
        order.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div style={{ fontFamily: "Poppins" }}>
            <p className="text-black font-semibold">Court Order</p>

            <div className="w-full bg-white border border-gray-300 shadow-lg rounded-lg p-6 text-green-600">
                <div className="flex items-center justify-between">
                    <p className="text-black font-semibold">Attach File</p>
                    <SendToModal open={modalOpen} onOpenChange={setModalOpen} onSend={handleSendToCourt} />
                </div>

                <FileUploader onFilesUploaded={handleFilesUploaded} />

                <div className="mt-4">
                    <p className="text-black font-semibold">Pending Files:</p>
                    {pendingFiles.length > 0 ? (
                        <ul className="list-disc ml-5">
                            {pendingFiles.map((file, index) => (
                                <li key={`${file.name}-${index}`} className="text-gray-700 flex items-center justify-between">
                                    <span>{file.name}</span>
                                    <button
                                        className="ml-4 text-red-600 hover:underline"
                                        onClick={() =>
                                            setPendingFiles((prev) => prev.filter((_, i) => i !== index))
                                        }
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

                <div className="mt-6 border border-gray-300 rounded-md shadow-md">
                    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white">
                        <h2 className="font-semibold text-gray-900 text-lg">List of Court Orders Sent</h2>
                        <Input
                            placeholder="Search Message"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64"
                        />
                    </div>

                    {/* <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SL.NO</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Order Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <TableRow key={`order-${order.id}-${index}`} className="hover:bg-gray-100 transition">
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{order.message}</TableCell>
                  <TableCell>{order.orderType}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDialogId === order.id}
                      onOpenChange={(open) => setOpenDialogId(open ? order.id : null)}
                    >
                      <DialogTrigger asChild>
                        <button className="text-blue-700 hover:underline">View More</button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                        <Documents documents={order.files || []} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>  */}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SL.NO</TableHead>
                                <TableHead>Order Document</TableHead>
                                <TableHead>Order Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOrders.map((order, index) => (
                                <TableRow key={`order-${order.id}-${index}`} className="hover:bg-gray-100 transition">
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>{order.documents?.[0]?.filename || "N/A"}</TableCell>
                                    <TableCell>{order.order_type || "N/A"}</TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Dialog
                                            open={openDialogId === order.id}
                                            onOpenChange={(open) => setOpenDialogId(open ? order.id : null)}
                                        >
                                            <DialogTrigger asChild>
                                                <button className="text-blue-700 hover:underline">View More</button>
                                            </DialogTrigger>
                                            {/* <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <div className="space-y-4 text-sm">
                <p><strong>Message:</strong> {order.message}</p>
                <p><strong>Sender:</strong> {order.user_sender?.first_name} {order.user_sender?.last_name}</p>
                <div>
                  <strong>Documents:</strong>
                  <ul className="list-disc ml-6">
                    {order.documents?.map((doc) => (
                      <li key={doc.id}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {doc.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </DialogContent> */}


                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto space-y-6">
                                                <div className="text-sm space-y-1">
                                                    <p><strong>Message:</strong> {order.message}</p>
                                                    <p><strong>Sender:</strong> {order.user_sender?.first_name} {order.user_sender?.last_name}</p>
                                                </div>

                                                <Documents
                                                    documents={
                                                        order.documents?.map((doc) => ({
                                                            fileName: doc.filename,
                                                            fileDate: doc.created_at ?? "",
                                                            fileUrl: doc.url,
                                                            verified: doc.verified ?? null,
                                                        })) || []
                                                    }
                                                />
                                            </DialogContent>


                                        </Dialog>
                                    </TableCell>
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

                <div className="mt-6">
                    <CourtOrdersReceived />
                </div>
            </div>
        </div>
    );
};
