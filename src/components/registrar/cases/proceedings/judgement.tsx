"use client"; // ✅ This makes it a client component

import { useState } from "react";
import { Documents } from "@/components/registrar/cases/documents";
import { FileUpload } from "@/components/registrar/cases/fileUpload";
import { Card } from "@/components/ui/card";

const Judicial = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleFilesUploaded = (files: File[]) => {
        setUploadedFiles((prev) => [...prev, ...files]);
    };

    return (
        <div className="p-3 h-[330px]">
            <h2 className="text-xl font-bold mb-4">Judgement</h2>
            <Documents />
        </div>
    );
};

export default Judicial;



