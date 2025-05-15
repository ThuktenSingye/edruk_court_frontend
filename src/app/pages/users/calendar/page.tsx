/** @format */

"use client";

import React, { useState, useEffect, use } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

import CalendarEventSidebar from "@/components/common/calendar/CalendarEventSidebar";
import EventDialog from "@/components/common/calendar/EventDialog";
import EventDetailsDialog from "@/components/common/calendar/EventDetailsDialog";
import EventTable from "@/components/common/calendar/EventTable";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import NewSchedule from "@/components/common/calendar/NewSchedule";

const Calendar: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] =
    useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [caseId, setCaseId] = useState("");
  const [hearingType, setHearingType] = useState("Miscellaneous Hearing");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventStart, setEventStart] = useState<Date | undefined>();
  const [currentEvents, setCurrentEvents] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<string>("");
  const userRole = useLoginStore.getState().userRole;

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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
    setEventDescription("");
    setCaseId("");
    setHearingType("Miscellaneous Hearing");
    setEventStart(undefined);
  };

  useEffect(() => {
    const fetchMonthlyEvents = async () => {
      const token = useLoginStore.getState().token;
      if (!token) {
        console.warn("❌ No token found. Skipping fetch.");
        return;
      }

      const host = window.location.hostname;
      try {
        const response = await axios.get(
          `http://${host}:3001/api/v1/hearing_schedules/month${
            calendarMonth ? `?month=${calendarMonth}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data?.data || [];
        console.log("API RSPON CALDNER", data)
        const formatted = data.map((item: any) => ({
          id: item.id,
          title: item.case_title,
          start: item.scheduled_date,
          color: "#10B981",
          extendedProps: {
            description: item.case_title,
            caseNumber: item.case_number,
            hearingType: item.hearing_type_name,
            scheduledBy: `${item.scheduled_by?.first_name} ${item.scheduled_by?.last_name}`,
            status: item.schedule_status,
            scheduledDate: item.scheduled_date,
          },
        }));

        setCurrentEvents(formatted);
      } catch (err) {
        console.error("❌ Error fetching monthly events:", err);
      }
    };

    fetchMonthlyEvents();
  }, [calendarMonth]);

  return (
    <>
      <Toaster />

      {isPosting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <motion.div
            className="bg-white/90 p-4 rounded-full shadow-xl border-4 border-[#046200]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
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

      <div
        className={`min-h-screen ${
          isPosting ? "pointer-events-none" : ""
        }`}>
        <div
          className={` ${
            isPosting ? "opacity-90" : ""
          }`}>
          {userRole == "Judge" && (
              <div className='mb-10'>
                <NewSchedule />
              </div>
          )}

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
                  datesSet={(arg) => {
                    const year = arg.view.currentStart.getFullYear();
                    const month = String(
                      arg.view.currentStart.getMonth() + 1
                    ).padStart(2, "0");
                    setCalendarMonth(`${year}-${month}`);
                  }}
                  eventContent={(eventInfo) => (
                    <div className="flex flex-col text-xs">
                      <span className="text-green-800 font-semibold">
                        {eventInfo.timeText}
                      </span>
                      <span className="truncate text-gray-700">
                        {eventInfo.event.title}
                      </span>
                    </div>
                  )}
                  height="100%"
                  dayMaxEvents={false}
                  dayMaxEventRows={true}
                  dayCellClassNames="overflow-hidden"
                  dayCellContent={(args) => {
                    args.dayNumberText = args.dayNumberText.replace(/^0/, "");
                    return { html: args.dayNumberText };
                  }}
                />
              </div>
            </div>
          </div>

          <EventDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            isRescheduling={false}
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
            onSubmit={() => {}}
          />

          <EventDetailsDialog
            open={isEventDetailsDialogOpen}
            onOpenChange={setIsEventDetailsDialogOpen}
            selectedEvent={selectedEvent}
            onDelete={() => {}}
            onReschedule={() => {}}
          />

          <div className="bg-white rounded-lg shadow-md mt-6 p-4">
            <EventTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
