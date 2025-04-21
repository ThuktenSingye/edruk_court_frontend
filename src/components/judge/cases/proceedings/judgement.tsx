"use client"; // ✅ This makes it a client component

import { useState } from "react";
import { Documents } from "@/components/registrar/cases/documents";
import { FileUpload } from "@/components/registrar/cases/ScheduleWrapper";
import { Card } from "@/components/ui/card";

const Judicial = () => {
    // ✅ Fix: Declare `uploadedFiles` state to track uploaded files
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // ✅ Fix: Update state when new files are uploaded
    const handleFilesUploaded = (files: File[]) => {
        setUploadedFiles((prev) => [...prev, ...files]);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Judgement</h2>

            {/* Documents Section */}
            <Documents />

            {/* Plaintiff Name Placeholder */}
            <div className="mt-4">
                <p className="text-lg font-semibold">Plaintiff: Name</p>
            </div>

            {/* File Upload Section */}
            <Card className="p-4 border border-gray-300">
                <h3 className="text-green-800 text-lg font-semibold mb-3">Attach Files</h3>

                {/* ✅ File Upload Component - Remove `uploadedFiles` prop */}
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

            {/* Action Buttons */}
            <div className="mt-6 flex justify-evenly gap-4">
                {/* <button
                    className="bg-green-700 text-white px-6 py-2 rounded-md"
                    onClick={() => alert("Complete Clicked!")}
                >
                    Complete
                </button> */}
                {/* <button
                    className="bg-green-700 text-white px-6 py-2 rounded-md"
                    onClick={() => alert("Schedule Clicked!")}
                >
                    Schedule
                </button>
                <button
                    className="bg-green-700 text-white px-6 py-2 rounded-md"
                    onClick={() => alert("Archived if judgment is completed")}
                >
                    Archive if judgment is completed
                </button> */}
            </div>
        </div>
    );
};

export default Judicial;



