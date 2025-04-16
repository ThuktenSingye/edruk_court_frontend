import CaseInfo from "@/components/registrar/cases/CaseInfo";
import Buttons from "@/components/registrar/cases/Buttons";

export default function CaseDetails({ params }: { params: { regNo: string } }) {
    return (
        <div className="space-y-4">
            <Buttons caseId={params.regNo} />
        </div>
    );
}
