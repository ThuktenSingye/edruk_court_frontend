"use client";

import { useState } from "react";

interface TimePickerProps {
    selected: string;
    onChange: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [amPm, setAmPm] = useState("AM");

    const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
    const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59

    const handleSaveTime = () => {
        const formattedTime = `${selectedHour}:${selectedMinute
            .toString()
            .padStart(2, "0")} ${amPm}`;
        onChange(formattedTime);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            {/* Button to Open Time Picker */}
            <button
                className="w-full px-4 py-2 border rounded-md bg-white text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected || "Select Time"}
            </button>

            {/* Time Picker Popup - UI FIXED */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-full max-w-[250px] bg-white border rounded-md shadow-lg p-4 z-50">
                    <div className="flex items-center justify-between space-x-2">
                        {/* Hours Dropdown */}
                        <select
                            className="p-2 border rounded-md w-1/3"
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(Number(e.target.value))}
                        >
                            {hours.map((hour) => (
                                <option key={hour} value={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>

                        <span className="text-lg">:</span>

                        {/* Minutes Dropdown */}
                        <select
                            className="p-2 border rounded-md w-1/3"
                            value={selectedMinute}
                            onChange={(e) => setSelectedMinute(Number(e.target.value))}
                        >
                            {minutes.map((minute) => (
                                <option key={minute} value={minute}>
                                    {minute.toString().padStart(2, "0")}
                                </option>
                            ))}
                        </select>

                        {/* AM/PM Toggle */}
                        <select
                            className="p-2 border rounded-md w-1/3"
                            value={amPm}
                            onChange={(e) => setAmPm(e.target.value)}
                        >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>

                    {/* Save Button */}
                    <button
                        className="w-full mt-3 p-2 bg-green-600 text-white rounded-md"
                        onClick={handleSaveTime}
                    >
                        Save Time
                    </button>
                </div>
            )}
        </div>
    );
};
