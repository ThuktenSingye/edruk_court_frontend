"use client";
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore"; // adjust path if needed

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
    hearingId: number;
}

const Documents: React.FC<DocumentsProps> = ({
    documents,
    loadingDocuments,
    caseId,
    hearingId,
}) => {
    const [localDocs, setLocalDocs] = useState<HearingDocument[]>([]);
    const [signingAll, setSigningAll] = useState(false);
    const [signingOne, setSigningOne] = useState<number | null>(null);
    const token = useLoginStore((state) => state.token);
    const host = window.location.hostname;

    useEffect(() => {
        setLocalDocs(documents);
    }, [documents]);

    const handleSign = async (documentId: number) => {
        if (!token) return alert("Unauthorized: No token found.");

        setSigningOne(documentId);
        try {
            const response = await fetch(`http://${host}:3001/api/sign-document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ documentId }),
            });

            if (!response.ok) throw new Error("Failed to sign document.");

            setLocalDocs((prevDocs) =>
                prevDocs.map((doc) =>
                    doc.id === documentId
                        ? { ...doc, verified_at: new Date().toISOString() }
                        : doc
                )
            );
        } catch (err: any) {
            alert(err.message || "Something went wrong.");
        } finally {
            setSigningOne(null);
        }
    };

    const handleSignAll = async () => {
        if (!token) return alert("Unauthorized: No token found.");

        setSigningAll(true);
        try {
            const response = await fetch(
                `http://${host}:3001/api/v1/cases/${caseId}/hearings/${hearingId}/documents/sign_all`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to sign all documents.");
            }

            const now = new Date().toISOString();
            setLocalDocs((prevDocs) =>
                prevDocs.map((doc) =>
                    doc.verified_at ? doc : { ...doc, verified_at: now }
                )
            );
        } catch (err: any) {
            alert(err.message || "Error signing all documents.");
        } finally {
            setSigningAll(false);
        }
    };

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-800 uppercase">
                    Documents
                </h3>
                <button
                    className="text-sm font-medium text-white bg-green-800 hover:bg-green-700 px-3 py-1.5 rounded disabled:opacity-50"
                    onClick={handleSignAll}
                    disabled={signingAll}
                >
                    {signingAll ? "Signing..." : "Sign All"}
                </button>
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
                            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                        >
                            <div className="flex items-center space-x-2">
                                <span>{doc.document.filename}</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <a
                                    href={`http://${host}:3001${doc.document.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Eye className="h-5 w-5 text-gray-600 hover:text-green-700 cursor-pointer" />
                                </a>
                                {doc.verified_at ? (
                                    <span className="text-sm text-green-600 font-medium">Signed</span>
                                ) : (
                                    <button
                                        className="text-sm text-green-700 hover:underline"
                                        onClick={() => handleSign(doc.id)}
                                        disabled={signingOne === doc.id}
                                    >
                                        {signingOne === doc.id ? "Signing..." : "Sign"}
                                    </button>
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
