"use client";

import { useEffect, useState } from "react";
import { useActionCable } from "@/app/context/ActionCableContext";
import { NotificationItem } from "@/components/common/notification/NotificationItem";
import { NotificationIcon } from "@/components/ui/notificationIcon";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface Notification {
    id: number;
    description: string;
    date: string;
    court_id: string;
    read_at: string | null;
    is_ws?: boolean;
}

export default function NotificationPage() {
    const { cable } = useActionCable();
    const [wsNotifications, setWsNotifications] = useState<Notification[]>([]);
    const [apiNotifications, setApiNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingRead, setMarkingRead] = useState<number | null>(null);
    const userId = useLoginStore((state) => state.userId);
    const token = useLoginStore.getState().token;

    // Fetch from API
    useEffect(() => {
        const host = window.location.hostname;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://${host}:3000/api/v1/notifications`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const jsonData = await response.json();

                const formatted: Notification[] = Array.isArray(jsonData?.data) ? jsonData.data.map((item: any) => ({
                    id: item.id,
                    description: item.message || `Notification ID ${item.id}`,
                    date: item.params?.hearing_schedule?.scheduled_date
                        ? new Date(item.params.hearing_schedule.scheduled_date).toLocaleString()
                        : "No date",
                    court_id: item.params?.case?.court_id !== undefined
                        ? String(item.params.case.court_id)
                        : "N/A",
                    read_at: item.read_at
                })) : [];

                setApiNotifications(formatted);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [token]);

    // WebSocket subscription
    useEffect(() => {
        if (!cable) return undefined;

        const subscription = cable.subscriptions.create(
            { channel: "NotificationChannel", user_id: userId },
            {
                connected: () => console.log("WebSocket connected"),
                disconnected: () => console.log("WebSocket disconnected"),
                received: (data) => {
                    const newNotification: Notification = {
                        id: Date.now(),
                        description: data.message || "New notification",
                        date: new Date().toLocaleString(),
                        court_id: data.case?.court_id || "N/A",
                        read_at: null,
                        is_ws: true
                    };
                    setWsNotifications((prev) => [...prev, newNotification]);
                },
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [cable, userId]);

    const markAsRead = async (notificationId: number, isWs: boolean = false) => {
        if (isWs) {
            setWsNotifications(prev => prev.filter(n => n.id !== notificationId));
            return;
        }

        setMarkingRead(notificationId);
        try {

            const host = window.location.hostname;

            const response = await fetch(
                `http://${host}:3001/api/v1/notifications/${notificationId}/mark_as_read`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to mark as read");

            setApiNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        } finally {
            setMarkingRead(null);
        }
    };

    const openPDF = (fileName: string) => {
        window.open(`/pdfs/${fileName}`, "_blank");
    };

    if (loading) return <div className="p-4">Loading notifications...</div>;

    // Fixed the missing parenthesis here
    const allNotifications = [
        ...apiNotifications.map(n => ({ ...n, is_ws: false })),
        ...wsNotifications
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-4 md:p-8 font-poppins">
            <div className="flex items-center gap-2 text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
                <p className="text-black font-medium text-md">Notification</p>
                <NotificationIcon />
            </div>

            <div className="space-y-6 md:space-y-8">
                {allNotifications.length > 0 ? (
                    allNotifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            isMarkingRead={markingRead === notification.id}
                            onMarkAsRead={() => markAsRead(notification.id, notification.is_ws)}
                            openPDF={openPDF}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">No new notifications</p>
                )}
            </div>
        </div>
    );
}