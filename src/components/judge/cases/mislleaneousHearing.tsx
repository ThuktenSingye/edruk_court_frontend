"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MiscellaneousHearing() {
    const [documents, setDocuments] = useState([
        { id: 1, name: "Document 1", date: "31 Dec, 2024", visible: true, url: "/mydocument.pdf", verified: false },
        { id: 2, name: "Document 2", date: "1 Jan, 2025", visible: true, url: "/mydocument.pdf", verified: false },
    ]);

    const [showAllDocs, setShowAllDocs] = useState(false);
    const [showVerifyDialog, setShowVerifyDialog] = useState(false);
    const [currentDoc, setCurrentDoc] = useState<any>(null);

    // Delete document handler
    const deleteDocument = useCallback((id: number) => {
        setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    }, []);

    // Open verification dialog with document
    const handleVerifyClick = useCallback((doc: any) => {
        setCurrentDoc(doc);
        setShowVerifyDialog(true);
    }, []);

    // Mark document as verified
    const handleVerifyDocument = () => {
        setDocuments((docs) =>
            docs.map((doc) => (doc.id === currentDoc.id ? { ...doc, verified: true } : doc))
        );
        setShowVerifyDialog(false);
        alert("Document Verified Successfully!");
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-4">
            {/* Documents Card */}
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

                                    {/* Verify Button */}
                                    <Button
                                        size="sm"
                                        variant={doc.verified ? "outline" : "default"}
                                        className={doc.verified ? "text-green-500 border-green-500" : "bg-green-600 text-white"}
                                        onClick={() => handleVerifyClick(doc)}
                                    >
                                        {doc.verified ? "Verified" : "Verify"}
                                    </Button>

                                    {/* Delete Button */}
                                    <button onClick={() => deleteDocument(doc.id)}>
                                        <Trash2 className="text-red-500 cursor-pointer" size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                </CardContent>
            </Card>

            {/* PDF Viewer Dialog */}
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
        </div>
    );
}
