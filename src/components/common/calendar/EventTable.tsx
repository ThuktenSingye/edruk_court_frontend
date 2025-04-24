"use client";

import React, { useEffect, useState } from "react";
import {
    Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationPrevious, PaginationNext,
} from "@/components/ui/pagination";
import { useLoginStore } from "@/app/hooks/useLoginStore";

const EventTable: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;

    useEffect(() => {
        const fetchEvents = async () => {
            let token = useLoginStore.getState().token;
            if (!token) token = localStorage.getItem("token");

            console.log("🪪 Token used for /list:", token);

            if (!token) {
                console.warn("❌ [EventTable] No token found. Skipping fetch.");
                return;
            }

            try {
                const response = await fetch("http://nganglam.lvh.me:3001/api/v1/hearing_schedules/list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                console.log("📦 [EventTable] API /list response:", JSON.stringify(json.data, null, 2));
                console.log("✅ [EventTable] Total hearings fetched:", json.data?.length ?? 0);

                if (json?.status === "ok" && Array.isArray(json.data)) {
                    setEvents(json.data);
                }
            } catch (err) {
                console.error("❌ [EventTable] Error fetching hearings:", err);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter((event) =>
        filterStatus ? event.schedule_status === filterStatus : true
    );

    const indexOfLast = currentPage * eventsPerPage;
    const indexOfFirst = indexOfLast - eventsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold text-primary-normal">All Hearings</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1); // Reset pagination on filter change
                        }}
                        className="border rounded px-3 py-2 w-[160px]"
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Changes_requested">Changes Requested</option>
                    </select>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-[#046200] text-white">
                        <TableHead className="text-white">Case Number</TableHead>
                        <TableHead className="text-white">Case Title</TableHead>
                        <TableHead className="text-white">Hearing Type</TableHead>
                        <TableHead className="text-white">Scheduled By</TableHead>
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Time</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentEvents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-gray-500">No events found</TableCell>
                        </TableRow>
                    ) : (
                        currentEvents.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.case_number}</TableCell>
                                <TableCell>{event.case_title}</TableCell>
                                <TableCell>{event.hearing_type_name}</TableCell>
                                <TableCell>
                                    {event.scheduled_by
                                        ? `${event.scheduled_by.first_name} ${event.scheduled_by.last_name}`
                                        : "N/A"}
                                </TableCell>
                                <TableCell>{new Date(event.scheduled_date).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(event.scheduled_date).toLocaleTimeString()}</TableCell>
                                <TableCell>
                                    <span className={`font-medium ${event.schedule_status === "Pending" ? "text-[#AC3030]"
                                            : event.schedule_status === "Approved" ? "text-[#046200]"
                                                : event.schedule_status === "Rescheduled" || event.schedule_status === "Changes_requested" ? "text-blue-600"
                                                    : event.schedule_status === "Cancelled" ? "text-[#AC3030]"
                                                        : "text-gray-600"
                                        }`}>
                                        {event.schedule_status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <PaginationItem key={idx}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(idx + 1)}
                                    isActive={currentPage === idx + 1}
                                >
                                    {idx + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default EventTable;


