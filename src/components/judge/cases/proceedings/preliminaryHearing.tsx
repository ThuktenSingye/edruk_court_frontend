// "use client";

// import { useState } from "react";
// import { Documents } from "@/components/judge/cases/documents";
// import { Notes } from "@/components/judge/cases/notes";
// import { Messages } from "@/components/judge/cases/messages";
// import { Schedule } from "@/components/judge/cases/schedule";
// import { FileUpload } from "@/components/judge/cases/fileUpload";
// import { Card } from "@/components/ui/card";

// export default function Home() {
//     const [currentStep, setCurrentStep] = useState(0);
//     const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

//     const handleFilesUploaded = (files: File[]) => {
//         setUploadedFiles((prev) => [...prev, ...files]);
//         console.log("Files uploaded:", files);
//     };

//     const handleNextStep = () => {
//         if (currentStep < 7) {
//             setCurrentStep((prev) => prev + 1);
//         }
//     };

//     return (
//         <div className="p-3 min-h-screen">

//             <h2 className="text-green-800 font-bold mt-1 text-lg">PRELIMINARY HEARING</h2>

//             <div className="grid grid-cols-2 gap-4 mt-4">
//                 <Documents />
//                 <Notes />
//                 <Schedule />
//                 <Messages />

//             </div>

//             <Card className="p-4 border w-[779px] mt-5 border-gray-300">
//                 <h3 className="text-green-800 text-lg font-semibold mb-3">Attach Files</h3>

//                 <FileUpload onFilesUploaded={handleFilesUploaded} />

//                 <div className="mt-4">
//                     <h3 className="text-lg font-semibold">Uploaded Files:</h3>
//                     {uploadedFiles.length > 0 ? (
//                         <ul className="list-disc ml-5">
//                             {uploadedFiles.map((file, index) => (
//                                 <li key={index} className="text-gray-700">{file.name}</li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-gray-500">No files uploaded.</p>
//                     )}
//                 </div>
//             </Card>

//             <button
//                 className={`mt-6 w-1/4 p-3 rounded-md ${currentStep < 7 ? "bg-green-600 text-white" : "bg-gray-500 text-gray-200"
//                     }`}
//                 onClick={handleNextStep}
//             >
//                 {currentStep < 7 ? "Complete" : "Finished"}
//             </button>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import { Documents } from "@/components/judge/cases/documents";
import { Notes } from "@/components/judge/cases/notes";
import { Messages } from "@/components/judge/cases/messages";
import { Schedule } from "@/components/judge/cases/schedule";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PreliminaryHearingProps {
    onProceed: () => void;
}

export default function PreliminaryHearing({ onProceed }: PreliminaryHearingProps) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [hearingDate, setHearingDate] = useState("");
    const [hearingTime, setHearingTime] = useState("");
    const [hearingDetails, setHearingDetails] = useState("");

    const handleFilesUploaded = (files: File[]) => {
        setUploadedFiles((prev) => [...prev, ...files]);
        console.log("Files uploaded:", files);
    };

    const handleComplete = () => {
        setShowDialog(true);
    };

    const handleDialogConfirm = () => {
        console.log("Scheduling next hearing:", {
            date: hearingDate,
            time: hearingTime,
            details: hearingDetails
        });
        console.log("Proceeding to next hearing...");
        setShowDialog(false);
        onProceed(); // Call the parent's proceed handler
    };

    return (
        <div className="p-2 min-h-[590px] h-auto">
            <h2 className="text-green-800 font-bold text-lg">PRELIMINARY HEARING</h2>
            <div className="mt-3">
                <Documents />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">

                <Notes />
                <Messages />
            </div>
            <div className="flex justify-end mt-4">
                <Button
                    onClick={handleComplete}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Complete
                </Button>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule Next Hearing</DialogTitle>
                        <DialogDescription>
                            Please provide details for the next hearing session.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hearing-date" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="hearing-date"
                                type="date"
                                className="col-span-3"
                                value={hearingDate}
                                onChange={(e) => setHearingDate(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hearing-time" className="text-right">
                                Time
                            </Label>
                            <Input
                                id="hearing-time"
                                type="time"
                                className="col-span-3"
                                value={hearingTime}
                                onChange={(e) => setHearingTime(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hearing-details" className="text-right">
                                Details
                            </Label>
                            <Textarea
                                id="hearing-details"
                                className="col-span-3"
                                value={hearingDetails}
                                onChange={(e) => setHearingDetails(e.target.value)}
                                placeholder="Enter hearing details..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDialogConfirm}>Proceed</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}