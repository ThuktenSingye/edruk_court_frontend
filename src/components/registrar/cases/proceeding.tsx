"use client";

import React, { useState } from "react";
import Stepper from "@/components/judge/cases/stepper";
import Preliminary from "../../registrar/cases/proceedings/preliminaryHearing";
import RebutalOne from "../../registrar/cases/proceedings/rebutalOne";
import RebutalTwo from "../../registrar/cases/proceedings/rebutalTwo";
import RebutalThree from "../../registrar/cases/proceedings/rebutalThree";
import RebutalFour from "../../registrar/cases/proceedings/rebutalFour";
import Judgement from "../../registrar/cases/proceedings/judgement";

interface ProceedingProps {
    caseId: string;
}

export default function ProceedingPage({ caseId }: ProceedingProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 7;

    return (
        <div className="min-h-screen flex flex-col items-center p-8">
            <Stepper currentStep={currentStep} totalSteps={totalSteps} onStepClickAction={setCurrentStep} />

            <div className="mt-6 p-6 border rounded-lg w-3/4 bg-white shadow">
                {currentStep === 0 && <Preliminary caseId={caseId} />}
                {currentStep === 1 && <RebutalOne caseId={caseId} />}
                {currentStep === 2 && <RebutalTwo caseId={caseId} />}
                {currentStep === 3 && <RebutalThree caseId={caseId} />}
                {currentStep === 4 && <RebutalFour caseId={caseId} />}
                {currentStep === 5 && <Judgement caseId={caseId} />}
            </div>
        </div>
    );
}