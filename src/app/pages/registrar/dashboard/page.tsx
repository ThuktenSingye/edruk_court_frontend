import React from "react";
import CaseStatistics from "@/components/common/dashboard/CaseStatistics";
import CaseTable from "@/components/registrar/dashboard/CaseTable";
import ReminderSection from "@/components/common/dashboard/ReminderSection";

const Dashboard = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content Area */}
            <main className="flex-1 container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row md:space-x-4 w-full">
                    <CaseStatistics />

                    <div className="w-full md:w-auto">
                        <ReminderSection />
                    </div>
                </div>

                <div className="mt-1 ml-4">
                    <CaseTable />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
