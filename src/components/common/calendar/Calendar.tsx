"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import toast, { Toaster } from "react-hot-toast";

const Calendar: React.FC = () => {
    const [currentEvents, setCurrentEvents] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] = useState<boolean>(false);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [eventDescription, setEventDescription] = useState<string>("");
    const [eventDate, setEventDate] = useState<string>("");
    const [eventStartTime, setEventStartTime] = useState<string>("");
    const [eventEndTime, setEventEndTime] = useState<string>("");
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [eventsPerPage] = useState<number>(5);

    // Load events from local storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedEvents = localStorage.getItem("events");
            if (savedEvents) {
                setCurrentEvents(JSON.parse(savedEvents));
            }
        }
    }, []);

    // Save events to local storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("events", JSON.stringify(currentEvents));
        }
    }, [currentEvents]);

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEventsPage = currentEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Handle date click (add new event)
    const handleDateClick = (selected: any) => {
        setEventDate(selected.startStr.split("T")[0]);
        setIsDialogOpen(true);
    };

    // Handle event click (view event details)
    const handleEventClick = (selected: any) => {
        setSelectedEvent(selected.event);
        setIsEventDetailsDialogOpen(true);
    };

    // Delete an event
    const handleDeleteEvent = () => {
        if (selectedEvent) {
            selectedEvent.remove();
            setCurrentEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== selectedEvent.id)
            );
            setIsEventDetailsDialogOpen(false);
            toast.success(`Event "${selectedEvent.title}" deleted successfully!`);
        }
    };

    // Close the add event dialog
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewEventTitle("");
        setEventDescription("");
        setEventDate("");
        setEventStartTime("");
        setEventEndTime("");
    };

    // Add a new event
    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();

        if (newEventTitle && eventDate && eventStartTime && eventEndTime) {
            const startDate = new Date(`${eventDate}T${eventStartTime}`);
            const endDate = new Date(`${eventDate}T${eventEndTime}`);

            const newEvent = {
                id: `${startDate.toISOString()}-${newEventTitle}`,
                title: newEventTitle,
                start: startDate,
                end: endDate,
                color: "#10B981", // Green color for events
                extendedProps: {
                    description: eventDescription,
                    done: false,
                },
            };

            setCurrentEvents((prevEvents) => [...prevEvents, newEvent]);
            handleCloseDialog();

            // Set a reminder (10 minutes before the event)
            const reminderTime = new Date(startDate.getTime() - 10 * 60 * 1000);
            const now = new Date();
            if (reminderTime > now) {
                setTimeout(() => {
                    toast.success(`Reminder: "${newEventTitle}" starts in 10 minutes!`);
                }, reminderTime.getTime() - now.getTime());
            }
        }
    };

    // Toggle event status (done/not done)
    const handleToggleDone = (eventId: string) => {
        setCurrentEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === eventId
                    ? { ...event, extendedProps: { ...event.extendedProps, done: !event.extendedProps?.done } }
                    : event
            )
        );
        toast.success("Event status updated!");
    };

    // Format date as dd/mm/yyyy
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Calculate duration in hours and minutes
    const calculateDuration = (start: Date, end: Date) => {
        const durationInMs = end.getTime() - start.getTime();
        const hours = Math.floor(durationInMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hrs ${minutes} mins`;
    };

    return (
        <div className="p-4">
            {/* Event List and Calendar */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Event List */}
                <div className="w-full lg:w-3/12">
                    <div className="py-6 text-2xl text-[#046200] font-extrabold px-4">
                        Calendar Events
                    </div>
                    <ul className="space-y-4 text-white">
                        {currentEvents.length <= 0 && (
                            <div className="italic text-center text-gray-400">
                                No Events Present
                            </div>
                        )}
                        {currentEvents.length > 0 &&
                            currentEvents.map((event: any) => (
                                <li
                                    className="border border-gray-200 shadow px-4 py-2 rounded-md bg-primary-normal"
                                    key={event.id}
                                >
                                    {event.title}
                                    <br />
                                    <label className="text-white">
                                        {formatDate(new Date(event.start))}{" "}
                                        <br />
                                        {new Date(event.start).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </label>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Calendar */}
                <div className="w-full lg:w-9/12 mt-8">
                    <FullCalendar
                        height={"auto"} // Responsive height
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        events={currentEvents}
                        eventColor="#046200"
                    />
                    <style>
                        {`
           .fc-today-button, .fc-prev-button, .fc-next-button, .fc-dayGridMonth-button, .fc-timeGridWeek-button, .fc-timeGridDay-button, .fc-listWeek-button {
             background-color: #046200 !important;
             border-color: #046200 !important;
             color: white !important;
           }
        `}
                    </style>
                </div>
            </div>

            {/* Add Event Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-[#046200]">Add New Event Details</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mb-4" onSubmit={handleAddEvent}>
                        <Input
                            type="text"
                            placeholder="Event Title"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            required
                        />
                        <Input
                            type="text"
                            placeholder="Event Description"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                        />
                        <Input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                        />
                        <div className="flex gap-4">
                            <Input
                                type="time"
                                value={eventStartTime}
                                onChange={(e) => setEventStartTime(e.target.value)}
                                required
                            />
                            <Input
                                type="time"
                                value={eventEndTime}
                                onChange={(e) => setEventEndTime(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="bg-primary-normal text-white" type="submit">
                            Add Event
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Event Details Dialog */}
            <Dialog open={isEventDetailsDialogOpen} onOpenChange={setIsEventDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-[#046200]">Event Details</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-4">
                            <p>
                                <strong className="text-[#046200]">Title:</strong> {selectedEvent.title}
                            </p>
                            <p>
                                <strong className="text-[#046200]">Description:</strong>{" "}
                                {selectedEvent.extendedProps.description || "-"}
                            </p>
                            <p>
                                <strong className="text-[#046200]">Date:</strong>{" "}
                                {formatDate(new Date(selectedEvent.start))}
                            </p>
                            <p>
                                <strong className="text-[#046200]">Start Time:</strong>{" "}
                                {new Date(selectedEvent.start).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                            <p>
                                <strong className="text-[#046200]">End Time:</strong>{" "}
                                {selectedEvent.end
                                    ? new Date(selectedEvent.end).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })
                                    : "-"}
                            </p>
                            <p>
                                <strong className="text-[#046200]">Duration:</strong>{" "}
                                {calculateDuration(
                                    new Date(selectedEvent.start),
                                    new Date(selectedEvent.end)
                                )}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleDeleteEvent}>
                            Delete
                        </Button>
                        <Button className="bg-primary-normal text-white" variant="outline" onClick={() => setIsEventDetailsDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Event Table */}
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Event List</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Activity</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentEventsPage.map((event) => {
                            const startDate = event.start ? new Date(event.start) : null;
                            const endDate = event.end ? new Date(event.end) : null;

                            let duration = "-";
                            if (startDate && endDate) {
                                duration = calculateDuration(startDate, endDate);
                            }

                            return (
                                <TableRow key={event.id}>
                                    <TableCell>{event.title}</TableCell>
                                    <TableCell>{duration}</TableCell>
                                    <TableCell>
                                        {startDate ? formatDate(startDate) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={event.extendedProps?.done || false}
                                            onChange={() => handleToggleDone(event.id)}
                                            className="checkbox"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </PaginationItem>
                        {Array.from({ length: Math.ceil(currentEvents.length / eventsPerPage) }).map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => paginate(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => currentPage < Math.ceil(currentEvents.length / eventsPerPage) && paginate(currentPage + 1)}
                                className={currentPage === Math.ceil(currentEvents.length / eventsPerPage) ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
};
export default Calendar;

