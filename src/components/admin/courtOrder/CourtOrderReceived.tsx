"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Documents } from "@/components/common/courtOrder/documentCourtOrder";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { Input } from "@/components/ui/input";

interface ReceivedOrder {
    id: number;
    message: string;
    order_type: string;
    created_at: string;
    court_sender: {
        name: string;
        court_type: string;
    };
    user_sender?: {
        first_name: string;
        last_name: string;
    };
    documents: {
        id: number;
        filename: string;
        url: string;
        content_type?: string;
        byte_size?: number;
        created_at?: string;
        verified?: boolean;
    }[];
}

export const CourtOrdersReceived = () => {
    const [orders, setOrders] = useState<ReceivedOrder[]>([]);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const token = useLoginStore((state) => state.token);

    useEffect(() => {
        const fetchReceivedOrders = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/v1/court_orders/received", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const json = await response.json();
                setOrders(json.data || []);
            } catch (error) {
                console.error("❌ Failed to fetch received court orders", error);
            }
        };

        if (token) fetchReceivedOrders();
    }, [token]);

    const filteredOrders = orders.filter((order) =>
        order.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="mt-6 border border-gray-300 rounded-md shadow-md">
            <div className="flex justify-between gap-4 px-4 pb-4">
                <h2 className="p-4 font-semibold text-gray-900 text-lg">
                    List of Court Orders Received
                </h2>
                <Input
                    placeholder="Search Message"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 mt-5"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SL.NO</TableHead>
                        <TableHead>Order Document</TableHead>
                        <TableHead>Order Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredOrders.map((order, index) => (
                        <TableRow key={order.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{order.documents?.[0]?.filename || "N/A"}</TableCell>
                            <TableCell>{order.order_type || "N/A"}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{order.court_sender?.name || "N/A"}</TableCell>
                            <TableCell>
                                <Dialog
                                    open={openDialogId === order.id}
                                    onOpenChange={(open) => setOpenDialogId(open ? order.id : null)}
                                >
                                    <DialogTrigger asChild>
                                        <button className="text-blue-700 hover:underline">View More</button>
                                    </DialogTrigger>
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
        </div>
    );
};
