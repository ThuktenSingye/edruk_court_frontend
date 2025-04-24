"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Calendar, Pencil } from "lucide-react";
import ScheduleDialog from "@/components/registrar/cases/ScheduleDialog";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import Link from "next/link";
import { useEffect } from "react";
import axios from "axios"; // if not using fetch API


interface Case {
    regNo: number;
    regDate: string;
    plaintiff: string;
    cidNo: string;
    caseTitle: string;
    types: string;
    bench: string;
    benchClerk: string;
    status: "Active" | "Urgent" | "Enforcement" | "Appeal";
    nature: string;
    severity?: string;
    appeal?: string;
    enforcement?: string;
    summary?: string;
    documents?: {
        id: number;
        verified_at: string | null;
        verified_by_judge: boolean;
        document_status: string;
        file: {
            url: string;
            filename: string;
            content_type: string;
            byte_size: number;
        };
    }[];
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

interface CaseInfoProps {
    caseId: string;
    hearingId: string;
    caseDetails: Case;
    hearings: Hearing[];
}

export default function CaseInfo({ caseId, hearingId, caseDetails, hearings: hearingsProp }: CaseInfoProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { userRole } = useLoginStore();
    const [documents, setDocuments] = useState(() => {
        if (!caseDetails.documents) return [];

        return caseDetails.documents.map((doc) => ({
            id: doc.id,
            name: doc.file?.filename || "Untitled",
            date: new Date().toLocaleDateString(), // You can replace this with `doc.verified_at` if needed
            visible: true,
            url: doc.file?.url || "#",
        }));
    });
    const [showDialog, setShowDialog] = useState(false);
    const [showAllDocs, setShowAllDocs] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hearingTypes, setHearingTypes] = useState<{ id: number; name: string }[]>([]);
    const [pdfPath, setPdfPath] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [hearings, setHearings] = useState<Hearing[]>([]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
        },
        []
    );

    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files?.length) {
                const file = event.target.files[0];
                const newDoc = {
                    id: documents.length + 1,
                    name: file.name,
                    date: new Date().toLocaleDateString(),
                    visible: true,
                    url: URL.createObjectURL(file),
                };
                setDocuments((prev) => [...prev, newDoc]);
                event.target.value = "";
            }
        },
        [documents]
    );

    const deleteDocument = useCallback((id: number) => {
        setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    }, []);

    const handleOpenPdf = (path: string) => {
        setPdfPath(path);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);
    const handleSave = () => {
        setIsEditing(false);
        alert("Saved Successfully!");
    };

    const [benches, setBenches] = useState([]);


    const token = useLoginStore((state) => state.token);


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


    const fetchHearingTypes = useCallback(async () => {
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
            console.log("📥 Response Status:", response.status);
            console.log("📥 Data:", data);

            if (response.ok && data.status === "ok") {
                setHearingTypes(data.data);
            } else {
                console.warn("⚠️ Backend returned non-ok status:", data.message);
            }
        } catch (error) {
            console.error("❌ Error in fetchHearingTypes:", error);
        }
    }, [token]);

    fetchHearingTypes();

    useEffect(() => {
        setHearings(hearingsProp);
    }, [hearingsProp]);




    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Case ID</span>
                        <span className="text-green-600 font-semibold">PC-{caseDetails.regNo}</span>
                        {userRole === "Registrar" && (
                            <Button
                                className="bg-green-700 text-white flex items-center"
                                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                            >
                                <Pencil size={16} className="mr-1" />
                                {isEditing ? "Save" : "Edit"}
                            </Button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {Object.entries(caseDetails).map(([key, value], index) => {
                            if (key === "documents") return null; // ⛔ Skip displaying documents here

                            return (
                                <div key={index} className="flex justify-between">
                                    <span className="text-gray-500 font-medium">
                                        {key.replace(/([A-Z])/g, " $1").trim()}:
                                    </span>
                                    <span className="text-gray-800">{String(value)}</span>
                                </div>
                            );
                        })}

                    </div>

                </CardContent>
            </Card>

            {/* Documents */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-700">Documents</span>
                        <Button variant="ghost" className="text-green-700" onClick={() => setShowAllDocs(!showAllDocs)}>
                            {showAllDocs ? "Hide" : "View More"}
                        </Button>
                    </div>

                    {documents
                        .filter((doc) => showAllDocs || doc.visible)
                        .map((doc) => (
                            <div key={doc.id} className="flex justify-between items-center border p-3 rounded-lg">
                                <a href={doc.url || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-600">
                                    {doc.name}
                                </a>
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center text-gray-600">
                                        <Calendar size={16} className="mr-1" />
                                        {doc.date}
                                    </span>
                                    {userRole === "Registrar" && (
                                        <button onClick={() => deleteDocument(doc.id)}>
                                            <Trash2 className="text-red-500 cursor-pointer" size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => handleOpenPdf(doc.url)}>
                                        <Eye className="text-blue-500 cursor-pointer" size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </CardContent>
            </Card>

            {/* Hearings */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-green-700">Hearings</h2>
                    {hearings.length === 0 ? (
                        <p className="text-gray-500">No hearings scheduled yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {hearings.map((hearing) => (
                                <li key={hearing.id} className="flex justify-between items-center border p-3 rounded-md">
                                    <span className="text-gray-700">{hearing.hearing_type}</span>
                                    <Link href={`/proceedings/${caseId}/${hearing.id}`}>View</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            {userRole === "Registrar" && (
                <div className="flex justify-center space-x-4">
                    <Button className="bg-green-700 text-white px-6" onClick={() => setShowDialog(true)}>
                        Accept
                    </Button>
                    <Button variant="outline" className="border-green-700 text-green-700 px-6">
                        Dismiss
                    </Button>
                </div>
            )}

            {showDialog && (
                <ScheduleDialog
                    onClose={() => setShowDialog(false)}
                    caseId={caseId}
                    hearingTypes={hearingTypes}
                    caseNumber=""
                    benches={benches}
                    onScheduleSuccess={() => {
                        fetchHearingTypes(); // Refresh the hearings list
                    }}
                />
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Document Viewer</h2>
                            <button onClick={closeModal} className="text-red-500 hover:text-red-700 font-bold">
                                X
                            </button>
                        </div>
                        <iframe
                            src={pdfPath}
                            width="100%"
                            height="600px"
                            title="Document Viewer"
                            className="rounded-lg border-2 border-gray-300 shadow-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
