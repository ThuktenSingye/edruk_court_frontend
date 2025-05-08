/** @format */

"use client";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Eye,
  PlusCircle,
  Calendar,
  Pencil,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { RebutalNotes } from "@/components/judge/cases/RebutalNotes";
import { RebutalMessages } from "@/components/judge/cases/RebutalMessage";

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
interface RebuttalSectionProps {
  caseId: string;
  onProceed: () => void;
  title: string;
}

export default function RebutalOne({
  caseId,
  onProceed,
  title,
}: RebuttalSectionProps) {
  const [hearingDate, setHearingDate] = useState("");
  const [hearingTime, setHearingTime] = useState("");
  const [hearingDetails, setHearingDetails] = useState("");
  const [plaintiffFiles, setPlaintiffFiles] = useState<FileData[]>([]);
  const [defendantFiles, setDefendantFiles] = useState<FileData[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [messages, setMessages] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [editSchedule, setEditSchedule] = useState<{
    id: number | null;
    text: string;
  }>({ id: null, text: "" });
  const [showDialog, setShowDialog] = useState(false);

  const handleDialogConfirm = () => {
    console.log("Scheduling next hearing:", {
      date: hearingDate,
      time: hearingTime,
      details: hearingDetails,
    });
    console.log("Proceeding to next hearing...");
    setShowDialog(false);
    onProceed(); // Call the parent's proceed handler
  };

  const handleComplete = () => {
    setShowDialog(true);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "Plaintiff" | "Defendant"
  ) => {
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
    setNotes([
      ...notes,
      { id: Date.now(), text: newNote, timestamp: new Date().toLocaleString() },
    ]);
    setNewNote("");
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const addSchedule = () => {
    if (newSchedule.trim() === "") return;
    setSchedule([
      ...schedule,
      {
        id: Date.now(),
        text: newSchedule,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setNewSchedule("");
  };

  const deleteSchedule = (id: number) => {
    setSchedule(schedule.filter((item) => item.id !== id));
  };

  const editScheduleHandler = (id: number, text: string) => {
    setEditSchedule({ id, text });
  };

  const saveEditedSchedule = () => {
    setSchedule(
      schedule.map((item) =>
        item.id === editSchedule.id
          ? {
              ...item,
              text: editSchedule.text,
              timestamp: new Date().toLocaleString(),
            }
          : item
      )
    );
    setEditSchedule({ id: null, text: "" });
  };

  // Add Message
  const addMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: newMessage,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setNewMessage("");
  };

  return (
    <div className="p-1">
      <h2 className="text-green-700 font-semibold text-lg">{title}</h2>

      {/* Plaintiff & Defendant Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FileUploadCard
          title="PLAINTIFF"
          files={plaintiffFiles}
          onUpload={(e) => handleFileUpload(e, "Plaintiff")}
        />
        <FileUploadCard
          title="DEFENDANT"
          files={defendantFiles}
          onUpload={(e) => handleFileUpload(e, "Defendant")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <RebutalNotes />
        <RebutalMessages />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleComplete}
          className="bg-green-600 hover:bg-green-700">
          Complete
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Next Hearing</DialogTitle>
            <DialogDescription>
              Please provide details for the next hearing session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hearing-date" className="text-right">
                Date
              </Label>
              <Input
                id="hearing-date"
                type="date"
                className="col-span-3"
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hearing-time" className="text-right">
                Time
              </Label>
              <Input
                id="hearing-time"
                type="time"
                className="col-span-3"
                value={hearingTime}
                onChange={(e) => setHearingTime(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hearing-details" className="text-right">
                Details
              </Label>
              <Textarea
                id="hearing-details"
                className="col-span-3"
                value={hearingDetails}
                onChange={(e) => setHearingDetails(e.target.value)}
                placeholder="Enter hearing details..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm}>Schedule & Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* FileUploadCard Component */
function FileUploadCard({
  title,
  files,
  onUpload,
}: {
  title: string;
  files: FileData[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Card className="p-4">
      <h3 className="text-md font-semibold">{title}</h3>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex justify-between items-center bg-gray-200 p-2 rounded-md mt-2">
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
        <input
          type="file"
          className="hidden"
          multiple
          accept=".pdf"
          onChange={onUpload}
        />
      </label>
    </Card>
  );
}
