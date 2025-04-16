"use client";

import { useState } from "react";
import { DeleteIcon } from "@/components/ui/deleteIcon";
import { EditIcon } from "@/components/ui/editIcon";
import { PlusIcon } from "@/components/ui/plusIcon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Note {
    id: number;
    text: string;
    date: string;
}

export const RebutalNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [newNoteText, setNewNoteText] = useState("");
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);

    const handleEdit = (id: number, text: string) => {
        setEditingId(id);
        setEditText(text);
    };

    const handleSave = (id: number) => {
        setNotes(notes.map(note => (note.id === id ? { ...note, text: editText } : note)));
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleAddNote = () => {
        if (newNoteText.trim() === "") return;
        const newNote: Note = {
            id: Date.now(),
            text: newNoteText,
            date: new Date().toLocaleString(),
        };
        setNotes([...notes, newNote]);
        setNewNoteText("");
        setIsAddNoteOpen(false);
    };

    return (
        <Card className="p-4 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-primary-normal text-lg font-semibold">NOTES</h3>

                <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 text-white flex items-center gap-1">
                            <PlusIcon /> Add Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Note</DialogTitle>
                        </DialogHeader>
                        <Input
                            placeholder="Enter note..."
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                        />
                        <Button onClick={handleAddNote} className="bg-green-600 text-white w-full mt-4">Save Note</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {notes.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        No Notes
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-md">
                            {editingId === note.id ? (
                                <div className="flex flex-col flex-grow gap-2">
                                    <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full" />
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleSave(note.id)} className="bg-green-600 text-white">Save</Button>
                                        <Button onClick={() => setEditingId(null)} className="bg-gray-400 text-white">Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-grow">
                                    <p>{note.text}</p>
                                    <span className="text-xs text-gray-500">{note.date}</span>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {editingId !== note.id && (
                                    <button onClick={() => handleEdit(note.id, note.text)} className="p-2 hover:bg-gray-200 rounded-full">
                                        <EditIcon />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(note.id)} className="p-2 hover:bg-gray-200 rounded-full">
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};