import React from "react";

export const ReminderSectionSkeleton = () => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md space-y-4 mt-6 
      w-[308px] ml-[30px] h-[267px]
      sm:w-[485px] sm:ml-[20px] sm:mr-0  
      md:w-[700px] md:ml-[60px] md:mr-4  
      lg:w-[400px] lg:ml-[40px] lg:mr-4 lg:mt-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            <div className="min-h-[195px] max-h-[192px] space-y-3 w-full">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center space-x-2">
                            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="space-y-1">
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};