"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Calendar, Pencil } from "lucide-react";
import Assign from "@/components/registrar/cases/Assign";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    documents?: { id: number; name: string; date: string; url: string; visible: boolean; verified?: boolean }[];
}

interface MislleaneousHearingProps {
    caseId: string;
}

export default function MislleaneousHearing({ caseId }: MislleaneousHearingProps) {
    const router = useRouter();
    const [caseDetails, setCaseDetails] = useState<Case | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { userRole, token } = useLoginStore();

    const [documents, setDocuments] = useState([
        { id: 1, name: "FileName1.pdf", date: "31 Dec, 2024", visible: true, url: "/mydocument.pdf", verified: false },
    ]);

    const [showDialog, setShowDialog] = useState(false);
    const [showAllDocs, setShowAllDocs] = useState(false);
    const [showVerifyDialog, setShowVerifyDialog] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfPath, setPdfPath] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!caseId) return;

        const host = window.location.hostname;

        const fetchCaseDetails = async () => {
            try {
                const response = await fetch(`http://${host}:3001/api/v1/cases/${caseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok && data.status === "ok") {
                    setCaseDetails(data.data);
                } else {
                    setError("Case not found");
                }
            } catch (err) {
                setError("An error occurred while fetching the case details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCaseDetails();
    }, [caseId, token]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setCaseDetails((prev) => prev ? { ...prev, [name]: value } : prev);
        },
        []
    );

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            const newDoc = {
                id: documents.length + 1,
                name: file.name,
                date: new Date().toLocaleDateString(),
                visible: true,
                url: URL.createObjectURL(file),
                verified: false,
            };

            setDocuments((prev) => [...prev, newDoc]);
            event.target.value = "";
        }
    }, [documents]);

    const deleteDocument = useCallback((id: number) => {
        setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    }, []);

    const handleVerifyClick = useCallback((doc: any) => {
        setCurrentDoc(doc);
        setShowVerifyDialog(true);
    }, []);

    const handleVerifyDocument = () => {
        setDocuments((docs) =>
            docs.map((doc) => (doc.id === currentDoc.id ? { ...doc, verified: true } : doc))
        );
        setShowVerifyDialog(false);
        alert("Document Verified Successfully!");
    };

    const handleOpenPdf = (path: string) => {
        setPdfPath(path);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        setIsEditing(false);
        alert("Saved Successfully!");
    };

    if (loading) return <p className="text-center text-gray-600">Loading case details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">Case ID</span>
                        <span className="text-green-600 font-semibold">PC-{caseDetails?.regNo}</span>
                        {userRole === 'Registrar' && (
                            <Button
                                className="bg-green-700 text-white flex items-center"
                                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                                aria-label="Edit Case Details"
                            >
                                <Pencil size={16} className="mr-1" /> {isEditing ? "Save" : "Edit"}
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        {caseDetails && Object.entries(caseDetails).map(([key, value], index) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-gray-500 font-medium">
                                    {key.replace(/([A-Z])/g, " $1").trim()}:
                                </span>
                                {isEditing && (key === "caseTitle" || key === "severity" || key === "summary") ? (
                                    key === "summary" ? (
                                        <textarea
                                            name={key}
                                            className="border p-1 rounded text-gray-800 w-full"
                                            value={value as string}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name={key}
                                            className="border p-1 rounded text-gray-800"
                                            value={value as string}
                                            onChange={handleInputChange}
                                        />
                                    )
                                ) : (
                                    <span className="text-gray-800">{value as string}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

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

                                    {/* Verification Status */}
                                    {userRole === 'Judge' ? (
                                        // Judge sees Verify button
                                        <Button
                                            size="sm"
                                            variant={doc.verified ? "outline" : "default"}
                                            className={doc.verified ? "text-green-500 border-green-500" : "bg-green-600 text-white"}
                                            onClick={() => handleVerifyClick(doc)}
                                        >
                                            {doc.verified ? "Verified" : "Verify"}
                                        </Button>
                                    ) : (
                                        // Registrar and Clerk see Verified status text
                                        <span className={`text-sm ${doc.verified ? 'text-green-500' : 'text-gray-500'}`}>
                                            {doc.verified ? "Verified" : "Not Verified"}
                                        </span>
                                    )}

                                    {/* Delete Button - Only for Clerk */}
                                    {userRole === 'clerk' && (
                                        <button onClick={() => deleteDocument(doc.id)}>
                                            <Trash2 className="text-red-500 cursor-pointer" size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </CardContent>
            </Card>

            {userRole === 'Judge' && (
                <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Verify Document</DialogTitle>
                        </DialogHeader>

                        {currentDoc && (
                            <div className="space-y-4">
                                {/* PDF Viewer */}
                                <iframe
                                    src={currentDoc.url}
                                    className="w-full h-[500px] border rounded-lg"
                                    title="PDF Viewer"
                                />

                                {/* Submit Verification */}
                                <Button className="bg-green-600 text-white w-full" onClick={handleVerifyDocument}>
                                    Confirm and Verify
                                </Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {userRole === 'Registrar' && (
                <div className="flex justify-center space-x-4">
                    <Button className="bg-green-700 text-white px-6" onClick={() => setShowDialog(true)}>
                        Assign
                    </Button>
                    <Button variant="outline" className="border-green-700 text-green-700 px-6">
                        Dismiss
                    </Button>
                </div>
            )}

            {showDialog && <Assign onClose={() => setShowDialog(false)} />}
        </div>
    );
}