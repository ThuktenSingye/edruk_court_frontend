import React, { useState, useEffect } from "react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { toast } from "react-hot-toast";

interface Note {
    id: number;
    content: string;
    created_at: string;
}

interface NotesProps {
    notes: Note[];
    hearingType: string;
    loadingNotes: boolean;
    userRole: string | null;
    caseId: string;
    hearingId: string;
}

const Notes: React.FC<NotesProps> = ({
    notes,
    hearingType,
    loadingNotes,
    userRole,
    caseId,
    hearingId,
}) => {
    const [newNote, setNewNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [localNotes, setLocalNotes] = useState<Note[]>(notes);

    useEffect(() => {
        setLocalNotes(notes);
    }, [notes]);

    const token = useLoginStore((state) => state.token);

    const host = window.location.hostname;

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        setSubmitting(true);

        const endpoint = `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/notes`;

        try {
            const token = localStorage.getItem("authToken");

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newNote }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add note: ${errorText}`);
            }

            const data = await response.json();
            console.log("Newly added note:", data);

            // Ensure the newNoteObj contains both content and created_at
            const newNoteObj: Note = {
                id: data.id,
                content: data.content,
                created_at: data.created_at ?? new Date().toISOString(),
            };

            toast.success("Note added successfully!");

            // Update the localNotes state with the new note
            setLocalNotes((prevNotes) => [newNoteObj, ...prevNotes]);
            setNewNote("");
            setDialogOpen(false);
        } catch (err) {
            console.error("Error adding note:", err);
            toast.error(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setSubmitting(false);
        }
    };

    const canAddNote =
        (hearingType === "Miscellaneous" && userRole === "Registrar") ||
        (hearingType !== "Miscellaneous" && (userRole === "Judge" || userRole === "Clerk"));

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 uppercase mb-4">Notes</h3>

            {canAddNote && (
                <div className="flex justify-end mb-4 -mt-12">
                    <button
                        className="bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add Note
                    </button>
                </div>
            )}

            {dialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">Add Note</h3>
                        <textarea
                            className="w-full p-2 border rounded mb-4"
                            rows={4}
                            placeholder="Enter your note here..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-700 text-white px-4 py-2 rounded"
                                onClick={handleAddNote}
                                disabled={submitting}
                            >
                                {submitting ? "Adding..." : "Add Note"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loadingNotes ? (
                <p className="text-gray-500">Loading notes...</p>
            ) : localNotes.length > 0 ? (
                <div className="mt-4 max-h-[230px] overflow-y-auto">
                    {localNotes.map((note) => (
                        <div key={note.id} className="bg-gray-100 p-3 rounded-lg mb-4">
                            <p className="text-sm font-medium">{note.content}</p>
                            <p className="text-xs text-gray-500">
                                {note.created_at && !isNaN(new Date(note.created_at).getTime())
                                    ? new Date(note.created_at).toLocaleString()
                                    : "Date unavailable"}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No notes available.</p>
            )}
        </div>
    );
};

export default Notes;
