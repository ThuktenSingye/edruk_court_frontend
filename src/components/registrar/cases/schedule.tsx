"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditIcon } from "@/components/ui/editIcon";
import { DeleteIcon } from "@/components/ui/deleteIcon";
import { PlusIcon } from "@/components/ui/plusIcon";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar"; // ShadCN Calendar
import { TimePicker } from "@/components/ui/time-picker";

interface ScheduleItem {
    id: number;
    text: string;
    date: string;
    time: string;
}

export const Schedule = () => {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([
        { id: 1, text: "Client Meeting", date: "2024-11-11", time: "07:30 PM" },
        { id: 2, text: "Court Hearing", date: "2024-11-12", time: "10:00 AM" },
    ]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [editDate, setEditDate] = useState<string>("");
    const [editTime, setEditTime] = useState<string>("");

    const handleSave = (id: number) => {
        setSchedule(schedule.map(item => (item.id === id ? { ...item, text: editText, date: editDate, time: editTime } : item)));
        setEditingId(null);
    };

    return (
        <Card className="p-4 border border-gray-300">
            <h3 className="text-primary-normal text-lg font-semibold">SCHEDULE</h3>
            <div className="space-y-2 mt-2">
                {schedule.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-md">
                        {editingId === item.id ? (
                            <div className="flex flex-col gap-2 flex-grow">

                            </div>
                        ) : (
                            <div className="flex-grow">
                                <p>{item.text}</p>
                                <span className="text-xs text-gray-500">{item.date} at {item.time}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};


