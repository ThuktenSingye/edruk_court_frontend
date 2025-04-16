"use client";
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

interface RebutalFourProps {
    caseId: string;
    onProceed?: () => void;
    title?: string;
}

export default function RebutalFour({ caseId, onProceed, title = "REBUTTAL FOUR" }: RebutalFourProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchRebuttalData = async () => {
            try {
                const response = await fetch(`http://nganglam.lvh.me:3001/api/v1/cases/${caseId}/rebuttal/4`, {
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
                    setError("Failed to fetch rebuttal data");
                }
            } catch (err) {
                setError("An error occurred while fetching rebuttal data");
            } finally {
                setLoading(false);
            }
        };

        if (caseId) {
            fetchRebuttalData();
        }
    }, [caseId, token]);

    if (loading) return <p className="text-center text-gray-600">Loading rebuttal data...</p>;
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
                <Schedule caseId={caseId} />
                <div className="col-span-2">
                    <Messages caseId={caseId} />
                </div>
            </div>
        </div>
    );
}
