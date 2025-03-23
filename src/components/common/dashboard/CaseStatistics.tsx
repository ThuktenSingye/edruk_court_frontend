"use client";
import React from "react";
import { CustomCard, CustomCardContent } from "../CustomCardComponents";
import { ArrowUpRight, Users, Scale, Gavel, Briefcase, ShieldCheck, FileText } from "lucide-react";
import useFetch from "../../../app/hooks/usefetchDashboard";

const iconMap: Record<string, React.ElementType> = {
    "Total Cases": Scale,
    "Civil Case": Users,
    "Criminal Cases": Gavel,
    "Pending Cases": Briefcase,
    "Resolved Cases": ShieldCheck,
    "Appealed Cases": FileText,
};

interface CaseStat {
    id: number;
    title: string;
    count: string;
    growth: string;
}

const CaseStatistics = () => {
    const { data: caseData } = useFetch<CaseStat[]>("http://localhost:3002/caseStatistics", []);

    return (
        <div className="flex flex-col gap-y-0 w-full self-start max-w-[90%] md:max-w-5xl">
            <h2 className="font-heading text-primary font-semibold mb-0 self-start max-w-[90%] ml-4 md:max-w-5xl">
                Case Statistics
            </h2>

            {/* Large screen layout */}
            <div className="hidden md:flex flex-col gap-y-0 w-full max-w-[90%] md:max-w-5xl">
                {caseData.length > 0 &&
                    [caseData.slice(0, 3), caseData.slice(3, 6)].map((group, i) => (
                        <CustomCard key={i} className="bg-white shadow-md rounded-lg p-2 md:p-4 w-full">
                            <CustomCardContent className="flex flex-row mr-15 justify-around items-center">
                                {group.map((data, index) => {
                                    const IconComponent = iconMap[data.title];
                                    return (
                                        <div
                                            key={data.id}
                                            className={`flex items-center flex-1 px-4 md:px-4 ${index !== group.length - 1 ? "border-r border-gray-300" : ""
                                                }`}
                                        >
                                            {/* Green Circular Icon */}
                                            <div className="flex items-center justify-center bg-green-800 text-white p-3 md:p-4 rounded-full w-14 h-14 md:w-16 md:h-16">
                                                {IconComponent && <IconComponent className="w-7 h-7 md:w-8 md:h-8" />}
                                            </div>

                                            {/* Text Content */}
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

            {/* Small screen layout */}
            <div className="flex md:hidden flex-col gap-y-3 w-full max-w-[90%]">
                {caseData.map((data) => {
                    const IconComponent = iconMap[data.title];
                    return (
                        <CustomCard key={data.id} className="bg-white shadow-md rounded-lg p-4 w-full">
                            <CustomCardContent className="flex items-center gap-x-4">
                                {/* Green Circular Icon */}
                                <div className="flex items-center justify-center bg-green-800 text-white p-3 rounded-full w-14 h-14">
                                    {IconComponent && <IconComponent className="w-7 h-7" />}
                                </div>

                                {/* Text Content */}
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
    );
};

export default CaseStatistics;
