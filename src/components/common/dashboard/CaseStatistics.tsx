"use client";
import React, { Suspense, useEffect, useState } from "react";
import { CustomCard, CustomCardContent } from "../CustomCardComponents";
import { ArrowUpRight, Users, Scale, Gavel, Briefcase, ShieldCheck, FileText } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { CaseStatisticsSkeleton } from "./CaseStatisticsSkeleton";

const iconMap: Record<string, React.ElementType> = {
    "Total Cases": Scale,
    "Civil Case": Users,
    "Criminal Cases": Gavel,
    "Pending Cases": Briefcase,
    "Resolved Cases": ShieldCheck,
    "Appealed Cases": FileText,
};

const CaseStatistics = () => {
    const { token, checkAuth } = useLoginStore();
    const [caseData, setCaseData] = useState({
        total: 0,
        civil: 0,
        criminal: 0,
        others: 0,
        active: 0,
        decided: 0,
        appeal: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isAuthenticated = checkAuth();
        if (!isAuthenticated) {
            setError("Authentication required");
            setLoading(false);
            return;
        }

        const fetchCaseData = async () => {
            try {
                const currentToken = useLoginStore.getState().token;
                if (!currentToken) {
                    setError("Authentication required");
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://nganglam.lvh.me:3001/api/v1/cases/statistics", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log(result); // Check the response structure

                // Directly access result.data instead of result.data.data.attributes
                if (!result || !result.data) {
                    setError("Invalid data format received");
                    setLoading(false);
                    return;
                }

                setCaseData(result.data); // Set case data directly
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchCaseData();
    }, [checkAuth]);

    if (loading) {
        return <CaseStatisticsSkeleton />;
    }
    if (error) return <p>Error: {error}</p>;

    const formattedData = [
        { title: "Total Cases", count: caseData.total, growth: "N/A" },
        { title: "Civil Case", count: caseData.civil, growth: "N/A" },
        { title: "Criminal Cases", count: caseData.criminal, growth: "N/A" },
        { title: "Pending Cases", count: caseData.active, growth: "N/A" },
        { title: "Resolved Cases", count: caseData.decided, growth: "N/A" },
        { title: "Appealed Cases", count: caseData.appeal, growth: "N/A" }
    ];

    return (
        <Suspense fallback={<CaseStatisticsSkeleton />}>
            <div className="flex flex-col gap-y-0 w-full self-start max-w-[90%] md:max-w-5xl">
                <h2 className="font-heading text-primary font-semibold mb-0 self-start max-w-[90%] ml-4 md:max-w-5xl">
                    Case Statistics
                </h2>

                <div className="hidden md:flex flex-col gap-y-0 w-full max-w-[90%] md:max-w-5xl">
                    {formattedData.length > 0 &&
                        [formattedData.slice(0, 3), formattedData.slice(3, 6)].map((group, i) => (
                            <CustomCard key={i} className="bg-white shadow-md rounded-lg p-2 md:p-4 w-full">
                                <CustomCardContent className="flex flex-row mr-15 justify-around items-center">
                                    {group.map((data, index) => {
                                        const IconComponent = iconMap[data.title];
                                        return (
                                            <div
                                                key={data.title}
                                                className={`flex items-center flex-1 px-4 md:px-4 ${index !== group.length - 1 ? "border-r border-gray-300" : ""}`}
                                            >
                                                <div className="flex items-center justify-center bg-green-800 text-white p-3 md:p-4 rounded-full w-14 h-14 md:w-16 md:h-16">
                                                    {IconComponent && <IconComponent className="w-7 h-7 md:w-8 md:h-8" />}
                                                </div>

                                                <div className="ml-9 md:ml-4">
                                                    <div className="font-body text-primary text-sm md:text-sm">
                                                        {data.title}
                                                    </div>
                                                    <div className="text-sm md:text-base font-semibold">{data.count}</div>
                                                    <div className="flex items-center text-green-600 text-xs md:text-sm mt-1">
                                                        <ArrowUpRight size={14} className="mr-1" />
                                                        <span className="text-sm">{data.growth} this month</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CustomCardContent>
                            </CustomCard>
                        ))}
                </div>

                <div className="flex md:hidden flex-col gap-y-3 w-full max-w-[90%]">
                    {formattedData.map((data) => {
                        const IconComponent = iconMap[data.title];
                        return (
                            <CustomCard key={data.title} className="bg-white shadow-md rounded-lg p-4 w-full">
                                <CustomCardContent className="flex items-center gap-x-4">
                                    <div className="flex items-center justify-center bg-green-800 text-white p-3 rounded-full w-14 h-14">
                                        {IconComponent && <IconComponent className="w-7 h-7" />}
                                    </div>

                                    <div>
                                        <div className="text-gray-700 font-body text-sm">{data.title}</div>
                                        <div className="text-lg font-semibold">{data.count}</div>
                                        <div className="flex items-center text-green-600 text-xs mt-1">
                                            <ArrowUpRight size={14} className="mr-1" />
                                            <span>{data.growth} this month</span>
                                        </div>
                                    </div>
                                </CustomCardContent>
                            </CustomCard>
                        );
                    })}
                </div>
            </div>
        </Suspense>
    );
};

export default CaseStatistics;