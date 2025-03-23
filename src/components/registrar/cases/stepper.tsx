"use client";

import React from "react";

interface StepperProps {
    currentStep: number;
    totalSteps: number;
    onStepClickAction: (step: number) => void; // Renamed from onStepClick
}

export default function Stepper({ currentStep, totalSteps, onStepClickAction }: StepperProps) {
    return (
        <div className="flex items-center justify-center my-6">
            {[...Array(totalSteps)].map((_, index) => (
                <div key={index} className="flex items-center">
                    <div
                        className={`w-6 h-6 rounded-full cursor-pointer 
              ${index === currentStep ? "bg-green-600" : "bg-gray-500"}
            `}
                        onClick={() => onStepClickAction(index)} // Updated function name
                    />
                    {index < totalSteps - 1 && <div className="w-12 h-1 bg-gray-500" />}
                </div>
            ))}
        </div>
    );
}