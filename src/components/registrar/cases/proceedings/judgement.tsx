"use client"; // ✅ This makes it a client component

import { Button } from "@/components/ui/button";
import { Notes } from "@/components/registrar/cases/notes";
import { Defendent } from "@/components/registrar/cases/DefendentDocument";
import { Plantiff } from "@/components/registrar/cases/PlantiffDocument";
import { Messages } from "@/components/registrar/cases/messages";
import { Schedule } from "@/components/registrar/cases/schedule";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { useEffect, useState } from "react";

interface Note {
    id: number;
    text: string;
    timestamp: string;
}

interface Schedule {
    id: number;
    text: string;
    timestamp: string;
}

interface JudgementProps {
    caseId: string;
    onProceed?: () => void;
    title?: string;
}

export default function Judgement({ caseId, onProceed, title = "JUDGEMENT" }: JudgementProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchJudgementData = async () => {
            try {
                const response = await fetch(`http://nganglam.lvh.me:3001/api/v1/cases/${caseId}/judgement`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok && data.status === "ok") {
                    // Handle the fetched data here
                    // You might want to pass this data to child components
                } else {
                    setError("Failed to fetch judgement data");
                }
            } catch (err) {
                setError("An error occurred while fetching judgement data");
            } finally {
                setLoading(false);
            }
        };

        if (caseId) {
            fetchJudgementData();
        }
    }, [caseId, token]);

    if (loading) return <p className="text-center text-gray-600">Loading judgement data...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-3">
            <div className="flex justify-between items-center">
                <h2 className="text-green-700 font-semibold text-lg">{title}</h2>
                {onProceed && (
                    <Button
                        onClick={onProceed}
                        className="bg-green-700 text-white"
                    >
                        Proceed to Next
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Defendent caseId={caseId} />
                <Plantiff caseId={caseId} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Notes caseId={caseId} />
                <Messages caseId={caseId} />
                <div className="col-span-2">
                    <Schedule caseId={caseId} />
                </div>
            </div>
        </div>
    );
}



