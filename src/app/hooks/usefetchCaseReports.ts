// hooks/useFetchCaseReports.ts
"use client";
import { useState, useEffect } from "react";

export interface CaseReport {
    isManual: unknown;
    month: string;
    openingBalance: number;
    newRegistration: number;
    totalRegistered: number;
    decidedCases: number;
    pendingCases: number;
    appeal: number;
    remarks: number;
    year: number;
    benchClerk: string;
}

export const useFetchCaseReports = () => {
    const [data, setData] = useState<CaseReport[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError("");  // Reset error state

            try {
                const response = await fetch("http://localhost:3002/casereports");

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const result = await response.json();
                setData(result);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred");
                }
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);  // Set loading to false once fetching is done
            }
        };

        fetchData();
    }, []);

    return { data, isLoading, error };
}; export interface CaseReport {
    month: string;
    openingBalance: number;
    newRegistration: number;
    totalRegistered: number;
    decidedCases: number;
    pendingCases: number;
    appeal: number;
    remarks: number;
    year: number;
    benchClerk: string;
}