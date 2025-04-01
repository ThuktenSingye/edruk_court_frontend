"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface NotificationItemProps {
    notification: {
        description: string;
        date: string;
        courseName: string;
        fileName: string;
        fileDate: string;
    };
    index: number;
    onDismiss: (index: number) => void;
    openPDF: (fileName: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    index,
    onDismiss,
    openPDF,
}) => {
    return (
        <div className="w-full bg-white border border-gray-300 shadow-2xl rounded-lg p-4 md:p-8 text-green-600">
            <div className="space-y-6 md:space-y-8">
                {/* Notification Details */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div className="flex flex-col w-full md:w-1/2 space-y-2 md:space-y-4">
                        <label className="text-md font-medium" htmlFor={`description-${index}`}>
                            NOTIFICATION DESCRIPTION
                        </label>
                        <Input
                            id={`description-${index}`}
                            value={notification.description}
                            className="w-full p-2 md:p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col space-y-2 md:space-y-4">
                        <div className="flex flex-row items-center gap-2">
                            <label className="text-md font-medium" htmlFor={`date-${index}`}>
                                Date:
                            </label>
                            <p className="text-md">{notification.date}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-md font-medium">Course Name:</p>
                            <p className="text-md">{notification.courseName}</p>
                        </div>
                    </div>
                </div>

                {/* ✅ Single "Mark as Read" Button */}
                <div className="mt-4">
                    <button
                        onClick={() => onDismiss(index)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-neutral-300 border bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 h-9 py-2 border-green-700 text-green-700 px-6"
                    >
                        Mark as Read
                    </button>
                </div>
            </div>
        </div>
    );
};