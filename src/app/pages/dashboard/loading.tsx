import React from "react";
import { CaseStatisticsSkeleton } from "@/components/common/dashboard/CaseStatisticsSkeleton";
import { CaseTableSkeleton } from "@/components/common/dashboard/CaseTableSkeleton";
import { ReminderSectionSkeleton } from "@/components/common/dashboard/ReminderSectionSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Fixed Navbar Skeleton */}
            <div className="fixed top-0 left-64 right-0 z-50 w-full md:w-[1265px] sm:w-[500px] h-16 bg-gray-200 animate-pulse"></div>

            <div className="flex flex-row">
                {/* Sidebar Skeleton */}
                <div className="w-64 flex-shrink-0 h-screen bg-gray-100 animate-pulse"></div>

                {/* Main Content Area Skeleton */}
                <div className="flex-1 flex flex-col mt-[65px]">
                    <main className="flex-1 container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:space-x-4 w-full">
                            <CaseStatisticsSkeleton />
                            <ReminderSectionSkeleton />
                        </div>

                        <div className="mt-1 ml-4">
                            <CaseTableSkeleton userRole={null} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}