"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast, { Toaster } from "react-hot-toast";
import { EventApi } from "@fullcalendar/core"; // ✅ Import for type

// Components
import EventList from "@/components/common/calendar/EventList";
import EventDialog from "@/components/common/calendar/EventDialog";
import EventDetailsDialog from "@/components/common/calendar/EventDetailsDialog";
import EventTable from "@/components/common/calendar/EventTable";

const Calendar: React.FC = () => {
    const [currentEvents, setCurrentEvents] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [caseId, setCaseId] = useState("");
    const [hearingType, setHearingType] = useState("Miscellaneous Hearing");
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [reschedulingEventId, setReschedulingEventId] = useState<string | null>(null);
    const [eventStart, setEventStart] = useState<Date | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 5;

    useEffect(() => {
        const savedEvents = localStorage.getItem("events");
        if (savedEvents) {
            setCurrentEvents(JSON.parse(savedEvents));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("events", JSON.stringify(currentEvents));
    }, [currentEvents]);

    const formatDate = (date: Date) =>
        `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    const handleDateClick = (selected: any) => {
        setEventStart(new Date(selected.startStr));
        setIsDialogOpen(true);
    };

    const handleEventClick = (selected: any) => {
        setSelectedEvent(selected.event);
        setIsEventDetailsDialogOpen(true);
    };

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventStart) return toast.error("Please select a start time");

        const newEvent = {
            id: reschedulingEventId || `${eventStart.toISOString()}`,
            title: eventDescription || "Untitled Event",
            start: eventStart,
            color: "#10B981",
            extendedProps: {
                description: eventDescription,
                caseId,
                hearingType,
                done: false,
            },
        };

        setCurrentEvents((prev) =>
            isRescheduling && reschedulingEventId
                ? prev.map((e) => (e.id === reschedulingEventId ? newEvent : e))
                : [...prev, newEvent]
        );

        toast.success(isRescheduling ? "Event rescheduled!" : "Event added!");
        handleCloseDialog();
    };

    const handleDeleteEvent = () => {
        if (selectedEvent) {
            selectedEvent.remove();
            setCurrentEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
            setIsEventDetailsDialogOpen(false);
            toast.success("Event deleted");
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewEventTitle("");
        setEventDescription("");
        setCaseId("");
        setHearingType("Miscellaneous Hearing");
        setEventStart(undefined);
        setIsRescheduling(false);
        setReschedulingEventId(null);
    };

    const handleToggleDone = (eventId: string) => {
        setCurrentEvents((prev) =>
            prev.map((event) =>
                event.id === eventId
                    ? { ...event, extendedProps: { ...event.extendedProps, done: !event.extendedProps.done } }
                    : event
            )
        );
    };

    return (
        <>
            <style>
                {`
          .fc .fc-button {
            background-color: #046200;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 0.45rem 1rem;
            font-weight: 500;
          }
          .fc .fc-button:hover {
            background-color: #034f00;
            cursor: pointer;
          }
          .fc .fc-button.fc-button-active {
            background-color: #034f00;
            color: white;
          }
          .fc .fc-toolbar-title {
            color: #046200;
            font-weight: 600;
          }
          .fc .fc-button:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          .fc .fc-daygrid-day-events {
            max-height: 80px;
            overflow-y: auto;
          }
        `}
            </style>

            <div className="bg-gray-100 min-h-screen p-6">
                <div className="bg-gray-100 border-[1.5px] border-[#046200] rounded-xl shadow-md p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-3/12">
                            <div className="bg-white border border-[#046200] shadow-md rounded-xl p-4 h-full">
                                <h2 className="text-xl font-semibold text-[#046200] mb-4">Calendar Events</h2>
                                <div className="overflow-y-auto max-h-[680px] pr-2">
                                    <EventList
                                        events={currentEvents}
                                        formatDate={formatDate}
                                        formatTime={formatTime}
                                        onReschedule={(event: EventApi) => {
                                            setIsDialogOpen(true);
                                            setIsRescheduling(true);
                                            setReschedulingEventId(event.id);
                                            setNewEventTitle(event.title);
                                            setEventDescription(event.extendedProps.description);
                                            setCaseId(event.extendedProps.caseId);
                                            setHearingType(event.extendedProps.hearingType);
                                            setEventStart(event.start ? new Date(event.start) : new Date());
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-9/12 mt-8">
                            <div className="bg-white rounded-lg shadow-md p-4 text-[#046200]">
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                                    }}
                                    initialView="dayGridMonth"
                                    selectable={true}
                                    select={handleDateClick}
                                    eventClick={handleEventClick}
                                    events={currentEvents}
                                    eventColor="#046200"
                                    height="auto"
                                    dayMaxEventRows={3}
                                    dayMaxEvents={true}
                                />
                            </div>
                        </div>
                    </div>

                    <EventDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        isRescheduling={isRescheduling}
                        newEventTitle={newEventTitle}
                        setNewEventTitle={setNewEventTitle}
                        caseId={caseId}
                        setCaseId={setCaseId}
                        hearingType={hearingType}
                        setHearingType={setHearingType}
                        eventDescription={eventDescription}
                        setEventDescription={setEventDescription}
                        eventStart={eventStart}
                        setEventStart={setEventStart}
                        onSubmit={handleAddEvent}
                    />

                    <EventDetailsDialog
                        open={isEventDetailsDialogOpen}
                        onOpenChange={setIsEventDetailsDialogOpen}
                        selectedEvent={selectedEvent}
                        onDelete={handleDeleteEvent}
                        onReschedule={() => {
                            setIsDialogOpen(true);
                            setIsRescheduling(true);
                            setReschedulingEventId(selectedEvent.id);
                            setNewEventTitle(selectedEvent.title);
                            setEventDescription(selectedEvent.extendedProps.description);
                            setCaseId(selectedEvent.extendedProps.caseId);
                            setHearingType(selectedEvent.extendedProps.hearingType);
                            setEventStart(selectedEvent.start ? new Date(selectedEvent.start) : new Date());
                            setIsEventDetailsDialogOpen(false);
                        }}
                    />

                    <div className="bg-white rounded-lg shadow-md mt-10 p-4">
                        <EventTable
                            events={currentEvents}
                            currentPage={currentPage}
                            eventsPerPage={eventsPerPage}
                            paginate={setCurrentPage}
                        />
                    </div>

                    <Toaster />
                </div>
            </div>
        </>
    );
};

export default Calendar;