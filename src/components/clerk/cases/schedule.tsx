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
    const [newSchedule, setNewSchedule] = useState<ScheduleItem>({ id: 0, text: "", date: "", time: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ Handle Edit
    const handleEdit = (id: number, text: string, date: string, time: string) => {
        setEditingId(id);
        setEditText(text);
        setEditDate(date);
        setEditTime(time);
    };

    // ✅ Handle Save
    const handleSave = (id: number) => {
        setSchedule(schedule.map(item => (item.id === id ? { ...item, text: editText, date: editDate, time: editTime } : item)));
        setEditingId(null);
    };

    // ✅ Handle Delete
    const handleDelete = (id: number) => {
        setSchedule(schedule.filter(item => item.id !== id));
    };

    // ✅ Handle Add New Schedule
    const handleAddSchedule = () => {
        if (!newSchedule.text.trim() || !newSchedule.date.trim() || !newSchedule.time.trim()) return;
        setSchedule([...schedule, { ...newSchedule, id: Date.now() }]);
        setNewSchedule({ id: 0, text: "", date: "", time: "" });
        setIsModalOpen(false);
    };

    return (
        <Card className="p-4 border border-gray-300">
            <h3 className="text-primary-normal text-lg font-semibold">SCHEDULE</h3>
            <div className="space-y-2 mt-2">
                {schedule.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-md">
                        {editingId === item.id ? (
                            <div className="flex flex-col gap-2 flex-grow">
                                <Input value={editText} onChange={(e) => setEditText(e.target.value)} placeholder="Schedule Title" />
                                <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                                <TimePicker selected={editTime} onChange={(time) => setEditTime(time)} />
                                <div className="flex gap-2">
                                    <Button onClick={() => handleSave(item.id)} className="bg-green-600 text-white">Save</Button>
                                    <Button onClick={() => setEditingId(null)} className="bg-gray-400 text-white">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow">
                                <p>{item.text}</p>
                                <span className="text-xs text-gray-500">{item.date} at {item.time}</span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            {editingId !== item.id && (
                                <button onClick={() => handleEdit(item.id, item.text, item.date, item.time)} className="p-2 hover:bg-gray-200 rounded-full">
                                    <EditIcon />
                                </button>
                            )}
                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-gray-200 rounded-full">
                                <DeleteIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Schedule Button (Modal) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-4 w-1/4 bg-green-600 text-white flex items-center gap-1">
                        <PlusIcon /> Schedule
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Schedule</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter schedule details"
                        value={newSchedule.text}
                        onChange={(e) => setNewSchedule({ ...newSchedule, text: e.target.value })}
                    />
                    <Calendar
                        mode="single"
                        selected={newSchedule.date ? new Date(newSchedule.date) : undefined}
                        onSelect={(date) => setNewSchedule({ ...newSchedule, date: date ? date.toISOString().split("T")[0] : "" })}
                    />
                    <TimePicker selected={newSchedule.time} onChange={(time) => setNewSchedule({ ...newSchedule, time })} />
                    <Button onClick={handleAddSchedule} className="bg-green-600 text-white w-full mt-4">Add</Button>
                </DialogContent>
            </Dialog>
        </Card>
    );
};


