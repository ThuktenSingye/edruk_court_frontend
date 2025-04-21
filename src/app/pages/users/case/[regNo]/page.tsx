import Buttons from "@/components/registrar/cases/Buttons";

export default async function CaseDetails({ params }: { params: { regNo: string } }) {
    const caseId = params.regNo;

    return (
        <div className="space-y-4">
            {/* You can also pass caseId to CaseInfo if needed */}
            <Buttons caseId={caseId} hearingId={""} caseDetails={undefined} hearings={[]} />
        </div>
    );
}
