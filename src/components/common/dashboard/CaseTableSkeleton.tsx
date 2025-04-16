"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const CaseTableSkeleton = ({ userRole }: { userRole: string | null }) => {
    // Determine column count based on user role
    const columnCount = userRole === "Judge" || userRole === "Clerk" ? 10 : 7;
    const rowCount = 5; // Matches default pageSize

    return (
        <div className="ml-[-16px] p-4">
            {/* Header and Filters */}
            <div className="mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                        <Skeleton className="h-10 w-full sm:w-48" />
                        <Skeleton className="h-10 w-full sm:w-32" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="w-full border border-gray-300 rounded-md">
                {/* Table Header */}
                <div className="flex border-b">
                    {Array.from({ length: columnCount }).map((_, i) => (
                        <div key={`header-${i}`} className="flex-1 px-4 py-3">
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </div>

                {/* Table Rows */}
                {Array.from({ length: rowCount }).map((_, rowIdx) => (
                    <div key={`row-${rowIdx}`} className="flex border-b">
                        {Array.from({ length: columnCount }).map((_, colIdx) => (
                            <div key={`cell-${rowIdx}-${colIdx}`} className="flex-1 px-4 py-3">
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
                <div className="flex items-center">
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>
        </div>
    );
};