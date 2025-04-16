import React from "react";
import JudgeTable from "../../../../components/admin/judge/judgeTable";

const JudgePage = () => {
    return (
        <div className="p-6 flex flex-col space-y-6"> {/* Flex container for vertical alignment */}
            <JudgeTable /> {/* Rendering the CourtTable component */}
        </div>
    );
};

export default JudgePage;
