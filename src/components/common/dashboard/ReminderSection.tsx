"use client";
import React, { Suspense, useEffect } from "react";
import { Bell } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ReminderSectionSkeleton } from "./ReminderSectionSkeleton";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import axios from "axios";

interface Reminder {
    id: number;
    case_number: string;
    hearing_type_name: string;
    scheduled_date: string;
    case_title: string;
}

export default function ReminderSection() {
    const [reminders, setReminders] = React.useState<Reminder[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                setLoading(true);
                console.log("Fetching reminders with token:", token);

                const host = window.location.hostname;

                const response = await axios.get(
                    `http://${host}:3001/api/v1/hearing_schedules/reminders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("Raw API Response:", response.data);
                console.log("Response type:", typeof response.data);
                console.log("Is array?", Array.isArray(response.data));

                let dataToProcess = response.data;

                if (typeof dataToProcess === 'object' && !Array.isArray(dataToProcess)) {
                    if (dataToProcess.data && Array.isArray(dataToProcess.data)) {
                        dataToProcess = dataToProcess.data;
                    } else if (dataToProcess.reminders && Array.isArray(dataToProcess.reminders)) {
                        dataToProcess = dataToProcess.reminders;
                    } else if (dataToProcess.results && Array.isArray(dataToProcess.results)) {
                        dataToProcess = dataToProcess.results;
                    }
                }

                if (typeof dataToProcess === 'object' && !Array.isArray(dataToProcess)) {
                    dataToProcess = [dataToProcess];
                }

                if (!Array.isArray(dataToProcess)) {
                    console.error("Could not convert response to array. Final data:", dataToProcess);
                    setError("Could not process server response");
                    return;
                }

                const transformedData = dataToProcess
                    .filter((item: any) => item && typeof item === 'object')
                    .map((item: any) => {
                        console.log("Processing item:", item);
                        return {
                            id: item.Id || item.id || 0,
                            case_number: item["case number"] || item.case_number || "N/A",
                            case_title: item.case_title || "N/A",
                            hearing_type_name: item.hearing_type_name || "N/A",
                            scheduled_date: item["scheduled date"] || item.scheduled_date || new Date().toISOString(),
                        };
                    });

                console.log("Transformed data:", transformedData);

                if (transformedData.length === 0) {
                    console.log("No valid reminders found in response");
                }

                setReminders(transformedData);
                setError(null);
            } catch (err: any) {
                console.error("Detailed error:", {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    headers: err.response?.headers
                });

                if (err.response) {
                    setError(`Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
                } else if (err.request) {
                    setError("No response from server. Please check your connection.");
                } else {
                    setError(`Error: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchReminders();
        } else {
            setError("No authentication token found. Please log in.");
            setLoading(false);
        }
    }, [token]);

    if (loading) return <ReminderSectionSkeleton />;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

    const handleDelete = (id: number) => {
        setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
    };

    return (
        <Suspense fallback={<ReminderSectionSkeleton />}>
            <div className="p-4 bg-white rounded-lg shadow-md space-y-4 mt-6 
        w-[308px] ml-[30px] h-[267px]
        sm:w-[485px] sm:ml-[20px] sm:mr-0  
        md:w-[700px] md:ml-[60px] md:mr-4  
        lg:w-[400px] lg:ml-[40px] lg:mr-4 lg:mt-10">

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
                                        <p className="text-sm font-medium text-black-700">Case No: {reminder.case_number}</p>
                                        <p className="text-xs text-gray-500">Case_Name: {reminder.case_title}</p>
                                        <p className="text-xs text-gray-500">Hearing Type: {reminder.hearing_type_name}</p>
                                        <p className="text-xs text-gray-500">
                                            Scheduled: {new Date(reminder.scheduled_date).toLocaleDateString()}
                                        </p>
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
        </Suspense>
    );
}
