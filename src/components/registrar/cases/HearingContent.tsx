/** @format */

import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Notes from "./notes";
import Documents from "./Docs";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ScheduleHearing from "@/components/registrar/cases/ScheduleHearings";
import { useHearingStore } from "@/app/hooks/useHearingStore";
import { getHearingActions } from "@/lib/hearingAction";

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
  hearing_status: string;
}

const HearingContent: React.FC<HearingContentProps> = ({
  hearingType,
  loadingNotes,
  notes,
  userRole,
  caseId,
  hearingId,
  documents,
  loadingDocuments,
  hearing_status
}) => {
  const [noteList, setNoteList] = useState<Note[]>(notes);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hearingTypes, setHearingTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [documentList, setDocumentList] = useState<HearingDocument[]>(documents);
  const token = useLoginStore((state) => state.token);
  const [benches, setBenches] = useState([]);
  const [hasPreliminaryHearing, setHasPreliminaryHearing] = useState(false);
  const { setHearings: setHearingStore } = useHearingStore();
  const actions = getHearingActions(hearing_status, hearingType, userRole || "");


  useEffect(() => {
    setDocumentList(documents);
  }, [documents]);

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

  useEffect(() => {
    const checkPreliminaryHearing = async () => {
      try {
        const host = window.location.hostname;
        const response = await axios.get(
          `http://${host}:3001/api/v1/cases/${caseId}/hearings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "ok") {
          const hearings = response.data.data;
          const found = hearings.some((hearing: any) => hearing.hearing_type === "Preliminary");
          setHasPreliminaryHearing(found);
        }
      } catch (error) {
        console.error("Failed to check preliminary hearing:", error);
      }
    };

    if (token && caseId) {
      checkPreliminaryHearing();
    }
  }, [token, caseId]);


  useEffect(() => {
    const fetchBenches = async () => {
      try {
        const host = window.location.hostname;

        const response = await axios.get(`http://${host}:3001/api/v1/benches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === "ok") {
          console.log("respose", response.data.data);
          setBenches(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch benches:", error);
      }
    };

    if (token) {
      fetchBenches();
    }
  }, [token]);

  useEffect(() => {
    const fetchHearingTypes = async () => {
      try {
        const host = window.location.hostname;
        const url = `http://${host}:3001/api/v1/hearing_types`;
        console.log("📡 Fetching hearing types from:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.status === "ok") {
          setHearingTypes(data.data);
        } else {
          console.warn("⚠️ Backend returned non-ok status:", data.message);
        }
      } catch (error) {
        console.error("❌ Error in fetchHearingTypes:", error);
      }
    };
    if (token) {
      fetchHearingTypes();
    }
  }, [token]);

  const uploadDocument = async () => {
    if (!selectedFile || !token) {
      alert("Please select a file or ensure you're logged in.");
      return;
    }

    const formData = new FormData();
    const timestamp = new Date().toISOString();

    formData.append("document[document]", selectedFile);
    // formData.append("document[hash_value]", timestamp);
    // formData.append("document[document_status]", "pending");

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
    <div className="p-6 space-y-6 overflow-y-auto">
      <h2 className="text-xl -mt-7 font-semibold text-green-800 uppercase">
        {hearingType} Hearing
      </h2>

      <Documents
        documents={documentList}
        loadingDocuments={loadingDocuments}
        caseId={Number(caseId)}
        userRole={userRole}
        hearingId={Number(hearingId)}
        hearingType={hearingType}
        hearing_status={hearing_status}
      />

      {/* {hearingType !== "Miscellaneous" && (userRole === "Judge" || userRole === "Clerk") ? (
        <div className="border p-4 rounded-md shadow-sm space-y-3">
          {hearing_status != 'completed' && <>
            <h3 className="text-lg font-semibold text-green-800 uppercase">
              <h3 className="text-lg font-semibold text-green-800 uppercase">
                Upload Document
              </h3></h3>
          </>}

          <input type="file" onChange={handleFileChange} />
          <button
            onClick={uploadDocument}
            disabled={uploading || !selectedFile}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow disabled:opacity-50">
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      ) : null} */}
      {actions.showUpload && (
        <div className="border p-4 rounded-md shadow-sm space-y-3">
          <h3 className="text-lg font-semibold text-green-800 uppercase">
            Upload Document
          </h3>

          <input type="file" onChange={handleFileChange} />
          <button
            onClick={uploadDocument}
            disabled={uploading || !selectedFile}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg shadow disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Notes
          notes={noteList}
          hearingType={hearingType}
          loadingNotes={loadingNotes}
          userRole={userRole}
          caseId={caseId}
          hearing_status={hearing_status}
          hearingId={hearingId}
        />
      </div>

      {actions.showScheduleNext &&
        (hearingType === "Preliminary" || !hasPreliminaryHearing) && (
          <div className="flex justify-center space-x-2">
            <Button
              className="bg-green-700 text-white px-6"
              onClick={() => setShowDialog(true)}
            >
              Schedule Hearing
            </Button>
            <Button
              variant="outline"
              className="border-green-700 text-green-700 px-6"
            >
              Dismiss
            </Button>
          </div>
        )}


      {showDialog && (
        <ScheduleHearing
          onClose={() => setShowDialog(false)}
          caseId={caseId}
          hearingTypes={hearingTypes}
          caseNumber=""
          benches={benches}
          onScheduleSuccess={async () => {
            // Fetch updated hearings list
            try {
              const host = window.location.hostname;
              const response = await axios.get(
                `http://${host}:3001/api/v1/cases/${caseId}/hearings`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (response.data.status === "ok") {
                // Update the hearings list in the global store
                const updatedHearings = response.data.data;
                setHearingStore(updatedHearings);
                // Also update the preliminary hearing check
                const found = updatedHearings.some((hearing: any) => hearing.hearing_type === "Preliminary");
                setHasPreliminaryHearing(found);
              }
            } catch (error) {
              console.error("Failed to refresh hearings:", error);
            }
          }} />
      )}
    </div>
  );
};

export default HearingContent;
