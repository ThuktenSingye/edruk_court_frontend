"use client";

import { useState } from "react";
import { Documents } from "@/components/registrar/cases/documents";
import { Notes } from "@/components/registrar/cases/notes";
import { Messages } from "@/components/registrar/cases/messages";
import { Schedule } from "@/components/registrar/cases/schedule";
import { FileUpload } from "@/components/registrar/cases/fileUpload";
import { Card } from "@/components/ui/card";

export default function Home() {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // ✅ Function to handle file uploads
    const handleFilesUploaded = (files: File[]) => {
        setUploadedFiles((prev) => [...prev, ...files]);
        console.log("Files uploaded:", files);
    };

    const handleNextStep = () => {
        if (currentStep < 7) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    return (
        <div className="p-6 min-h-screen">

            <h2 className="text-green-800 font-bold mt-6 text-lg">PRELIMINARY HEARING</h2>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <Documents />
                <Notes />

                {/* ✅ Wrap File Upload Section in a Card */}
                <Card className="p-4 border border-gray-300">
                    <h3 className="text-green-800 text-lg font-semibold mb-3">Attach Files</h3>

                    {/* ✅ File Upload Component */}
                    <FileUpload onFilesUploaded={handleFilesUploaded} />

                    {/* ✅ Uploaded Files Stay Within This Section */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Uploaded Files:</h3>
                        {uploadedFiles.length > 0 ? (
                            <ul className="list-disc ml-5">
                                {uploadedFiles.map((file, index) => (
                                    <li key={index} className="text-gray-700">{file.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No files uploaded.</p>
                        )}
                    </div>
                </Card>

                <Schedule />
                <Messages />
            </div>

            <button
                className={`mt-6 w-1/4 p-3 rounded-md ${currentStep < 7 ? "bg-green-600 text-white" : "bg-gray-500 text-gray-200"
                    }`}
                onClick={handleNextStep}
            >
                {currentStep < 7 ? "Complete" : "Finished"}
            </button>
        </div>
    );
}