"use client";
import React, { Suspense } from "react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import Sidebar from "@/components/registrar/Sidebar";
import CaseStatistics from "@/components/common/dashboard/CaseStatistics";
import CaseTable from "@/components/common/dashboard/CaseTable";
import ReminderSection from "@/components/common/dashboard/ReminderSection";
import Navbar from "@/components/registrar/Navbar";

const Dashboard = () => {
    const { userRole } = useLoginStore(); // Get user role

    return (
        <div className="min-h-screen flex flex-col">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-64 right-0 z-50 w-full md:w-[1265px] sm:w-[500px]">
                <Navbar />
            </div>

            <div className="flex flex-row">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0">
                    <Sidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col mt-[65px]">
                    <main className="flex-1 container mx-auto px-4 py-6">
                        <div className="flex flex-col md:flex-row md:space-x-4 w-full">
                            <Suspense fallback={<div className="w-full"><CaseStatistics /></div>}>
                                <CaseStatistics />
                            </Suspense>
                            <div className="w-full md:w-auto">
                                <Suspense fallback={<ReminderSection />}>
                                    <ReminderSection />
                                </Suspense>
                            </div>
                        </div>

                        <div className="mt-1 ml-4">
                            {/* Pass user role to CaseTable */}
                            <Suspense fallback={<CaseTable userRole={userRole} />}>
                                <CaseTable userRole={userRole} />
                            </Suspense>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;