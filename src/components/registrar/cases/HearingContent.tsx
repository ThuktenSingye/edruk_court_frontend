/** @format */

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Notes from "./notes";
import Documents from "./Docs";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ScheduleHearing from "@/components/registrar/cases/ScheduleHearings";

interface Note {
  id: number;
  content: string;
  created_at: string;
}

interface HearingDocument {
  id: number;
  verified_at: string | null;
  verified_by_judge: boolean;
  document_status: string;
  document: {
    url: string;
    filename: string;
    content_type: string;
    byte_size: number;
  };
}

interface HearingContentProps {
  hearingType: string;
  loadingNotes: boolean;
  notes: Note[];
  userRole: string | null;
  caseId: string;
  hearingId: string;
  documents: HearingDocument[];
  loadingDocuments: boolean;
}

const HearingContent: React.FC<HearingContentProps> = ({
  hearingType,
  loadingNotes,
  notes,
  userRole,
  caseId,
  hearingId,
  loadingDocuments,
}) => {
  const [noteList, setNoteList] = useState<Note[]>(notes);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [documentList, setDocumentList] = useState<HearingDocument[]>([]);
  const token = useLoginStore((state) => state.token);

  const handleNoteAdded = (newNote: Note) => {
    setNoteList((prev) => [newNote, ...prev]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const fetchDocuments = async () => {
    try {
      const host = window.location.hostname;
      const response = await axios.get(
        `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const serverDocs = response.data.data;
      setDocumentList(serverDocs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDocuments();
    }
  }, [token, caseId, hearingId]);

  const uploadDocument = async () => {
    if (!selectedFile || !token) {
      alert("Please select a file or ensure you're logged in.");
      return;
    }

    const formData = new FormData();
    const timestamp = new Date().toISOString();

    formData.append("document[document]", selectedFile);
    formData.append("document[hash_value]", timestamp);
    formData.append("document[document_status]", "pending");

    setUploading(true);
    try {
      const host = window.location.hostname;

      const response = await axios.post(
        `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/documents`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Document uploaded successfully!");
      const newDoc = response.data.data;
      setDocumentList((prev) => [newDoc, ...prev]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="max-w-5xl mt-8 shadow-lg">
      <div className="p-6 space-y-6 h-[87vh] overflow-y-auto">
        <h2 className="text-xl -mt-7 font-semibold text-green-800 uppercase">
          {hearingType} Hearing
        </h2>

        <Documents
          documents={documentList}
          loadingDocuments={loadingDocuments}
        />

        {(hearingType === "Miscellaneous" && userRole === "Registrar") ||
        (hearingType !== "Miscellaneous" &&
          (userRole === "Judge" || userRole === "Clerk")) ? (
          <div className="border p-4 rounded-md shadow-sm space-y-3">
            <h3 className="text-lg font-semibold text-green-800 uppercase">
              Upload Document
            </h3>
            <input type="file" onChange={handleFileChange} />
            <button
              onClick={uploadDocument}
              disabled={uploading || !selectedFile}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow disabled:opacity-50">
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Notes
            notes={noteList}
            hearingType={hearingType}
            loadingNotes={loadingNotes}
            userRole={userRole}
            caseId={caseId}
            hearingId={hearingId}
          />

          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-green-800 uppercase mb-4">
              Messages
            </h3>
            <div className="space-y-3">
              {[
                { sender: "Admin", msg: "New update available" },
                { sender: "Support", msg: "Your request has been approved" },
                { sender: "Manager", msg: "Meeting scheduled for tomorrow" },
              ].map((message, idx) => (
                <div key={idx} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p className="text-sm">{message.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(hearingType === "Miscellaneous" && userRole === "Registrar") ||
        (hearingType !== "Miscellaneous" &&
          (userRole === "Judge" || userRole === "Clerk")) ? (
          <div className="flex justify-center space-x-2">
            <Button
              className="bg-green-700 text-white px-6"
              onClick={() => setShowDialog(true)}>
              Schedule Hearing
            </Button>
            <Button
              variant="outline"
              className="border-green-700 text-green-700 px-6">
              Dismiss
            </Button>
          </div>
        ) : null}

        {showDialog && (
          <ScheduleHearing
            onClose={() => setShowDialog(false)}
            caseId={caseId}
            caseNumber={""}
            onScheduleSuccess={function (newEvent: any): void {
              throw new Error("Function not implemented.");
            }}
            benches={[]}
          />
        )}
      </div>
    </div>
  );
};

export default HearingContent;
