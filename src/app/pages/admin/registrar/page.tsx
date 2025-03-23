import React from "react";
import RegistrarTable from "../../../../components/admin/registrar/registrarTable"; // Adjust the path as needed

const CourtPage = () => {
    return (
        <div className="p-6 flex flex-col space-y-6"> {/* Flex container for vertical alignment */}
            <RegistrarTable /> {/* Rendering the CourtTable component */}
        </div>
    );
};

export default CourtPage;
