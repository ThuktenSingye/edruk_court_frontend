"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EyeIcon } from "@/components/ui/eyeIcon";
import { FolderIcon } from "@/components/ui/folderIcon";
import { CheckCircleIcon } from "@/components/ui/checkCircleIcon";

interface Document {
    fileName: string;
    fileDate: string;
    fileUrl: string;
    verified: boolean | null;
}

interface DocumentsProps {
    documents: Document[];
}

export const Documents = ({ documents: docs }: DocumentsProps) => {
    const [documents, setDocuments] = useState<Document[]>(docs);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (
        <Card className="p-4 border border-gray-300">
            <div className="flex justify-between items-center">
                <h3 className="text-primary-normal text-lg font-semibold">DOCUMENTS</h3>
                <Button variant="ghost" className="text-[#0E1632] hover:text-primary-light">
                    View More
                </Button>
            </div>

            {/* ✅ Document List */}
            <div className="space-y-2 mt-2 max-h-[400px] overflow-y-auto pr-2">
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <div
                            key={index}
                            className="flex flex-col md:flex-row md:items-center justify-between bg-gray-100 p-3 rounded-md shadow-md gap-3"
                        >
                            <div className="flex items-center gap-2 text-sm">
                                <FolderIcon />
                                <span>{doc.fileName}</span>
                                <span className="text-xs text-gray-500">({doc.fileDate})</span>
                                {doc.verified === true && (
                                    <span className="ml-2 text-green-600 font-medium">(Accepted)</span>
                                )}
                                {doc.verified === false && (
                                    <span className="ml-2 text-red-600 font-medium">(Denied)</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-5 w-5 text-gray-700 hover:text-black"
                                            onClick={() => {
                                                setSelectedFile(doc.fileUrl);
                                                setSelectedIndex(index);
                                                setOpenDialog(true);
                                            }}
                                        >
                                            {doc.verified === true ? (
                                                <CheckCircleIcon className="text-green-600" />
                                            ) : (
                                                <EyeIcon />
                                            )}
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Viewing {doc.fileName}</DialogTitle>
                                        </DialogHeader>
                                        {selectedFile ? (
                                            <iframe
                                                src={selectedFile}
                                                className="w-full h-[500px] border rounded-md"
                                                title="Document Viewer"
                                            ></iframe>
                                        ) : (
                                            <p className="text-gray-500">No document available.</p>
                                        )}
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="ghost"
                                    className="text-green-600 hover:underline"
                                    onClick={() =>
                                        setDocuments((prev) =>
                                            prev.map((d, i) =>
                                                i === index ? { ...d, verified: true } : d
                                            )
                                        )
                                    }
                                    disabled={doc.verified === true}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="text-red-600 hover:underline"
                                    onClick={() =>
                                        setDocuments((prev) =>
                                            prev.map((d, i) =>
                                                i === index ? { ...d, verified: false } : d
                                            )
                                        )
                                    }
                                    disabled={doc.verified === false}
                                >
                                    Deny
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No documents available.</p>
                )}
            </div>
        </Card>
    );
};