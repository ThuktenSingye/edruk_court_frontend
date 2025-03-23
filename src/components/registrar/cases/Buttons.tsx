"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { File, Lock } from "lucide-react";
import CaseInfo from "@/components/registrar/cases/CaseInfo";
import Plaintiff from "@/components/registrar/cases/plantiff";
import Witness from "@/components/registrar/cases/witness";
import Proceeding from "@/components/registrar/cases/proceeding";
import MislleaneousHearing from "@/components/registrar/cases/mislleaneousHearing";


export default function ProfileButtons() {
    const [activeSection, setActiveSection] = useState("caseInfo");

    return (
        <div>
            {/* Buttons Navigation */}
            <div className="flex flex-row justify-start gap-4 py-4 border-b gap-x-7 border-gray-300">
                {/* Case Info Button */}
                <Button
                    className={`w-32 flex items-center gap-2 ${activeSection === "caseInfo" ? "bg-primary-normal" : "bg-gray-300"
                        } text-white`}
                    onClick={() => setActiveSection("caseInfo")}
                >
                    <File className="h-4 w-4" />
                    Case Info
                </Button>

                <Button
                    className={`w-32 flex items-center gap-2 ${activeSection === "mislleaneousHearing" ? "bg-primary-normal" : "bg-gray-300"
                        } text-white`}
                    onClick={() => setActiveSection("mislleaneousHearing")}
                >
                    <File className="h-4 w-4" />
                    <span className="truncate"> Miscellaneous Hearing</span>
                </Button>

                {/* Proceeding Button */}
                <Button
                    className={`w-32 flex items-center gap-2 ${activeSection === "proceeding" ? "bg-primary-normal" : "bg-gray-300"
                        } text-white`}
                    onClick={() => setActiveSection("proceeding")}
                >
                    <Lock className="h-4 w-4" />
                    Proceeding
                </Button>

                {/* Plaintiff Button */}
                <Button
                    className={`w-32 flex items-center gap-2 ${activeSection === "plaintiff" ? "bg-primary-normal" : "bg-gray-300"
                        } text-white`}
                    onClick={() => setActiveSection("plaintiff")}
                >
                    <Lock className="h-4 w-4" />
                    Plaintiff
                </Button>

                {/* Witness Button */}
                <Button
                    className={`w-32 flex items-center gap-2 ${activeSection === "witness" ? "bg-primary-normal" : "bg-gray-300"
                        } text-white`}
                    onClick={() => setActiveSection("witness")}
                >
                    <Lock className="h-4 w-4" />
                    Witness
                </Button>
            </div>

            {/* Section Content */}
            <div className="p-4">
                {activeSection === "caseInfo" && <CaseInfo />}
                {activeSection === "proceeding" && <Proceeding />}
                {activeSection === "plaintiff" && <Plaintiff />}
                {activeSection === "witness" && <Witness />}
                {activeSection === "mislleaneousHearing" && <MislleaneousHearing />}
            </div>
        </div>
    );
}