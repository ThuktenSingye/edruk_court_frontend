import React from "react";
import ClerkTable from "../../../../components/admin/clerk/clerkTable"; // Adjust the path as needed

const JudgePage = () => {
    return (
        <div className="p-6 flex flex-col space-y-6"> {/* Flex container for vertical alignment */}
            <ClerkTable /> {/* Rendering the CourtTable component */}
        </div>
    );
};

export default JudgePage;
