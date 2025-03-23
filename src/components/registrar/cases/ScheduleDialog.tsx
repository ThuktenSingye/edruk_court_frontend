"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ScheduleDialogProps {
    onClose: () => void;
}

export default function ScheduleDialog({ onClose }: ScheduleDialogProps) {
    const [selectedJudge, setSelectedJudge] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const handleSchedule = () => {
        if (!selectedJudge || !selectedDate) {
            alert("Please select a judge and date.");
            return;
        }
        alert(`Scheduled with ${selectedJudge} on ${selectedDate}`);
        onClose(); // Close dialog after scheduling
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Proceed to Miscellaneous Hearing</h2>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4 mt-4">
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="judge" value="Judge 1" onChange={() => setSelectedJudge("Judge 1")} />
                        <span>Judge 1</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input type="radio" name="judge" value="Judge 2" onChange={() => setSelectedJudge("Judge 2")} />
                        <span>Judge 2</span>
                    </label>
                    <input
                        type="date"
                        className="border p-2 w-full"
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
                <Button className="bg-green-700 text-white w-full mt-4" onClick={handleSchedule}>
                    Schedule
                </Button>
            </div>
        </div>
    );
}
