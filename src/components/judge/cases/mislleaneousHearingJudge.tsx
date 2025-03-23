"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2, Calendar, Upload, Pencil, X } from "lucide-react";

export default function mislleaneousHearing() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Title: "Attempted Murder Case",
        Nature: "Criminal",
        RegistrationDate: new Date().toISOString().split("T")[0],
        Severity: "Normal",
        Status: "Active",
        Appeal: "NO",
        Enforcement: "NO",
        Summary: "This is case summary and all.",
    });

    const [documents, setDocuments] = useState([
        { id: 1, name: "FileName1.pdf", date: "31 Dec, 2024", visible: true, url: "" },
        { id: 2, name: "FileName2.pdf", date: "31 Dec, 2024", visible: true, url: "" },
        { id: 3, name: "FileName3.pdf", date: "31 Dec, 2024", visible: false, url: "" },
    ]);

    const [showAllDocs, setShowAllDocs] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const toggleVisibility = useCallback((id: number) => {
        setDocuments((docs) =>
            docs.map((doc) => (doc.id === id ? { ...doc, visible: !doc.visible } : doc))
        );
    }, []);

    const deleteDocument = useCallback((id: number) => {
        setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    }, []);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            const newDoc = {
                id: documents.length + 1,
                name: file.name,
                date: new Date().toLocaleDateString(),
                visible: true,
                url: URL.createObjectURL(file),
            };

            setDocuments((prev) => [...prev, newDoc]);
            event.target.value = "";
        }
    }, [documents]);

    const handleSave = () => {
        setIsEditing(false);
        alert("Saved Successfully!");
    };

    const [showDialog, setShowDialog] = useState(false);
    const [selectedJudge, setSelectedJudge] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const handleSchedule = () => {
        if (!selectedJudge || !selectedDate) {
            alert("Please select a judge and date.");
            return;
        }
        alert(`Scheduled with ${selectedJudge} on ${selectedDate}`);
        setShowDialog(false);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Case ID</span>
                        <span className="text-green-600 font-semibold">PC-24-3045</span>
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
                                {isEditing ? (
                                    <input
                                        type={key === "registrationDate" ? "date" : "text"}
                                        name={key}
                                        className="border p-1 rounded text-gray-800"
                                        value={value}
                                        onChange={handleInputChange}
                                    />
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
                        <Button
                            variant="ghost"
                            className="text-green-700"
                            onClick={() => setShowAllDocs(!showAllDocs)}
                        >
                            {showAllDocs ? "Hide" : "View More"}
                        </Button>
                    </div>

                    {documents
                        .filter((doc) => showAllDocs || doc.visible)
                        .map((doc) => (
                            <div key={doc.id} className="flex justify-between items-center border p-3 rounded-lg">
                                <a href={doc.url || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600">
                                    {doc.name}
                                </a>
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-600">
                                        <Calendar size={16} className="mr-1" /> {doc.date}
                                    </span>
                                    <button onClick={() => toggleVisibility(doc.id)}>
                                        {doc.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button onClick={() => deleteDocument(doc.id)}>
                                        <Trash2 className="text-red-500 cursor-pointer" size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                    <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                    <Button className="bg-primary-normal text-white flex items-center" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={16} className="mr-2" /> Upload PDF
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
                <Button className="bg-green-700 text-white px-6" onClick={() => setShowDialog(true)}>
                    Proceed
                </Button>
                <Button variant="outline" className="border-green-700 text-green-700 px-6">
                    Dismiss
                </Button>
            </div>
        </div>
    );
}
