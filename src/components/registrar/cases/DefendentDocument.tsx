"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { DeleteIcon } from "@/components/ui/deleteIcon";
import { EyeIcon } from "@/components/ui/eyeIcon";
import { FolderIcon } from "@/components/ui/folderIcon";
import { CheckCircleIcon } from "@/components/ui/checkCircleIcon";

interface Document {
    fileName: string;
    fileDate: string;
    fileUrl: string;
    verified: boolean;
}

const initialDocuments: Document[] = [
    { fileName: "FileName.pdf", fileDate: "31 Dec, 2024", fileUrl: "/mydocument.pdf", verified: false },
    { fileName: "Report.pdf", fileDate: "15 Jan, 2025", fileUrl: "/mydocument.pdf", verified: false },
    { fileName: "Invoice.pdf", fileDate: "10 Feb, 2025", fileUrl: "/mydocument.pdf", verified: false },
];

export const Defendent = () => {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (
        <Card className="p-4 border border-gray-300">
            <div className="flex justify-between items-center">
                <h3 className="text-primary-normal text-lg font-semibold">DEFENDENT DOCUMENTS</h3>
                <Button variant="ghost" className="text-primary-normal">
                    View More
                </Button>
            </div>

            {/* ✅ Document List */}
            <div className="space-y-2 mt-2">
                {documents.length > 0 ? (
                    documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-md">

                            <span className="flex items-center gap-2">
                                <FolderIcon /> {doc.fileName}
                            </span>


                            <div className="flex items-center gap-4">
                                {/* ✅ Open dialog only if file is valid */}
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
                                            {doc.verified ? (
                                                <CheckCircleIcon className="text-green-600" />
                                            ) : (
                                                <EyeIcon />
                                            )}
                                        </Button>
                                    </DialogTrigger>

                                    {/* ✅ PDF Viewer Modal */}
                                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Viewing {doc.fileName}</DialogTitle>
                                        </DialogHeader>

                                        {/* ✅ PDF Viewer */}
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
