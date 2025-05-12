/** @format */

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import dayjs from "dayjs";

const CalendarEventSidebar: React.FC = () => {
  const token = useLoginStore((state) => state.token);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const host = window.location.hostname;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://${host}:3001/api/v1/hearing_schedules/today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        const dataArray = response.data?.data ?? [];
        if (Array.isArray(dataArray)) {
          setEvents(dataArray);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("[Sidebar] API error:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  return (
    <div className="h-full max-h-[600px] overflow-y-auto border rounded-xl p-4 shadow-md bg-white flex flex-col">
      <h2 className="text-lg font-semibold mb-3 text-green-900">
        Hearing Schedule
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-500">
          No hearings scheduled for today.
        </p>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-[#046200] rounded-lg shadow-md p-4 flex flex-col justify-between relative transition-transform duration-200 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-[#12B76A]">
              <span className="flex w-full justify-between">
                <p className="  text-md font-medium text-green-800 ">
                  {event.hearing_type_name} hearing
                </p>
                <p className="text-sm text-green-800">#{event.case_number}</p>
              </span>
              <p className="text-sm text-gray-600 pt-2">
                {event.case_title || "Untitled Case"}
              </p>
              <span>
                <p className="text-sm text-gray-600 pt-1">
                  {dayjs(event.scheduled_date).format("DD/MM/YYYY")} at{" "}
                  {dayjs(event.scheduled_date).format("hh:mm A")}
                </p>

                <p
                  className={`text-sm pt-1 font-medium ${
                    event.schedule_status === "pending" ||
                    event.schedule_status === "Cancelled"
                      ? "text-[#AC3030]" // red
                      : event.schedule_status === "Approved"
                      ? "text-[#046200]" // green
                      : event.schedule_status === "Changes_requested" ||
                        event.schedule_status === "Rescheduled"
                      ? "text-blue-600" // blue
                      : "text-gray-600"
                  }`}>
                  Status: {event.schedule_status}
                </p>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarEventSidebar;
