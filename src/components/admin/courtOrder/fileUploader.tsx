import { FC } from "react";
import { Cloud } from "@/components/ui/cloud";
import { UploadIcon } from "@/components/ui/uploadIcon";

interface FileUploaderProps {
    onFilesUploaded: (files: File[]) => void;
}

const FileUploader: FC<FileUploaderProps> = ({ onFilesUploaded }) => {
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        onFilesUploaded(droppedFiles);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(event.target.files || []);
        onFilesUploaded(uploadedFiles);
        event.target.value = ""; // reset for same file re-upload
    };

    return (
        <div className="flex flex-col md:flex-row gap-3 mt-2">
            <div
                className="w-full md:w-1/2 rounded-md bg-primary-normal p-4 shadow-md flex items-center justify-center h-14 cursor-pointer"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <Cloud />
                <p className="text-white text-md ml-2">Drag and Drop Folder</p>
            </div>

            <label
                htmlFor="fileUpload"
                className="w-full md:w-1/2 rounded-md bg-primary-normal p-4 shadow-md flex items-center justify-center h-14 cursor-pointer"
            >
                <UploadIcon />
                <p className="text-white text-md ml-2">Upload Manually</p>
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

export default FileUploader;
