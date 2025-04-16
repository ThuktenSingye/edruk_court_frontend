"use client";

import React, { useState, useEffect } from "react";
import { NotificationIcon } from "@/components/ui/notificationIcon";
import { NotificationItem } from "@/components/common/notification/NotificationItem";

interface NotificationData {
    description: string;
    date: string;
    courseName: string;
    fileName: string;
    fileDate: string;
}

const mockNotifications: NotificationData[] = [
    {
        description: "Sample notification description 1. Please check this out.",
        date: "2025-02-07",
        courseName: "React Development Course",
        fileName: "course-material-1.pdf",
        fileDate: "2025-01-15",
    },
    {
        description: "Sample notification description 2. Please check this out.",
        date: "2025-02-08",
        courseName: "Node.js Development Course",
        fileName: "course-material-2.pdf",
        fileDate: "2025-01-16",
    },
];

export default function NotificationPage() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        setNotifications(mockNotifications);
    }, []);

    const handleMarkAsRead = (index: number) => {
        alert(`Notification ${index + 1} marked as read`);
        // Optional: update status or style later
    };

    const handleDismiss = (index: number) => {
        const updated = notifications.filter((_, i) => i !== index);
        setNotifications(updated);
    };

    const openPDF = (fileName: string) => {
        const fileUrl = `/path/to/your/pdfs/${fileName}`; // Replace with actual path
        window.open(fileUrl, "_blank");
    };

    return (
        <div className="p-4 md:p-8 font-poppins">
            <div className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
                <p className="text-black font-medium text-md">Notification</p>
                <NotificationIcon />
            </div>
            <div className="space-y-6 md:space-y-8">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <NotificationItem
                            key={index}
                            notification={notification}
                            index={index}
                            onDismiss={handleDismiss}
                            openPDF={openPDF}
                        />
                    ))
                ) : (
                    <p>No new notifications.</p>
                )}
            </div>
        </div>
    );
}