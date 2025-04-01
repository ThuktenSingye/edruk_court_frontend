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
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Documents } from "@/components/common/courtOrder/documentCourtOrder";

const courtNameMap: Record<string, string> = {
    court1: "Phuntsholing Court",
    court2: "Nganglam Dungkhag",
    Court_1: "Thimphu District Court",
};

type CourtOrder = {
    id: string;
    document: string;
    date: string;
    courtId: string;
    receiverId: string;
};

export const CourtOrdersReceived = () => {
    const [orders, setOrders] = useState<CourtOrder[]>([]);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);

    useEffect(() => {
        // ✅ Inject dummy data
        const dummyOrders: CourtOrder[] = [
            {
                id: "demo-001",
                document: "CourtOrder_Demo1.pdf",
                date: "2025-04-01",
                courtId: "court1",
                receiverId: "admin",
            },
            {
                id: "demo-002",
                document: "Summon_Demo2.pdf",
                date: "2025-03-30",
                courtId: "Court_1",
                receiverId: "admin",
            },
        ];

        // ✅ Simulate current user: admin
        const currentUserId = "admin";

        const received = dummyOrders.filter((order) => order.receiverId === currentUserId);
        setOrders(received);
    }, []);

    return (
        <div className="mt-10 border border-gray-300 rounded-md p-4 shadow-md font-poppins">
            <h2 className="text-lg font-semibold text-black mb-4">
                List of Court Orders Received
            </h2>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SL.NO</TableHead>
                        <TableHead>Order Document</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <TableRow key={order.id} className="text-textPrimary">
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{order.document}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{courtNameMap[order.courtId] || order.courtId}</TableCell>
                                <TableCell>
                                    <Dialog
                                        open={openDialogId === order.id}
                                        onOpenChange={(open) => setOpenDialogId(open ? order.id : null)}
                                    >
                                        <DialogTrigger asChild>
                                            <button className="text-primary-normal">
                                                View More
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                                            <Documents />
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500">
                                No court orders received.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
