"use client";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Eye, PlusCircle, Calendar, Pencil, Upload } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog";

interface FileData {
    id: number;
    name: string;
    url: string;
    timestamp: string;
}

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
    const [plaintiffFiles, setPlaintiffFiles] = useState<FileData[]>([]);
    const [defendantFiles, setDefendantFiles] = useState<FileData[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [schedule, setSchedule] = useState<Schedule[]>([]);
    const [messages, setMessages] = useState<Note[]>([]);
    const [newNote, setNewNote] = useState("");
    const [newSchedule, setNewSchedule] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [editSchedule, setEditSchedule] = useState<{ id: number | null; text: string }>({ id: null, text: "" });
    const [showDialog, setShowDialog] = useState(false);

    // Handle file uploads
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "Plaintiff" | "Defendant") => {
        if (!event.target.files) return;

        const uploadedFiles = Array.from(event.target.files).map((file) => {
            const fileURL = URL.createObjectURL(file);
            return {
                id: Date.now() + Math.random(),
                name: file.name,
                url: fileURL,
                timestamp: new Date().toLocaleString(),
            };
        });

        if (type === "Plaintiff") {
            setPlaintiffFiles([...plaintiffFiles, ...uploadedFiles]);
        } else {
            setDefendantFiles([...defendantFiles, ...uploadedFiles]);
        }
    };

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

    // Edit Schedule
    const editScheduleHandler = (id: number, text: string) => {
        setEditSchedule({ id, text });
    };

    // Save Edited Schedule
    const saveEditedSchedule = () => {
        setSchedule(
            schedule.map((item) =>
                item.id === editSchedule.id ? { ...item, text: editSchedule.text, timestamp: new Date().toLocaleString() } : item
            )
        );
        setEditSchedule({ id: null, text: "" });
    };

    // Add Message
    const addMessage = () => {
        if (newMessage.trim() === "") return;
        setMessages([...messages, { id: Date.now(), text: newMessage, timestamp: new Date().toLocaleString() }]);
        setNewMessage("");
    };

    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-green-700 font-semibold text-lg">REBUTTAL ONE</h2>

            {/* Plaintiff & Defendant Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FileUploadCard title="PLAINTIFF" files={plaintiffFiles} onUpload={(e) => handleFileUpload(e, "Plaintiff")} />
                <FileUploadCard title="DEFENDANT" files={defendantFiles} onUpload={(e) => handleFileUpload(e, "Defendant")} />
            </div>

            {/* Messages Section */}
            <Card className="p-4 mt-4">
                <h3 className="text-md font-semibold">Messages</h3>
                {messages.map((message) => (
                    <div key={message.id} className="bg-gray-200 p-2 rounded-md mt-2">
                        <p>{message.text}</p>
                        <p className="text-sm text-gray-500 mt-1">{message.timestamp}</p>
                    </div>
                ))}
                <div className="mt-2 flex items-center gap-2">
                    <Textarea value={newMessage} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewMessage(e.target.value)} placeholder="Add a message..." />
                    <Button onClick={addMessage} variant="outline" className="flex gap-2">
                        <PlusCircle size={16} /> Add Message
                    </Button>
                </div>
            </Card>

            {/* Schedule Section */}
            <Card className="p-4 mt-4">
                <h3 className="text-md font-semibold">Schedule</h3>
                {schedule.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-md mt-2">
                        {editSchedule.id === item.id ? (
                            <input
                                type="text"
                                className="border rounded-md p-1 w-full"
                                value={editSchedule.text}
                                onChange={(e) => setEditSchedule({ ...editSchedule, text: e.target.value })}
                            />
                        ) : (
                            <>
                                <p>{item.text}</p>
                                <p className="text-sm text-gray-500">{item.timestamp}</p>
                            </>
                        )}
                        <div className="flex gap-2">
                            {editSchedule.id === item.id ? (
                                <Button size="sm" onClick={saveEditedSchedule}>
                                    Save
                                </Button>
                            ) : (
                                <Pencil className="text-blue-500 cursor-pointer" size={18} onClick={() => editScheduleHandler(item.id, item.text)} />
                            )}
                            <button onClick={() => deleteSchedule(item.id)}>
                                <Trash2 className="text-red-500" size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="mt-2 flex items-center gap-2">
                    <Input value={newSchedule} onChange={(e) => setNewSchedule(e.target.value)} placeholder="Add schedule..." />
                    <Button onClick={addSchedule} variant="outline" className="flex gap-2">
                        <Calendar size={16} /> Schedule
                    </Button>
                </div>
            </Card>

            {/* Complete Button with Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                    {/* <Button className="bg-green-600 text-white mt-4 w-auto">Add Rebuttal</Button> */}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>localhost:3000</DialogHeader>
                    <p>Case completed successfully!</p>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/* FileUploadCard Component */
function FileUploadCard({ title, files, onUpload }: { title: string; files: FileData[]; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <Card className="p-4">
            <h3 className="text-md font-semibold">{title}</h3>
            {files.map((file) => (
                <div key={file.id} className="flex justify-between items-center bg-gray-200 p-2 rounded-md mt-2">
                    <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{file.timestamp}</p>
                    </div>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <Eye className="text-blue-500 cursor-pointer" size={20} />
                    </a>
                </div>
            ))}
            <label className="mt-2 flex items-center gap-2 cursor-pointer text-blue-600">
                <Upload size={16} /> Upload PDF
                <input type="file" className="hidden" multiple accept=".pdf" onChange={onUpload} />
            </label>
        </Card>
    );
}