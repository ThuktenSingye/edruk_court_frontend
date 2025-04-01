"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeleteIcon } from "@/components/ui/deleteIcon";
import { EditIcon } from "@/components/ui/editIcon";
import { PlusIcon } from "@/components/ui/plusIcon";

interface Message {
    id: number;
    text: string;
    date: string;
}

export const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "New update available", date: new Date().toLocaleString() },
        { id: 2, text: "Your request has been approved", date: new Date().toLocaleString() },
        { id: 3, text: "Meeting scheduled for tomorrow", date: new Date().toLocaleString() },
    ]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [newMessageText, setNewMessageText] = useState("");
    const [isAddMessageOpen, setIsAddMessageOpen] = useState(false);

    const handleEdit = (id: number, text: string) => {
        setEditingId(id);
        setEditText(text);
    };

    const handleSave = (id: number) => {
        setMessages(messages.map(msg =>
            msg.id === id ? { ...msg, text: editText, date: new Date().toLocaleString() } : msg
        ));
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        setMessages(messages.filter(msg => msg.id !== id));
    };

    const handleAddMessage = () => {
        if (newMessageText.trim() === "") return;
        const newMessage: Message = {
            id: Date.now(),
            text: newMessageText,
            date: new Date().toLocaleString(),
        };
        setMessages([...messages, newMessage]);
        setNewMessageText("");
        setIsAddMessageOpen(false);
    };

    return (
        <Card className="p-4 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-green-700 text-lg font-semibold">MESSAGES</h3>

                <Dialog open={isAddMessageOpen} onOpenChange={setIsAddMessageOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 text-white flex items-center gap-1">
                            <PlusIcon /> Add Message
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Message</DialogTitle>
                        </DialogHeader>
                        <Input
                            placeholder="Enter message..."
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                        />
                        <Button onClick={handleAddMessage} className="bg-green-600 text-white w-full mt-4">Save Message</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-md">
                        {editingId === msg.id ? (
                            <div className="flex flex-col flex-grow gap-2">
                                <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full" />
                                <div className="flex gap-2">
                                    <Button onClick={() => handleSave(msg.id)} className="bg-green-600 text-white">Save</Button>
                                    <Button onClick={() => setEditingId(null)} className="bg-gray-400 text-white">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow">
                                <p className="text-sm text-gray-700">{msg.text}</p>
                                <span className="text-xs text-gray-500">{msg.date}</span>
                            </div>
                        )}

                        <div className="flex gap-2">
                            {editingId !== msg.id && (
                                <button onClick={() => handleEdit(msg.id, msg.text)} className="p-2 hover:bg-gray-200 rounded-full">
                                    <EditIcon />
                                </button>
                            )}
                            <button onClick={() => handleDelete(msg.id)} className="p-2 hover:bg-gray-200 rounded-full">
                                <DeleteIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
