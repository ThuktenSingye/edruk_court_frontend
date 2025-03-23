"use client";
import { useState, ReactNode } from "react";
import { ChevronRight, ChevronDown, FileText } from "lucide-react";

interface FolderProps {
    name: string;
    children?: ReactNode;
}

// Folder Component
const Folder = ({ name, children }: FolderProps) => {
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

// Define types for File component props
interface FileProps {
    name: string;
    path: string;  // path is a string that points to the file location
    onClick: () => void; // Function to handle the opening of the PDF modal
    fieldSign: string; // The field sign placeholder (could be text, signature image, etc.)
    signable: boolean; // Indicates if the document is signable
}

// File Component
const File = ({ name, path, onClick, fieldSign, signable }: FileProps) => (
    <div className="flex flex-col items-start ml-8 hover:text-blue-500 cursor-pointer transition-all duration-200 ease-in-out mt-8">
        <div
            onClick={onClick} // Trigger the modal on file click
            className="flex items-center mb-2"
        >
            <FileText size={16} />
            <a href={`#${path}`} className="ml-2 text-gray-600 hover:text-blue-600">
                {name}
            </a>
        </div>
        {/* Signable Section */}
        {/* <div className="flex items-center space-x-4">
            <div>
                <strong>Field Sign:</strong>
                <span className="ml-2 text-gray-500">{fieldSign || "Not Signed"}</span>
            </div>
            <div>
                <strong>Signable:</strong>
                <span className={`ml-2 ${signable ? "text-green-500" : "text-red-500"}`}>
                    {signable ? "Yes" : "No"}
                </span>
            </div>
        </div> */}
    </div>
);

export default function FileStructure() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [pdfPath, setPdfPath] = useState(""); // Path to the PDF file

    const openModal = (path: string) => {
        setPdfPath(path);
        setIsModalOpen(true); // Open the modal when a file is clicked
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 mt-8">
            <Folder name="Case ID: C002">
                <Folder name="Case Registration">
                    <File
                        name="mydocument.pdf"
                        path="mydocument-pdf"
                        fieldSign="John Doe"
                        signable={true}
                        onClick={() => openModal("mydocument.pdf")}
                    />
                </Folder>
                <Folder name="Miscellaneous Hearing">
                    <File
                        name="mydocument.pdf"
                        path="mydocument-pdf"
                        fieldSign="Jane Smith"
                        signable={false}
                        onClick={() => openModal("mydocument.pdf")}
                    />
                </Folder>
                <Folder name="Opening Statement">
                    <File
                        name="mydocument.pdf"
                        path="mydocument-pdf"
                        fieldSign=""
                        signable={true}
                        onClick={() => openModal("mydocument.pdf")}
                    />
                </Folder>
            </Folder>



            {/* Modal for PDF Viewer */}
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
}