"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { useParams } from "next/navigation";

interface CaseDocument {
    id: number;
    created_at: string;
    document_status: string;
    document_url: string;
    verified_by_judge: boolean;
}

interface Hearing {
    id: number;
    case_id: number;
    hearing_status: string;
    hearing_type: {
        name: string;
    };
    case_documents: CaseDocument[];
    case_evidences: unknown[];
}

export default function CaseDetails() {
    const params = useParams();
    const caseId = params.regNo as string; // Using your dynamic route parameter

    const [fileUrl, setFileUrl] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hearings, setHearings] = useState<Hearing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useLoginStore();

    const fetchHearings = useCallback(async () => {
        if (!caseId) return;

        try {
            setLoading(true);
            setError(null);

            const host = window.location.hostname;

            const response = await fetch(
                `http://${host}:3001/api/v1/cases/1/files`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status !== "ok") {
                throw new Error(result.message || "API returned non-ok status");
            }

            setHearings(result.data);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch case details");
        } finally {
            setLoading(false);
        }
    }, [caseId, token]);

    useEffect(() => {
        fetchHearings();
    }, [fetchHearings]);

    const openModal = (url: string) => {
        setFileUrl(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Loading case details...</div>;
    }

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error}
                <button
                    onClick={fetchHearings}
                    className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (hearings.length === 0) {
        return <div className="p-4 text-gray-500">No hearings found for this case</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Case #{caseId} Documents</h2>

            <div className="border rounded-lg p-4">
                {hearings.map((hearing) => (
                    <div key={hearing.id} className="mb-6">
                        <div className="flex items-center font-medium cursor-pointer hover:text-blue-500">
                            <ChevronDown size={16} className="mr-2" />
                            {hearing.hearing_type.name} Hearing - {hearing.hearing_status}
                        </div>

                        <div className="ml-6 mt-2">
                            {hearing.case_documents.length > 0 ? (
                                hearing.case_documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center py-1 hover:text-blue-500 cursor-pointer"
                                        onClick={() => openModal(doc.document_url)}
                                    >
                                        <FileText size={14} className="mr-2" />
                                        {doc.document_url.split('/').pop() || 'Document'}
                                        <span className="text-gray-400 ml-2">({doc.document_status})</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm">No documents for this hearing</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Document Viewer</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {fileUrl.endsWith('.pdf') ? (
                                <iframe
                                    src={fileUrl}
                                    className="w-full h-full border rounded"
                                    title="Document Viewer"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <p className="mb-4">Preview not available</p>
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                    >
                                        Download Document
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}