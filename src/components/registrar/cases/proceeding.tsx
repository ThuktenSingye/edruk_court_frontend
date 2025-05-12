"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Hearings from "@/components/registrar/cases/Hearings";
import { useHearingStore } from "@/app/hooks/useHearingStore";

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

interface ProceedingPageProps {
    caseId: string;
    hearingId: string;
    hearings: Hearing[];
    caseDocuments?: any[];
}

export default function ProceedingPage({
    caseId,
    hearingId,
    hearings: initialHearings,
    caseDocuments = [],
}: ProceedingPageProps) {
    const [selectedHearingId, setSelectedHearingId] = useState(hearingId);
    const { hearings, setHearings } = useHearingStore();

    useEffect(() => {
        // Initialize hearings in the store if they're not already set
        if (initialHearings && initialHearings.length > 0) {
            setHearings(initialHearings);
        }
    }, [initialHearings, setHearings]);

    const handleTabClick = (id: string) => {
        setSelectedHearingId(id);
    };

    const selectedHearing = hearings.find(
        (hearing) => hearing.id.toString() === selectedHearingId
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-1/4 h-full p-6 bg-white border-r border-gray-200 overflow-y-auto">
                <h2 className="text-2xl font-semibold text-green-700 mb-6">Hearings</h2>
                <div className="space-y-3">
                    {hearings.map((hearing) => (
                        <div
                            key={hearing.id}
                            className={`cursor-pointer rounded-lg p-4 transition-all border ${hearing.id.toString() === selectedHearingId
                                ? "bg-green-100 border-l-4 border-green-500"
                                : "hover:bg-gray-100 border-gray-200"
                                }`}
                            onClick={() => handleTabClick(hearing.id.toString())}
                        >
                            <h3 className="text-lg font-medium">{hearing.hearing_type}</h3>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 -mt-4">
                <Hearings
                    selectedHearingId={selectedHearingId}
                    hearings={hearings}
                    caseId={caseId}
                    caseDocuments={caseDocuments}
                />
            </main>
        </div>
    );
}
