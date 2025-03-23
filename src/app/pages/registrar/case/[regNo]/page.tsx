// src/pages/cases/[regNo].tsx

import ProfileButtons from "@/components/judge/cases/Buttons";
// import { useRouter } from "next/router";

const CaseInfoPage = () => {
    // const router = useRouter();
    // const { regNo } = router.query; // Get the case regNo from the URL

    return (
        <div>
            {/* <h1>Case Details: {regNo}</h1> */}
            <ProfileButtons /> {/* Use ProfileButtons component */}
        </div>
    );
};

export default CaseInfoPage;
