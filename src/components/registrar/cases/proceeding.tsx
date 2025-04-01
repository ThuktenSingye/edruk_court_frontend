"use client";

import React, { useState } from "react";
import Stepper from "@/components/judge/cases/stepper";
import Preliminary from "../../registrar/cases/proceedings/preliminaryHearing";
import RebutalOne from "../../registrar/cases/proceedings/rebutalOne";
import RebutalTwo from "../../registrar/cases/proceedings/rebutalTwo";
import RebutalThree from "../../registrar/cases/proceedings/rebutalThree";
import RebutalFour from "../../registrar/cases/proceedings/rebutalFour";
import Judgement from "../../registrar/cases/proceedings/judgement";

export default function ProceedingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 7;

    return (
        <div className="min-h-screen flex flex-col items-center p-8">
            <Stepper currentStep={currentStep} totalSteps={totalSteps} onStepClickAction={setCurrentStep} />

            <div className="mt-6 p-6 border rounded-lg w-3/4 bg-white shadow">
                {currentStep === 0 && <Preliminary />}
                {currentStep === 1 && <RebutalOne />}
                {currentStep === 2 && <RebutalTwo />}
                {currentStep === 3 && <RebutalThree />}
                {currentStep === 4 && <RebutalFour />}
                {currentStep === 5 && <Judgement />}

            </div>
        </div>
    );
}