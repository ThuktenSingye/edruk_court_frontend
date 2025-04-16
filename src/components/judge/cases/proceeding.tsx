"use client";

import React, { useState } from "react";
import Stepper from "@/components/registrar/cases/stepper";
import Preliminary from "./proceedings/preliminaryHearing";
import RebutalOne from "../../judge/cases/proceedings/rebutalOne";
import Judgement from "../../registrar/cases/proceedings/judgement";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface ProceedingJudgeProps {
    caseId: string;
}

export default function ProceedingPage({ caseId }: ProceedingJudgeProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [maxAvailableStep, setMaxAvailableStep] = useState(0);
    const { token } = useLoginStore();

    const handleAddStep = () => {
        const newStep = maxAvailableStep + 1;
        setMaxAvailableStep(newStep);
        setCurrentStep(newStep);
    };

    // Define all possible step components
    const stepComponents = [
        <Preliminary caseId={caseId} onProceed={handleAddStep} />,
        <RebutalOne caseId={caseId} onProceed={handleAddStep} title={"REBUTAL ONE"} />,
        // <RebutalTwo caseId={caseId} onProceed={handleAddStep} />,
        // <RebutalThree caseId={caseId} onProceed={handleAddStep} />,
        // <RebutalFour caseId={caseId} onProceed={handleAddStep} />,
        // <Judgement caseId={caseId} onProceed={handleAddStep} />,
    ];

    // For steps beyond the predefined ones, show RebutalOne with incremented heading
    const renderStepContent = (stepIndex: number) => {
        if (stepIndex < stepComponents.length) {
            return stepComponents[stepIndex];
        }

        // Create the title based on step number
        const rebuttalNumber = stepIndex + 0;
        const title = `REBUTTAL ${rebuttalNumberToText(rebuttalNumber).toUpperCase()}`;

        return <RebutalOne caseId={caseId} onProceed={handleAddStep} title={title} />;
    };

    // Helper function to convert number to text (1 -> One, 2 -> Two, etc.)
    const rebuttalNumberToText = (num: number): string => {
        const numberTexts = [
            'One', 'Two', 'Three', 'Four', 'Five',
            'Six', 'Seven', 'Eight', 'Nine', 'Ten',
            'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'
        ];
        return numberTexts[num - 1] || num.toString();
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-5">
            <Stepper
                currentStep={currentStep}
                totalSteps={maxAvailableStep + 1}
                onStepClickAction={(step) => {
                    if (step <= maxAvailableStep) {
                        setCurrentStep(step);
                    }
                }}
            />

            <div className="mt-4 p-6 border rounded-lg w-3/4 bg-white shadow">
                {renderStepContent(currentStep)}
            </div>
        </div>
    );
}