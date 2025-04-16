"use client";

import { useState } from "react";
import { Documents } from "@/components/registrar/cases/documents";
import { Notes } from "@/components/registrar/cases/notes";
import { Messages } from "@/components/registrar/cases/messages";
import { Schedule } from "@/components/registrar/cases/schedule";
import { FileUpload } from "@/components/registrar/cases/fileUpload";
import { Card } from "@/components/ui/card";

interface PreliminaryProps {
    caseId: string;
}

export default function Preliminary({ caseId }: PreliminaryProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
        <div className="p-3 flex flex-col">

            <h2 className="text-green-800 font-bold mt-0 text-lg">PRELIMINARY HEARING</h2>
            <div className="mt-3"> <Documents /></div>


            <div className="grid grid-cols-2 gap-4 mt-4">

                <Notes />
                <Messages />

            </div>
        </div>
    );
}