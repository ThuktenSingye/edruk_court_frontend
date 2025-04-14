import React from "react";

export const CaseStatisticsSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-0 w-full self-start max-w-[90%] md:max-w-5xl">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4 ml-4 animate-pulse"></div>

            {/* Desktop Skeleton */}
            <div className="hidden md:flex flex-col gap-y-4 w-full max-w-[90%] md:max-w-5xl">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white shadow-md rounded-lg p-4 w-full">
                        <div className="flex flex-row justify-around items-center">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="flex items-center flex-1 px-4">
                                    <div className="bg-gray-200 rounded-full w-16 h-16 animate-pulse"></div>
                                    <div className="ml-4 space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Skeleton */}
            <div className="flex md:hidden flex-col gap-y-3 w-full max-w-[90%]">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white shadow-md rounded-lg p-4 w-full">
                        <div className="flex items-center gap-x-4">
                            <div className="bg-gray-200 rounded-full w-14 h-14 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};