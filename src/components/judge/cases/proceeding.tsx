// // "use client";

// // import React, { useState } from "react";
// // import Stepper from "@/components/judge/cases/stepper";
// // import Preliminary from "../../judge/cases/proceedings/preliminaryHearing";
// // import RebutalOne from "../../judge/cases/proceedings/rebutalOne";
// // import RebutalTwo from "../../judge/cases/proceedings/rebutalTwo";
// // import RebutalThree from "../../judge/cases/proceedings/rebutalThree";
// // import RebutalFour from "../../judge/cases/proceedings/rebutalFour";
// // import Judgement from "../../judge/cases/proceedings/judgement";


// // export default function ProceedingPage() {
// //     const [currentStep, setCurrentStep] = useState(0);
// //     const totalSteps = 7;

// //     return (
// //         <div className="min-h-screen flex flex-col items-center p-8">
// //             <h2 className="text-xl font-semibold mb-6">Proceeding</h2>

// //             <Stepper currentStep={currentStep} totalSteps={totalSteps} onStepClickAction={setCurrentStep} />

// //             {/* Content Based on Step */}
// //             <div className="mt-6 p-6 border rounded-lg w-3/4 bg-white shadow">
// //                 {currentStep === 0 && <Preliminary />}
// //                 {currentStep === 1 && <RebutalOne />}
// //                 {currentStep === 2 && <RebutalTwo />}
// //                 {currentStep === 3 && <RebutalThree />}
// //                 {currentStep === 4 && <RebutalFour />}
// //                 {currentStep === 5 && <Judgement />}
// //             </div>
// //         </div>
// //     );
// // }

// "use client";

// import React, { useState } from "react";
// import Stepper from "@/components/registrar/cases/stepper";
// import Preliminary from "./proceedings/preliminaryHearing";
// import RebutalOne from "../../judge/cases/proceedings/rebutalOne";
// import RebutalTwo from "../../registrar/cases/proceedings/rebutalTwo";
// import RebutalThree from "../../registrar/cases/proceedings/rebutalThree";
// import RebutalFour from "../../registrar/cases/proceedings/rebutalFour";
// import Judgement from "../../registrar/cases/proceedings/judgement";

// export default function ProceedingPage() {
//     const [currentStep, setCurrentStep] = useState(0);
//     const [totalSteps, setTotalSteps] = useState(7);

//     const handleAddStep = () => {
//         setTotalSteps(prev => prev + 1);
//         setCurrentStep(totalSteps); // Move to the new step
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center p-5">
//             <Stepper currentStep={currentStep} totalSteps={totalSteps} onStepClickAction={setCurrentStep} />

//             <div className="mt-4 p-6 border rounded-lg w-3/4 bg-white shadow">
//                 {currentStep === 0 && <Preliminary onProceed={handleAddStep} />}
//                 {currentStep === 1 && <RebutalOne />}
//                 {currentStep === 2 && <RebutalTwo />}
//                 {currentStep === 3 && <RebutalThree />}
//                 {currentStep === 4 && <RebutalFour />}
//                 {currentStep === 5 && <Judgement />}
//             </div>
//         </div>
//     );
// }

// "use client";

// import React, { useState } from "react";
// import Stepper from "@/components/registrar/cases/stepper";
// import Preliminary from "./proceedings/preliminaryHearing";
// import RebutalOne from "../../judge/cases/proceedings/rebutalOne";
// import RebutalTwo from "../../judge/cases/proceedings/rebutalTwo";
// import RebutalThree from "../../registrar/cases/proceedings/rebutalThree";
// import RebutalFour from "../../registrar/cases/proceedings/rebutalFour";
// import Judgement from "../../registrar/cases/proceedings/judgement";

// export default function ProceedingPage() {
//     const [currentStep, setCurrentStep] = useState(0);
//     const [maxAvailableStep, setMaxAvailableStep] = useState(0); // Tracks the highest step reached

//     const handleAddStep = () => {
//         const newStep = maxAvailableStep + 1;
//         setMaxAvailableStep(newStep);
//         setCurrentStep(newStep);
//     };

//     // Define all possible step components
//     const stepComponents = [
//         <Preliminary onProceed={handleAddStep} />,
//         <RebutalOne onProceed={handleAddStep} />,
//         // <RebutalTwo onProceed={handleAddStep} />,
//         // <RebutalThree onProceed={handleAddStep} />,
//         // <RebutalFour onProceed={handleAddStep} />,
//         // <Judgement onProceed={handleAddStep} />,
//     ];

//     // For steps beyond the predefined ones, show RebutalOne component
//     const renderStepContent = (stepIndex: number) => {
//         if (stepIndex < stepComponents.length) {
//             return stepComponents[stepIndex];
//         }
//         return <RebutalOne onProceed={handleAddStep} />;
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center p-5">
//             <Stepper
//                 currentStep={currentStep}
//                 totalSteps={maxAvailableStep + 1} // Show total available steps
//                 onStepClickAction={(step) => {
//                     if (step <= maxAvailableStep) {
//                         setCurrentStep(step);
//                     }
//                 }}
//             />

//             <div className="mt-4 p-6 border rounded-lg w-3/4 bg-white shadow">
//                 {renderStepContent(currentStep)}
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useState } from "react";
import Stepper from "@/components/registrar/cases/stepper";
import Preliminary from "./proceedings/preliminaryHearing";
import RebutalOne from "../../judge/cases/proceedings/rebutalOne";
import Judgement from "../../registrar/cases/proceedings/judgement";

export default function ProceedingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [maxAvailableStep, setMaxAvailableStep] = useState(0);

    const handleAddStep = () => {
        const newStep = maxAvailableStep + 1;
        setMaxAvailableStep(newStep);
        setCurrentStep(newStep);
    };

    // Define all possible step components
    const stepComponents = [
        <Preliminary onProceed={handleAddStep} />,
        <RebutalOne onProceed={handleAddStep} title={"REBUTAL ONE"} />,
        // <RebutalTwo onProceed={handleAddStep} />,
        // <RebutalThree onProceed={handleAddStep} />,
        // <RebutalFour onProceed={handleAddStep} />,
        // <Judgement onProceed={handleAddStep} />,
    ];

    // For steps beyond the predefined ones, show RebutalOne with incremented heading
    const renderStepContent = (stepIndex: number) => {
        if (stepIndex < stepComponents.length) {
            return stepComponents[stepIndex];
        }

        // Create the title based on step number
        const rebuttalNumber = stepIndex + 0;
        const title = `REBUTTAL ${rebuttalNumberToText(rebuttalNumber).toUpperCase()}`;

        return <RebutalOne onProceed={handleAddStep} title={title} />;
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