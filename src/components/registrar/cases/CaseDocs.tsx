"use client";
import { useState, ReactNode, useEffect } from "react";
import { ChevronRight, ChevronDown, FileText } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface CaseDocsProps {
    caseId: string;
}

interface Document {
    id: number;
    name: string;
    path: string;
    fieldSign: string;
    signable: boolean;
    category: string;
}

// Folder Component
const Folder = ({ name, children }: { name: string; children?: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="ml-4">
            <div
                className="flex items-center cursor-pointer hover:text-blue-500 transition-all duration-200 ease-in-out"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="ml-2 font-medium text-gray-800">{name}</span>
            </div>
            {isOpen && <div className="pl-4 mt-2">{children}</div>}
        </div>
    );
};

// File Component
const File = ({
    name,
    path,
    onClick,
    fieldSign,
    signable,
}: {
    name: string;
    path: string;
    onClick: () => void;
    fieldSign: string;
    signable: boolean;
}) => (
    <div className="flex flex-col items-start ml-8 hover:text-blue-500 cursor-pointer transition-all duration-200 ease-in-out mt-8">
        <div
            onClick={onClick}
            className="flex items-center mb-2"
        >
            <FileText size={16} />
            <a href={`#${path}`} className="ml-2 text-gray-600 hover:text-blue-600">
                {name}
            </a>
        </div>
    </div>
);

const CaseDocs = ({ caseId }: CaseDocsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfPath, setPdfPath] = useState("");
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`http://nganglam.lvh.me:3001/api/v1/cases/${caseId}/documents`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok && data.status === "ok") {
                    setDocuments(data.data);
                } else {
                    setError("Failed to fetch documents");
                }
            } catch (err) {
                setError("An error occurred while fetching documents");
            } finally {
                setLoading(false);
            }
        };

        if (caseId) {
            fetchDocuments();
        }
    }, [caseId, token]);

    const openModal = (path: string) => {
        setPdfPath(path);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Group documents by category
    const groupedDocuments = documents.reduce((acc, doc) => {
        if (!acc[doc.category]) {
            acc[doc.category] = [];
        }
        acc[doc.category].push(doc);
        return acc;
    }, {} as Record<string, Document[]>);

    if (loading) return <p className="text-center text-gray-600">Loading documents...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 mt-8">
            <Folder name={`Case ID: ${caseId}`}>
                {Object.entries(groupedDocuments).map(([category, docs]) => (
                    <Folder key={category} name={category}>
                        {docs.map((doc) => (
                            <File
                                key={doc.id}
                                name={doc.name}
                                path={doc.path}
                                fieldSign={doc.fieldSign}
                                signable={doc.signable}
                                onClick={() => openModal(doc.path)}
                            />
                        ))}
                    </Folder>
                ))}
            </Folder>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Document Viewer</h2>
                            <button
                                onClick={closeModal}
                                className="text-red-500 hover:text-red-700 font-bold"
                            >
                                X
                            </button>
                        </div>
                        <iframe
                            src={`/${pdfPath}`}
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
};

export default CaseDocs;
