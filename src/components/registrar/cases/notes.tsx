/** @format */

import React, { useState, useEffect } from "react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { toast } from "react-hot-toast";
import { getHearingActions } from "@/lib/hearingAction";

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
  hearing_status: string;
}

const Notes: React.FC<NotesProps> = ({
  notes,
  hearingType,
  loadingNotes,
  userRole,
  caseId,
  hearingId,
  hearing_status,
}) => {
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);
  const [isLoading, setIsLoading] = useState(false);
  const actions = getHearingActions(
    hearing_status,
    hearingType,
    userRole || ""
  );

  console.log("action show add note", actions.showAddNote);

  const token = useLoginStore((state) => state.token);
  const host = window.location.hostname;

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      console.log("notess data", data);
      setLocalNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [caseId, hearingId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setSubmitting(true);

    const endpoint = `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/notes`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await response.json();
      console.log("Newly added note:", data);

      toast.success("Note added successfully!");

      // Fetch updated notes after adding a new note
      await fetchNotes();

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
    (hearingType === "Miscellaneous" &&
      userRole === "Registrar" &&
      hearing_status != "completed") ||
    (hearingType !== "Miscellaneous" &&
      (userRole === "Judge" || userRole === "Clerk") &&
      hearing_status != "completed");

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-green-800 uppercase mb-4">
        Notes
      </h3>

      {actions.showAddNote && (
        <div className="flex justify-end mb-4 -mt-12">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => setDialogOpen(true)}>
            Add Note
          </button>
        </div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Add Note
            </h3>
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
                onClick={() => setDialogOpen(false)}>
                Cancel
              </button>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleAddNote}
                disabled={submitting}>
                {submitting ? "Adding..." : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
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
