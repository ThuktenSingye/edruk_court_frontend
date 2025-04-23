"use client";

import { useEffect, useState } from "react";
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
import { useHearingStore } from "@/app/hooks/useHearingStore";

interface Case {
    id: string;
    title: string;
    description: string;
    status: "Active" | "Urgent" | "Enforcement" | "Appeal";
    regNo: number;
    regDate: string;
    plaintiff: string;
    cidNo: string;
    caseTitle: string;
    types: string;
    bench: string;
    benchClerk: string;
    nature: string;
    severity?: string;
    appeal?: string;
    enforcement?: string;
    summary?: string;
    documents?: { visible: boolean; id: number; name: string; date: string; url: string }[];
}

interface Hearing {
    id: number;
    hearing_status: string;
    hearing_type: string;
    schedules: {
        id: number;
        scheduled_date: string;
        schedule_status: string;
        scheduled_by: number;
    }[];
}

interface CaseInfoProps {
    caseId: string;
    hearingId: string;
    caseDetails: Case;
    hearings: Hearing[];
}

export default function ProfileButtons({ caseId, hearingId }: CaseInfoProps) {
    const [activeSection, setActiveSection] = useState("caseInfo");
    const { userRole, token } = useLoginStore();
    const [caseDetails, setCaseDetails] = useState<Case | null>(null);
    const [hearings, setHearings] = useState<Hearing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { setHearings: setHearingStore } = useHearingStore();

    useEffect(() => {
        const fetchCaseData = async () => {
            try {

                const host = window.location.hostname;

                const [caseRes, hearingRes] = await Promise.all([
                    fetch(`http://${host}:3001/api/v1/cases/${caseId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                    fetch(`http://${host}:3001/api/v1/cases/${caseId}/hearings`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                const caseData = await caseRes.json();
                const hearingData = await hearingRes.json();

                if (caseRes.ok && caseData.status === "ok") {
                    setCaseDetails(caseData.data);
                } else {
                    setError("Case not found");
                }

                if (hearingRes.ok && hearingData.status === "ok") {
                    setHearings(hearingData.data);
                    setHearingStore(hearingData.data);
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCaseData();
    }, [caseId, token]);

    if (loading) return <p>Loading...</p>;
    if (error || !caseDetails) return <p className="text-red-500">{error || "No case data."}</p>;

    return (
        <div>
            {/* Tabs */}
            <div className="flex flex-row justify-start gap-4 py-4 border-b gap-x-7 border-gray-300">
                {[
                    ["caseInfo", "Case Info"],
                    ["proceeding", "Proceeding"],
                    ["plaintiff", "Plaintiff"],
                    ["witness", "Witness"],
                    ["casedocs", "Case Docs"],
                ].map(([key, label]) => (
                    <Button
                        key={key}
                        className={`w-32 flex items-center gap-2 ${activeSection === key ? "bg-primary-normal" : "bg-gray-300"
                            } text-white`}
                        onClick={() => setActiveSection(key)}
                    >
                        <File className="h-4 w-4" />
                        {label}
                    </Button>
                ))}
            </div>

            {/* Section Content */}
            <div className="p-4">
                {activeSection === "caseInfo" && (
                    <CaseInfo caseId={caseId} hearingId={hearingId} caseDetails={caseDetails} hearings={hearings} />
                )}
                {activeSection === "proceeding" && (<ProceedingRegistrar caseId={caseId} hearingId={hearingId} caseDetails={caseDetails} hearings={hearings} />)}
                {/* {activeSection === "proceeding" && (userRole === "Judge" || userRole === "Clerk") && (
                    <ProceedingJudge caseId={caseId} />
                )} */}
                {activeSection === "plaintiff" && <Plaintiff caseId={caseId} />}
                {activeSection === "witness" && <Witness caseId={caseId} />}
                {activeSection === "casedocs" && <CaseDocs caseId={caseId} hearingId={hearingId} />
                }
            </div>
        </div>
    );
}
