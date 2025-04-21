"use client";

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

import CalendarEventSidebar from "@/components/common/calendar/CalendarEventSidebar";
import EventDialog from "@/components/common/calendar/EventDialog";
import EventDetailsDialog from "@/components/common/calendar/EventDetailsDialog";
import EventTable from "@/components/common/calendar/EventTable";
import { useLoginStore } from "@/app/hooks/useLoginStore";

const Calendar: React.FC = () => {
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
    const [currentEvents, setCurrentEvents] = useState<any[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const eventsPerPage = 5;

    const handleDateClick = (selected: any) => {
        if (isPosting) return;
        setEventStart(new Date(selected.startStr));
        setIsDialogOpen(true);
    };

    const handleEventClick = (selected: any) => {
        if (isPosting) return;
        setSelectedEvent(selected.event);
        setIsEventDetailsDialogOpen(true);
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isPosting) return;

        if (!eventStart) {
            toast.error("Please select a start time");
            return;
        }

        const token = useLoginStore.getState().token;
        const userId = useLoginStore.getState().userId;

        if (!token || !userId) {
            toast.error("User not authenticated");
            return;
        }

        const hearing_type_id = hearingType === "Miscellaneous Hearing" ? 1 : 2;

        const payload = {
            hearing_status: "pending",
            hearing_type_id,
            case_id: parseInt(caseId),
            hearing_schedules_attributes: [
                {
                    scheduled_date: eventStart.toISOString(),
                    schedule_status: "pending",
                    scheduled_by_id: parseInt(userId),
                },
            ],
        };

        setIsPosting(true);

        const host = window.location.hostname;

        try {
            await axios.post(
                `http://${host}/api/v1/cases/${caseId}/hearings`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success("Hearing scheduled successfully");

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
                    status: isRescheduling ? "Rescheduled" : "Pending",
                },
            };

            setCurrentEvents((prev) => {
                if (isRescheduling && reschedulingEventId) {
                    return prev.map((e) => (e.id === reschedulingEventId ? newEvent : e));
                }
                return [...prev, newEvent];
            });

            handleCloseDialog();
        } catch (error) {
            console.error("POST failed:", error);
            toast.error("Failed to schedule hearing");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteEvent = () => {
        if (isPosting) return;
        if (selectedEvent) {
            setCurrentEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
            setIsEventDetailsDialogOpen(false);
            toast.success("Hearing cancelled");
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

    return (
        <>
            <Toaster />

            {/* Loading Overlay */}
            {isPosting && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <motion.div
                        className="bg-white/90 p-4 rounded-full shadow-xl border-4 border-[#046200]"
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear"
                        }}
                    >
                        <Image
                            src="/logo.png"
                            alt="Loading"
                            width={80}
                            height={80}
                            className="rounded-full"
                            priority
                        />
                    </motion.div>
                </div>
            )}

            {/* Main Calendar Content */}
            <div className={`bg-gray-100 min-h-screen p-6 ${isPosting ? 'pointer-events-none' : ''}`}>
                <div className={`bg-white rounded-xl shadow-md p-6 ${isPosting ? 'opacity-90' : ''}`}>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-3/12">
                            <CalendarEventSidebar />
                        </div>
                        <div className="w-full lg:w-9/12">
                            <div className="bg-white rounded-lg p-4 h-[70vh] overflow-hidden">
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title",
                                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                                    }}
                                    initialView="dayGridMonth"
                                    selectable={!isPosting}
                                    select={handleDateClick}
                                    eventClick={handleEventClick}
                                    events={currentEvents}
                                    eventContent={(eventInfo) => (
                                        <div className="flex items-center">
                                            <span className="inline-block w-2 h-2 rounded-full bg-[#046200] mr-1"></span>
                                            <span className="truncate">{eventInfo.timeText} {eventInfo.event.title}</span>
                                        </div>
                                    )}
                                    height="100%"
                                    dayMaxEvents={false}
                                    dayMaxEventRows={true}
                                    dayCellClassNames="overflow-hidden"
                                    dayCellContent={(args) => {
                                        args.dayNumberText = args.dayNumberText.replace(/^0/, '');
                                        return { html: args.dayNumberText };
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <EventDialog
                        open={isDialogOpen}
                        onOpenChange={isPosting ? undefined : setIsDialogOpen}
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
                        onOpenChange={isPosting ? undefined : setIsEventDetailsDialogOpen}
                        selectedEvent={selectedEvent}
                        onDelete={handleDeleteEvent}
                        onReschedule={isPosting ? undefined : () => {
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

                    <div className="bg-white rounded-lg shadow-md mt-6 p-4">
                        <EventTable
                            events={currentEvents}
                            currentPage={currentPage}
                            eventsPerPage={eventsPerPage}
                            paginate={setCurrentPage}
                        />
                    </div>
                </div>
            </div>

            <style jsx global>{`
        /* Custom scrollbar for calendar */
        .fc-scroller {
          overflow-y: auto !important;
          scrollbar-width: thin;
          
        }
        
        .fc-scroller::-webkit-scrollbar {
          width: 6px;
        }
        
        .fc-scroller::-webkit-scrollbar-thumb {
          background: #046200;
          border-radius: 3px;
        }
        
        /* Event container scrolling */
        .fc-daygrid-day-events {
          max-height: 120px;
          overflow-y: auto;
        }
        
        /* Cell styling */
        .fc-daygrid-day-frame {
          min-height: 100px;
        }
        
        /* Event text truncation */
        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }
      `}</style>
        </>
    );
};

export default Calendar;