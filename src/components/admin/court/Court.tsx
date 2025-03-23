"use client";

import React, { useEffect, useState } from "react";
import { CustomCard, CustomCardContent } from "../../../components/common/CustomCardComponents";
import { ArrowUpRight, Scale, Landmark, Banknote, Home } from "lucide-react";

interface CourtData {
    id: number;
    title: string;
    count: number;
    percentage: string;
}

const CourtPage = () => {
    const [courtData, setCourtData] = useState<CourtData[]>([]);

    useEffect(() => {
        fetch("http://localhost:3002/courts")
            .then((response) => response.json())
            .then((data) => setCourtData(data))
            .catch((error) => console.error("Error fetching court data:", error));
    }, []);

    const icons = [Scale, Landmark, Banknote, Home];

    return (
        <div className="flex flex-col gap-y-0 w-full self-start max-w-[100%] md:max-w-[100vw] lg:max-w-[95vw]">
            <h2 className="font-heading text-primary font-semibold mb-0 self-start max-w-[90%] ml-4 md:max-w-5xl">
                Court
            </h2>

            {/* Large screen layout */}
            <div className="hidden md:flex flex-col gap-y-0 w-full max-w-[100%] md:max-w-screen-xl lg:max-w-screen-2xl">
                {courtData.length > 0 && (
                    <CustomCard className="bg-white shadow-md rounded-lg p-2 md:p-4 w-full">
                        <CustomCardContent className="flex flex-row justify-around items-center">
                            {courtData.slice(0, 4).map((court, index) => {
                                const IconComponent = icons[index % icons.length];
                                return (
                                    <div
                                        key={court.id}
                                        className={`flex items-center flex-1 px-4 md:px-8 ${index !== 3 ? "border-r border-gray-300" : ""}`}
                                    >
                                        {/* Green Circular Icon */}
                                        <div className="flex items-center justify-center bg-green-800 text-white p-3 md:p-4 rounded-full w-14 h-14 md:w-16 md:h-16">
                                            <IconComponent className="w-7 h-7 md:w-8 md:h-8" />
                                        </div>

                                        {/* Text Content */}
                                        <div className="ml-3 md:ml-4">
                                            <div className="font-body text-primary text-sm md:text-md">
                                                {court.title}
                                            </div>
                                            <div className="text-sm md:text-base font-semibold">{court.count}</div>
                                            <div className="flex items-center text-green-600 text-xs md:text-sm mt-1">
                                                <ArrowUpRight size={14} className="mr-1" />
                                                <span>{court.percentage} this month</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CustomCardContent>
                    </CustomCard>
                )}
            </div>

            {/* Small screen layout */}
            <div className="flex md:hidden flex-col gap-y-3 w-full max-w-[90%]">
                {courtData.map((court, index) => {
                    const IconComponent = icons[index % icons.length];
                    return (
                        <CustomCard key={court.id} className="bg-white shadow-md rounded-lg p-4 w-full">
                            <CustomCardContent className="flex items-center gap-x-4">
                                {/* Green Circular Icon */}
                                <div className="flex items-center justify-center bg-green-800 text-white p-3 rounded-full w-14 h-14">
                                    <IconComponent className="w-7 h-7" />
                                </div>

                                {/* Text Content */}
                                <div>
                                    <div className="text-gray-700 font-body text-sm">{court.title}</div>
                                    <div className="text-lg font-semibold">{court.count}</div>
                                    <div className="flex items-center text-green-600 text-xs mt-1">
                                        <ArrowUpRight size={14} className="mr-1" />
                                        <span>{court.percentage} this month</span>
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

export default CourtPage;
