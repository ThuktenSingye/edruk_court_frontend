"use client";

import React, { useState } from "react";
import Stepper from "@/components/registrar/cases/stepper";
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
            <h2 className="text-xl font-semibold mb-6">Proceeding</h2>

            {/* Stepper Navigation */}
            <Stepper currentStep={currentStep} totalSteps={totalSteps} onStepClickAction={setCurrentStep} />

            {/* Content Based on Step */}
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