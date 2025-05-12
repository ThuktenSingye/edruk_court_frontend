"use client";

import React, { useEffect, useState } from "react";
import { CustomCard, CustomCardContent } from "../../../components/common/CustomCardComponents";
import { Scale, Landmark, Banknote, Home } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface CourtData {
    supreme_court: number;
    high_court: number;
    dzongkhag_court: number;
    dungkhag_court: number;
    // percentage?: number; // Added optional percentage field
}

const CourtPage = () => {
    const [courtData, setCourtData] = useState<CourtData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const apiUrl = "http://localhost:3001/api/v1/admin/courts/statistics";

                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("data", data)
                setCourtData(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const courtStats = [
        {
            key: 'supreme_court',
            label: 'Supreme Court',
            icon: Scale,
            value: courtData?.supreme_court
        },
        {
            key: 'high_court',
            label: 'High Court',
            icon: Landmark,
            value: courtData?.high_court
        },
        {
            key: 'dzongkhag_court',
            label: 'Dzongkhag Court',
            icon: Banknote,
            value: courtData?.dzongkhag_court
        },
        {
            key: 'dungkhag_court',
            label: 'Dungkhag Court',
            icon: Home,
            value: courtData?.dungkhag_court
        }
    ];

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!courtData) return <div className="p-4">No data available</div>;

    return (
        <div className="flex flex-col gap-y-4 w-full max-w-screen-xl mx-auto p-4">
            <h2 className="text-2xl font-semibold text-primary">
                Court Statistics
            </h2>

            {/* Large screen layout */}
            <div className="hidden md:block">
                <CustomCard className="bg-white shadow-md rounded-lg h-100">
                    <CustomCardContent className="grid grid-cols-4 gap-4 p-4">
                        {courtStats.map((stat, index) => (
                            <div
                                key={stat.key}
                                className={`flex items-center ${index !== 3 ? "border-r border-gray-200" : ""}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center bg-green-800 text-white p-3 rounded-full">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                        <div className="text-lg font-semibold">{stat.value ?? 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CustomCardContent>
                </CustomCard>
            </div>

            {/* Small screen layout */}
            <div className="md:hidden space-y-4">
                {courtStats.map((stat) => (
                    <CustomCard key={stat.key} className="bg-white shadow-md rounded-lg">
                        <CustomCardContent className="flex items-center gap-4 p-4">
                            <div className="flex items-center justify-center bg-green-800 text-white p-3 rounded-full">
                                <stat.icon className="w-10 h-10" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                                <div className="text-lg font-semibold">{stat.value ?? 'N/A'}</div>
                            </div>
                        </CustomCardContent>
                    </CustomCard>
                ))}
            </div>
        </div>
    );
};

export default CourtPage;