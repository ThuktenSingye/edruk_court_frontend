
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import * as ActionCable from "@rails/actioncable";
import { useLoginStore } from "../hooks/useLoginStore";

type Cable = ReturnType<typeof ActionCable.createConsumer>;

export interface Notification {
    id: string;
    description: string;
    course_name: string;
    fileName: string;         // ✅ Required for NotificationItem.tsx
    fileDate: string;         // ✅ Required for NotificationItem.tsx
    date: string;
    read: boolean;
    created_at: string;
}

interface ActionCableContextType {
    cable: Cable | null;
    notifications: Notification[];
    addNotification: (n: Notification) => void;
    markAsRead: (id: string) => void;
}

const ActionCableContext = createContext<ActionCableContextType | null>(null);

export const ActionCableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cable, setCable] = useState<Cable | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const userToken = useLoginStore((state) => state.token)

    console.log("user_token", userToken)

    useEffect(() => {
        const consumer = ActionCable.createConsumer(`ws://nganglam.lvh.me:3001/cable?token=${userToken}`);
        setCable(consumer);
        return () => consumer.disconnect();
    }, []);

    const addNotification = (n: Notification) => {
        setNotifications((prev) => [n, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <ActionCableContext.Provider value={{ cable, notifications, addNotification, markAsRead }
        }>
            {children}
        </ActionCableContext.Provider>
    );
};

export const useActionCable = () => {
    const context = useContext(ActionCableContext);
    if (!context) throw new Error("useActionCable must be used within ActionCableProvider");
    return context;
};