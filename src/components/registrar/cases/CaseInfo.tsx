"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Calendar, Pencil } from "lucide-react";
import ScheduleDialog from "@/components/registrar/cases/ScheduleDialog"; // Importing Dialog

export default function CaseDetails() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Title: "Divorce",
        Nature: "Civil",
        RegistrationDate: new Date().toISOString().split("T")[0],
        Severity: "Normal",
        Status: "Active",
        Appeal: "NO",
        Enforcement: "NO",
        Summary: "This is case summary and all.",
    });

    const [documents, setDocuments] = useState([
        { id: 1, name: "FileName1.pdf", date: "31 Dec, 2024", visible: true, url: "/mydocument.pdf" },
    ]);

    const [showDialog, setShowDialog] = useState(false);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSave = () => {
        setIsEditing(false);
        alert("Saved Successfully!");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Case ID</span>
                        <span className="text-green-600 font-semibold">PC-20022</span>
                        <Button
                            className="bg-green-700 text-white flex items-center"
                            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            aria-label="Edit Case Details"
                        >
                            <Pencil size={16} className="mr-1" /> {isEditing ? "Save" : "Edit"}
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {Object.entries(formData).map(([key, value], index) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-500 font-medium">
                                    {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                {isEditing && (key === "Title" || key === "Severity" || key === "Summary") ? (
                                    key === "Summary" ? (
                                        <textarea
                                            name={key}
                                            className="border p-1 rounded text-gray-800 w-full"
                                            value={value}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name={key}
                                            className="border p-1 rounded text-gray-800"
                                            value={value}
                                            onChange={handleInputChange}
                                        />
                                    )
                                ) : (
                                    <span className="text-gray-800">{value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-700">Documents</span>
                    </div>

                    {documents.map((doc) => (
                        <div key={doc.id} className="flex justify-between items-center border p-3 rounded-lg">
                            <a href={doc.url || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600">
                                {doc.name}
                            </a>
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center text-gray-600">
                                    <Calendar size={16} className="mr-1" />
                                    {doc.date}
                                </span>
                                <button>
                                    <Trash2 className="text-red-500 cursor-pointer" size={18} />
                                </button>
                                <button>
                                    <Eye className="text-blue-500 cursor-pointer" size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Accept & Dismiss Buttons */}
            <div className="flex justify-center space-x-4">
                <Button className="bg-green-700 text-white px-6" onClick={() => setShowDialog(true)}>
                    Accept
                </Button>
                <Button variant="outline" className="border-green-700 text-green-700 px-6">
                    Dismiss
                </Button>
            </div>

            {/* Dialog Component */}
            {showDialog && <ScheduleDialog onClose={() => setShowDialog(false)} />}
        </div>
    );
}
