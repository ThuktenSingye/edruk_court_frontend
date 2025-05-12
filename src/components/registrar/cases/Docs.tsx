/** @format */

"use client";
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { getHearingActions } from "@/lib/hearingAction";

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

interface DocumentsProps {
  documents: HearingDocument[];
  loadingDocuments: boolean;
  caseId: number;
  userRole: string | null;
  hearingId: number;
  hearingType?: string;
  hearing_status: string;
}

const Documents: React.FC<DocumentsProps> = ({
  documents,
  loadingDocuments,
  caseId,
  userRole,
  hearingId,
  hearingType = "regular",
  hearing_status,
}) => {
  const [localDocs, setLocalDocs] = useState<HearingDocument[]>([]);
  const [signingAll, setSigningAll] = useState(false);
  const [signingOne, setSigningOne] = useState<number | null>(null);
  const token = useLoginStore((state) => state.token);
  const host = window.location.hostname;

  const actions = getHearingActions(hearing_status, hearingType, userRole);

  console.log(
    "Documents component rendered with props:",
    hearing_status,
    hearingType,
    userRole
  );

  useEffect(() => {
    setLocalDocs(documents);
  }, [documents]);

  const handleSign = async (documentId: number) => {
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }

    if (userRole !== "Registrar" && userRole !== "Judge") {
      alert("Only Registrar and Judge can sign documents.");
      return;
    }

    setSigningOne(documentId);
    try {
      const endpoint =
        hearingType?.toLowerCase() === "miscellaneous"
          ? `http://${host}:3001/api/v1/cases/${caseId}/documents/${documentId}/sign`
          : `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/documents/${documentId}/sign`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          document: {
            verified_by_judge: userRole === "Judge",
            document_status: "verified",
          },
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || `Server error: ${response.status}`
        );
      }

      // Validate response structure
      if (!responseData || typeof responseData !== "object") {
        throw new Error("Invalid response format from server");
      }

      if (responseData.status !== "ok") {
        throw new Error(
          responseData.message || "Server returned an error status"
        );
      }

      // Update the document status with current timestamp and user role
      const currentTime = new Date().toISOString();
      setLocalDocs((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                verified_at: currentTime,
                verified_by_judge: userRole === "Judge",
                document_status: "verified",
                document: { ...doc.document },
              }
            : doc
        )
      );

      alert(responseData.message || "Document signed successfully!");
    } catch (err: any) {
      console.error("Error signing document:", err);
      alert(
        err.message ||
          "Something went wrong while signing the document. Please try again."
      );
    } finally {
      setSigningOne(null);
    }
  };

  const handleSignAll = async () => {
    if (!token) return alert("Unauthorized: No token found.");
    if (userRole !== "Registrar" && userRole !== "Judge") {
      return alert("Only Registrar and Judge can sign documents.");
    }

    setSigningAll(true);
    try {
      const endpoint =
        hearingType?.toLowerCase() === "miscellaneous"
          ? `http://${host}:3001/api/v1/cases/${caseId}/documents/sign_all`
          : `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/documents/sign_all`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documents: {
            verified_by_judge: userRole === "Judge",
            document_status: "verified",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign all documents.");
      }

      const responseData = await response.json();
      if (responseData.status === "ok" && responseData.data) {
        setLocalDocs((prevDocs) =>
          prevDocs.map((doc) => {
            const updatedDoc = responseData.data.find(
              (d: any) => d.id === doc.id
            );
            return updatedDoc
              ? {
                  ...doc,
                  verified_at: updatedDoc.verified_at,
                  verified_by_judge: updatedDoc.verified_by_judge,
                  document_status: updatedDoc.document_status,
                  document: { ...doc.document },
                }
              : doc;
          })
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      alert(err.message || "Error signing all documents.");
    } finally {
      setSigningAll(false);
    }
  };
  const canSignAll =
    (userRole === "Clerk" || userRole === "Judge") &&
    hearing_status !== "completed";

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-green-800 uppercase">
          Documents
        </h3>
        {actions.showSignAll && (
          <button
            className="text-sm font-medium text-white bg-green-800 hover:bg-green-700 px-3 py-1.5 rounded disabled:opacity-50"
            onClick={handleSignAll}
            disabled={signingAll}>
            {signingAll ? "Signing..." : "Sign All"}
          </button>
        )}
      </div>

      {loadingDocuments ? (
        <p className="text-sm text-gray-500">Loading documents...</p>
      ) : localDocs.length === 0 ? (
        <p className="text-sm text-gray-500">No documents uploaded.</p>
      ) : (
        <div className="space-y-3">
          {localDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <span>{doc.document.filename}</span>
                <span className="text-sm text-gray-600">
                  ({doc.document_status})
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <a
                  href={`http://${host}:3001${doc.document.url}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Eye className="h-5 w-5 text-gray-600 hover:text-green-700 cursor-pointer" />
                </a>

                {doc.verified_at ? (
                  <span className="text-sm text-green-600 font-medium">
                    Signed
                  </span>
                ) : (userRole === "Registrar" &&
                    doc.document_status !== "verified") ||
                  (userRole === "Judge" && !doc.verified_by_judge) ||
                  ["Plaintiff", "Defendant", "Lawyer", "Prosecutor"].includes(
                    userRole
                  ) ? (
                  <button
                    className="text-sm text-green-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleSign(doc.id)}
                    disabled={signingOne === doc.id}>
                    {signingOne === doc.id ? "Signing..." : "Sign"}
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">
                    {doc.document_status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
