"use client";
import React from "react";
import { Bell } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import useFetch from "@/app/hooks/usefetchDashboard";

interface Reminder {
    id: number;
    title: string;
    date: string;
}

export default function ReminderSection() {
    const { data: reminders, error, loading, setData: setReminders } = useFetch<Reminder[]>(
        "http://localhost:3002/reminders",
        []
    );

    const handleDelete = (id: number) => {
        setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md space-y-4 mt-6 
        w-[308px] ml-[30px] h-[267px]
        sm:w-[485px] sm:ml-[20px] sm:mr-0  
        md:w-[700px] md:ml-[60px] md:mr-4  
        lg:w-[400px] lg:ml-[40px] lg:mr-4 lg:mt-10">


            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-red-500" />
                    <h2 className="font-heading font-semibold">Reminder</h2>
                </div>
            </div>

            {/* Reminder List */}
            <div className="min-h-[195px] max-h-[192px] overflow-y-auto space-y-3 w-full">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm font-medium">
                        Loading...
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500 text-sm font-medium">
                        {error}
                    </div>
                ) : reminders.length > 0 ? (
                    reminders.map((reminder) => (
                        <div
                            key={reminder.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-200 transition duration-200 ease-in-out"
                        >
                            <div className="flex items-center space-x-2">
                                <Checkbox id={`reminder-${reminder.id}`} onChange={() => handleDelete(reminder.id)} />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{reminder.title}</p>
                                    <p className="text-xs text-gray-500">{reminder.date}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm font-medium">
                        No Reminders
                    </div>
                )}
            </div>
        </div>
    );
}
