"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { File, Lock } from "lucide-react";
import CaseInfo from "@/components/registrar/cases/CaseInfo";
import Plaintiff from "@/components/registrar/cases/plantiff";
import Witness from "@/components/registrar/cases/witness";
import ProceedingJudge from "@/components/judge/cases/proceeding";
import MislleaneousHearing from "@/components/registrar/cases/mislleaneousHearing";
import ProceedingRegistrar from "@/components/registrar/cases/proceeding";
import CaseDocs from "@/components/registrar/cases/CaseDocs";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface ButtonsProps {
    caseId: string;
}

interface ChildComponentProps {
    caseId: string;
}

// Define interfaces for each component
interface CaseInfoProps extends ChildComponentProps { }
interface PlaintiffProps extends ChildComponentProps { }
interface WitnessProps extends ChildComponentProps { }
interface ProceedingJudgeProps extends ChildComponentProps { }
interface ProceedingRegistrarProps extends ChildComponentProps { }
interface MislleaneousHearingProps extends ChildComponentProps { }
interface CaseDocsProps extends ChildComponentProps { }

export default function ProfileButtons({ caseId }: ButtonsProps) {
    const [activeSection, setActiveSection] = useState("caseInfo");
    const userRole = useLoginStore((state) => state.userRole);

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

                <Button
                    className={`w-32 flex items-center gap-2 ${activeSection === "casedocs" ? "bg-primary-normal" : "bg-gray-300"
                        } text-white`}
                    onClick={() => setActiveSection("casedocs")}
                >
                    <Lock className="h-4 w-4" />
                    Case Docs
                </Button>
            </div>

            {/* Section Content */}
            <div className="p-4">
                {activeSection === "caseInfo" && <CaseInfo caseId={caseId} />}

                {activeSection === "proceeding" && userRole === "Registrar" && <ProceedingRegistrar caseId={caseId} />}
                {activeSection === "proceeding" && (userRole === "Judge" || userRole === "Clerk") && <ProceedingJudge caseId={caseId} />}

                {activeSection === "plaintiff" && <Plaintiff caseId={caseId} />}
                {activeSection === "witness" && <Witness caseId={caseId} />}
                {activeSection === "mislleaneousHearing" && <MislleaneousHearing caseId={caseId} />}
                {activeSection === "casedocs" && <CaseDocs caseId={caseId} />}
            </div>
        </div>
    );
}