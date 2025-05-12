/** @format */

import React, { useEffect, useState } from "react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import HearingContent from "./HearingContent";

interface Note {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
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

interface Hearing {
  id: number;
  hearing_status: string;
  hearing_type: string;
  schedules: {
    id: number;
    scheduled_date: string;
    schedule_status: string;
    scheduled_by: number;
  }[];
}

interface HearingsProps {
  selectedHearingId: string;
  hearings: Hearing[];
  caseId: string;
  caseDocuments?: any[];
}

const Hearings: React.FC<HearingsProps> = ({
  selectedHearingId,
  hearings,
  caseId,
  caseDocuments = [],
}) => {
  const selectedHearing = hearings.find(
    (hearing) => hearing.id.toString() === selectedHearingId
  );
  console.log("hearings");

  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const [documents, setDocuments] = useState<HearingDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  const token = useLoginStore((state) => state.token);
  const userRole = useLoginStore((state) => state.userRole);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!caseId || !selectedHearingId) return;

      setLoadingNotes(true);
      try {
        const host = window.location.hostname;

        const res = await fetch(
          `http://${host}:3001/api/v1/cases/${caseId}/hearings/${selectedHearingId}/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        if (json.status === "ok") {
          setNotes(json.data);
        } else {
          console.warn("Failed to fetch notes:", json);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoadingNotes(false);
      }
    };

    const fetchDocuments = async () => {
      if (!caseId || !selectedHearingId) return;

      setLoadingDocuments(true);
      try {
        const host = window.location.hostname;

        if (selectedHearing?.hearing_type.toLowerCase() === "miscellaneous") {
          const caseResponse = await fetch(
            `http://${host}:3001/api/v1/cases/${caseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const caseJson = await caseResponse.json();

          if (caseJson.status === "ok") {
            const caseDocs = caseJson.data.documents.map((doc: any) => ({
              id: doc.id,
              verified_at: doc.verified_at,
              verified_by_judge: doc.verified_by_judge,
              document_status: doc.document_status,
              document: {
                url: doc.file.url,
                filename: doc.file.filename,
                content_type: doc.file.content_type,
                byte_size: doc.file.byte_size,
              },
            }));
            setDocuments(caseDocs);
          }
        } else {
          const res = await fetch(
            `http://${host}:3001/api/v1/cases/${caseId}/hearings/${selectedHearingId}/documents`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const json = await res.json();
          if (json.status === "ok") {
            setDocuments(json.data);
          } else {
            console.warn("Failed to fetch documents:", json);
          }
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchNotes();
    fetchDocuments();
  }, [
    selectedHearingId,
    caseId,
    token,
    caseDocuments,
    selectedHearing?.hearing_type,
  ]);

  if (!selectedHearingId) {
    return null;
  }

  return (
    <HearingContent
      loadingNotes={loadingNotes}
      notes={notes}
      hearingType={selectedHearing?.hearing_type || "Hearing"}
      userRole={userRole}
      caseId={caseId}
      hearingId={selectedHearingId}
      documents={documents}
      loadingDocuments={loadingDocuments}
      hearing_status={selectedHearing.hearing_status}
    />
  );
};

export default Hearings;
