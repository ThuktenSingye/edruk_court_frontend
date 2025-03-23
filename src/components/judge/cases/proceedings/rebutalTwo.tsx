"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Eye, PlusCircle, Calendar, Pencil, Upload } from "lucide-react";

interface Note {
    id: number;
    text: string;
    timestamp: string;
}

interface Schedule {
    id: number;
    text: string;
    timestamp: string;
}

export default function RebuttalSection() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [schedule, setSchedule] = useState<Schedule[]>([]);
    const [newNote, setNewNote] = useState("");
    const [newSchedule, setNewSchedule] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    // Add Note
    const addNote = () => {
        if (newNote.trim() === "") return;
        setNotes([...notes, { id: Date.now(), text: newNote, timestamp: new Date().toLocaleString() }]);
        setNewNote("");
    };

    // Delete Note
    const deleteNote = (id: number) => {
        setNotes(notes.filter((note) => note.id !== id));
    };

    // Add Schedule
    const addSchedule = () => {
        if (newSchedule.trim() === "") return;
        setSchedule([...schedule, { id: Date.now(), text: newSchedule, timestamp: new Date().toLocaleString() }]);
        setNewSchedule("");
    };

    // Delete Schedule
    const deleteSchedule = (id: number) => {
        setSchedule(schedule.filter((item) => item.id !== id));
    };

    // Handle File Upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFiles([...files, ...Array.from(event.target.files)]);
        }
    };

    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-green-700 font-semibold text-lg">REBUTTAL TWO</h2>

            {/* Plaintiff & Defendant Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CaseCard title="PLAINTIFF" />
                <CaseCard title="DEFENDANT" />
            </div>

            {/* Attach File */}
            <Card className="p-4 mt-4">
                <h3 className="text-md font-semibold">ATTACH FILE</h3>
                <div className="flex gap-4 mt-2">
                    <Button variant="outline">
                        <Upload className="mr-2" size={16} /> Drag and Drop
                    </Button>
                    <Input type="file" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="text-blue-600 cursor-pointer">
                        Upload Manually
                    </label>
                </div>
                <div className="mt-3">
                    {files.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {files.map((file, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span>{file.name}</span>
                                    <a href={URL.createObjectURL(file)} target="_blank" className="text-blue-600 underline">
                                        View
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No files uploaded.</p>
                    )}
                </div>
            </Card>

            {/* Messages */}
            <CaseCard title="Messages" description="Description of the message ..." hasViewMore />

            {/* Notes & Schedule Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Notes Section */}
                <Card className="p-4">
                    <h3 className="text-md font-semibold">NOTE</h3>
                    {notes.map((note) => (
                        <div key={note.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-md mt-2">
                            <p>{note.text}</p>
                            <button onClick={() => deleteNote(note.id)}>
                                <Trash2 className="text-red-500" size={18} />
                            </button>
                        </div>
                    ))}
                    {/* Add Note Button */}
                    <div className="mt-2 flex items-center gap-2">
                        <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..." />
                        <Button onClick={addNote} variant="outline" className="flex gap-2">
                            <PlusCircle size={16} /> Add
                        </Button>
                    </div>
                </Card>

                {/* Schedule Section */}
                <Card className="p-4">
                    <h3 className="text-md font-semibold">SCHEDULE</h3>
                    {schedule.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-md mt-2">
                            <p>{item.text}</p>
                            <div className="flex gap-2">
                                <Pencil className="text-blue-500" size={18} />
                                <button onClick={() => deleteSchedule(item.id)}>
                                    <Trash2 className="text-red-500" size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Add Schedule Button */}
                    <div className="mt-2 flex items-center gap-2">
                        <Input value={newSchedule} onChange={(e) => setNewSchedule(e.target.value)} placeholder="Add schedule..." />
                        <Button onClick={addSchedule} variant="outline" className="flex gap-2">
                            <Calendar size={16} /> Add
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Complete Button - Shortened & Moved Left */}
            <div className="mt-4 flex justify-start">
                <Button className="bg-green-600 text-white px-4 py-2">Complete</Button>
            </div>
        </div>
    );
}

/* CaseCard Component */
function CaseCard({ title, description = "FileName.pdf", hasViewMore = false }: { title: string, description?: string, hasViewMore?: boolean }) {
    return (
        <Card className="p-4">
            <div className="flex justify-between">
                <h3 className="text-md font-semibold">{title}</h3>
                {hasViewMore && <a href="#" className="text-green-600">View More</a>}
            </div>
            <div className="flex justify-between items-center bg-gray-200 p-2 rounded-md mt-2">
                <p>{description}</p>
                <div className="flex gap-2">
                    <Calendar className="text-gray-500" size={18} />
                    <Eye className="text-blue-500" size={18} />
                </div>
            </div>
        </Card>
    );
}