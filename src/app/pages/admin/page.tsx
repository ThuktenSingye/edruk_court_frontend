import React from "react";
import Court from "../../../components/admin/court/Court"; // Adjust the path based on your project structure
import CourtTable from "../../../components/admin/court/CourtTable"; // Adjust the path as needed

const CourtPage = () => {
    return (
        <div className="p-6 flex flex-col space-y-6"> {/* Flex container for vertical alignment */}
            <Court />
            <CourtTable /> {/* Rendering the CourtTable component */}
        </div>
    );
};

export default CourtPage;
