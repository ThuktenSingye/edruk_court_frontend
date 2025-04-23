// Documents.tsx
import React from "react";
import { Eye } from "lucide-react";

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
}

const Documents: React.FC<DocumentsProps> = ({ documents, loadingDocuments }) => {

    const host = window.location.hostname;

    return (
        <div className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-800 uppercase">Documents</h3>
                <a href="#" className="text-green-700 text-sm font-medium hover:underline">
                    View More
                </a>
            </div>

            {loadingDocuments ? (
                <p className="text-sm text-gray-500">Loading documents...</p>
            ) : documents.length === 0 ? (
                <p className="text-sm text-gray-500">No documents uploaded.</p>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                        >
                            <div className="flex items-center space-x-2">

                                <span>{doc.document.filename}</span>
                            </div>

                            <a
                                href={`http://${host}:3001${doc.document.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Eye className="h-5 w-5 text-gray-600 hover:text-green-700 cursor-pointer" />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Documents;
