import { FC } from "react";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
    onFilesUploaded: (files: File[]) => void;
}

export const FileUpload: FC<FileUploadProps> = ({ onFilesUploaded }) => {
    // ✅ Handle Drag and Drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        if (droppedFiles.length > 0) {
            onFilesUploaded(droppedFiles); // ✅ Send files to parent component
        }
    };

    // ✅ Handle Manual Upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(event.target.files || []);
        if (uploadedFiles.length > 0) {
            onFilesUploaded(uploadedFiles); // ✅ Send files to parent component
        }
    };

    return (
        <div className="flex justify-center mt-4">
            <div
                className="w-full p-4 mr-2 border border-gray-300 rounded-lg bg-white flex justify-center shadow-md cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <p className="text-primary-normal">Drag and Drop</p>
            </div>

            <label
                htmlFor="fileUpload"
                className="w-full p-4 ml-2 border border-gray-300 rounded-lg bg-white flex justify-center shadow-md cursor-pointer"
            >
                <p className="text-primary-normal">Upload Manually</p>
                <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
                />
            </label>
        </div>
    );
};
