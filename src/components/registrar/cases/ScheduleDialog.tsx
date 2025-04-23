"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import toast from "react-hot-toast";
import { DateTimePicker } from "@/components/common/calendar/date-time-picker";
import { motion } from "framer-motion";
import Image from "next/image";

interface ScheduleHearingDialogProps {
    caseId: string;
    caseNumber: string;
    onClose: () => void;
    onScheduleSuccess: (newEvent: any) => void;
    benches: any[];
    hearingTypes: { id: number; name: string }[];
}

const ScheduleHearingDialog: React.FC<ScheduleHearingDialogProps> = ({
    caseId,
    caseNumber,
    onClose,
    hearingTypes,
    benches,
    onScheduleSuccess,
}) => {
    const [hearingType, setHearingType] = useState("Miscellaneous Hearing");
    const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedBench, setSelectedBench] = useState<string | number>("");
    const [selectedHearingTypeId, setSelectedHearingTypeId] = useState<number | null>(null);

    const handleSchedule = async () => {
        if (!scheduledDateTime) {
            toast.error("Please select a date and time", {
                position: "top-center",
                style: {
                    background: '#FFEBEE',
                    color: '#B71C1C',
                    fontWeight: '500'
                }
            });
            return;
        }

        const token = useLoginStore.getState().token;
        const userId = useLoginStore.getState().userId;

        if (!token || !userId) {
            toast.error("Please log in to schedule a hearing", {
                position: "top-center",
                style: {
                    background: '#FFEBEE',
                    color: '#B71C1C',
                    fontWeight: '500'
                }
            });
            return;
        }

        const payload = {
            hearing: {
                hearing_status: "pending",
                hearing_type_id: selectedHearingTypeId,
                hearing_schedules_attributes: [
                    {
                        scheduled_date: scheduledDateTime.toISOString(),
                        schedule_status: "pending"
                    },
                ],
            },
        };

        setIsSubmitting(true);



        try {

            const host = window.location.hostname;

            const response = await axios.post(
                `http://${host}:3001/api/v1/cases/${caseId}/hearings`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                setIsSuccess(true);
                toast.success("Hearing scheduled successfully!", {
                    position: "top-center",
                    duration: 3000,
                    style: {
                        background: '#E8F5E9',
                        color: '#1B5E20',
                        fontWeight: '500'
                    }
                });

                const newEvent = {
                    id: response.data.id || scheduledDateTime.toISOString(),
                    title: `Hearing for ${caseNumber}`,
                    start: scheduledDateTime,
                    color: "#10B981",
                    extendedProps: {
                        description: `Hearing for case ${caseNumber}`,
                        caseId,
                        hearingType,
                        status: "Scheduled",
                    },
                };

                onScheduleSuccess(newEvent);

                // Auto-close after 3 seconds
                setTimeout(() => {
                    onClose();
                }, 3000);
            }
        } catch (error: any) {
            console.error("Full error:", error);

            let errorMessage = "Failed to schedule hearing";

            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Session expired. Please log in again.";
                } else if (error.response.data?.errors) {
                    errorMessage = Object.entries(error.response.data.errors)
                        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                        .join('\n');
                } else if (error.response.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                errorMessage = "No response from server. Please try again.";
            }

            toast.error(errorMessage, {
                position: "top-center",
                duration: 5000,
                style: {
                    background: '#FFEBEE',
                    color: '#B71C1C',
                    fontWeight: '500'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Loading Spinner */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <motion.div
                        className="bg-white/90 p-3 rounded-full shadow-lg border-2 border-[#046200]"
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

            {/* Dialog Content */}
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className={`bg-white p-6 rounded-lg w-full max-w-md mx-4 border-2 border-green-100 shadow-2xl ${isSubmitting ? 'pointer-events-none' : ''}`}>
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="text-green-600 text-2xl font-semibold mb-4">
                                Hearing Scheduled Successfully!
                            </div>
                            <div className="text-gray-600 mb-6">
                                The hearing has been added to the calendar.
                            </div>
                            <Button
                                onClick={onClose}
                                className="bg-green-700 hover:bg-green-800"
                            >
                                Close
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-green-800">
                                    Schedule Hearing for Case: {caseNumber}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700"
                                    disabled={isSubmitting}
                                >
                                    <X size={24} />
                                </button>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Bench
                                </label>
                                <select
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={selectedBench}
                                    onChange={(e) => setSelectedBench(e.target.value)}
                                    disabled={benches.length === 1 || isSubmitting}
                                >
                                    <option value="">Select a bench</option>
                                    {benches.map((bench: any) => {
                                        const judgeInfo = bench.judges?.map(
                                            (judge: any) =>
                                                `${judge.first_name ?? ''} ${judge.last_name ?? ''} (ID: ${judge.id})`
                                        ).join(', ') || 'No Judges';

                                        return (
                                            <option key={bench.id} value={bench.id}>
                                                Bench {bench.name} – Judges: {judgeInfo}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>


                            <div className="space-y-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hearing Type
                                    </label>
                                    <select
                                        className="border p-2 w-full"
                                        value={selectedHearingTypeId ?? ""}
                                        onChange={(e) => setSelectedHearingTypeId(Number(e.target.value))}
                                    >
                                        <option value="">Select Hearing Type</option>
                                        {hearingTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date & Time
                                    </label>
                                    <div className={isSubmitting ? "pointer-events-none opacity-50" : ""}>
                                        <DateTimePicker
                                            date={scheduledDateTime || undefined}
                                            onDateChange={(date) => setScheduledDateTime(date)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-green-700 hover:bg-green-800"
                                    onClick={handleSchedule}
                                    disabled={isSubmitting || !scheduledDateTime}
                                >
                                    {isSubmitting ? "Scheduling..." : "Schedule Hearing"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ScheduleHearingDialog;