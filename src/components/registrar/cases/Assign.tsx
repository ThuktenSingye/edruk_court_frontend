"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ScheduleDialogProps {
    onClose: () => void;
}

export default function ScheduleDialog({ onClose }: ScheduleDialogProps) {
    const [selectedBench, setSelectedBench] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedClerk, setSelectedClerk] = useState("");

    const handleAssign = () => {
        if (!selectedBench || !selectedDate || !selectedClerk) {
            alert("Please select a bench, date, and clerk.");
            return;
        }
        alert(`Assigned ${selectedClerk} to ${selectedBench} on ${selectedDate}`);
        onClose(); // Close dialog after assigning
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Bench Assign</h2>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4 mt-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="bench" value="Bench 1" onChange={() => setSelectedBench("Bench 1")} />
                        <span>Bench 1</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="bench" value="Bench 2" onChange={() => setSelectedBench("Bench 2")} />
                        <span>Bench 2</span>
                    </label>
                    <input
                        type="date"
                        className="border p-2 w-full"
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <select className="border p-2 w-full" onChange={(e) => setSelectedClerk(e.target.value)}>
                        <option value="">Select Clerk</option>
                        <option value="Clerk 1">Clerk 1</option>
                        <option value="Clerk 2">Clerk 2</option>
                    </select>
                </div>
                <Button className="bg-green-700 text-white w-full mt-4" onClick={handleAssign}>
                    Assign
                </Button>
            </div>
        </div>
    );
}
