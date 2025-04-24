"use client";

import { useEffect, useState } from "react";
import { useLoginStore } from "@/app/hooks/useLoginStore";
import { Card, CardContent } from "@/components/ui/card";

interface JudgeOrClerk {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    cid_no: string;
    phone_number: string;
}

interface Court {
    id: number;
    name: string;
    court_type: string;
}

interface Statistics {
    total: number;
    civil: number;
    criminal: number;
    others: number;
    active: number;
    decided: number;
    pending: number;
    appeals: number;
}

interface Bench {
    id: number;
    name: string;
    court_type: string;
    parent_court: Court;
    judges: JudgeOrClerk[];
    clerks: JudgeOrClerk[];
    statistics?: Statistics;
}

const toRoman = (num: number): string => {
    const romanMap: [number, string][] = [
        [1000, "M"],
        [900, "CM"],
        [500, "D"],
        [400, "CD"],
        [100, "C"],
        [90, "XC"],
        [50, "L"],
        [40, "XL"],
        [10, "X"],
        [9, "IX"],
        [5, "V"],
        [4, "IV"],
        [1, "I"],
    ];
    let roman = "";
    for (const [value, symbol] of romanMap) {
        while (num >= value) {
            roman += symbol;
            num -= value;
        }
    }
    return roman;
};

export default function Bench() {
    const [benches, setBenches] = useState<Bench[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchBenches = async () => {
            try {

                const host = window.location.hostname;

                const response = await fetch(`http://${host}:3001/api/v1/benches`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (response.ok && data.status === "ok") {
                    console.log("Fetched benches:", data.data);
                    setBenches(data.data);
                } else {
                    setError("Failed to fetch benches");
                }
            } catch (err) {
                setError("An error occurred while fetching benches.");
            } finally {
                setLoading(false);
            }
        };

        fetchBenches();
    }, [token]);

    if (loading) return <p className="text-center text-gray-500">Loading benches...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="flex justify-center py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl px-4">
                {benches.map((bench, index) => (
                    <Card
                        key={bench.id}
                        className="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl border border-gray-200 hover:border-green-400 bg-white"
                    >
                        <CardContent className="p-6">
                            {/* Header with Bench and Court Info */}
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-bold text-green-600">Bench {toRoman(index + 1)}</h2>
                                <div className="text-right text-sm text-gray-700">
                                    <p className="font-semibold">{bench.parent_court.name}</p>
                                    <p className="text-xs italic text-gray-500">{bench.parent_court.court_type}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Case Stats */}
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Case Statistics</p>
                                    {bench.statistics ? (
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li><strong>Total:</strong> {bench.statistics.total}</li>
                                            <li><strong>Civil:</strong> {bench.statistics.civil}</li>
                                            <li><strong>Criminal:</strong> {bench.statistics.criminal}</li>
                                            <li><strong>Others:</strong> {bench.statistics.others}</li>
                                            <li><strong>Active:</strong> {bench.statistics.active}</li>
                                            <li><strong>Decided:</strong> {bench.statistics.decided}</li>
                                            <li><strong>Pending:</strong> {bench.statistics.pending}</li>
                                            <li><strong>Appeals:</strong> {bench.statistics.appeals}</li>
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Statistics not available</p>
                                    )}
                                </div>

                                {/* Officials Dropdowns */}
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Officials</p>

                                    {/* Judges Filter Dropdown */}
                                    <details className="rounded border border-gray-300 px-3 py-2 mb-4">
                                        <summary className="cursor-pointer font-medium text-gray-700">Judges</summary>
                                        <div className="mt-2 space-y-3 text-sm text-gray-700">
                                            {bench.judges.length > 0 ? (
                                                bench.judges.map((j) => (
                                                    <div key={j.id} className="ml-2 mt-1">
                                                        <p><strong>Name:</strong> {j.first_name} {j.last_name}</p>
                                                        <p><strong>Email:</strong> {j.email}</p>
                                                        <p><strong>Phone:</strong> {j.phone_number}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400">No judges available.</p>
                                            )}
                                        </div>
                                    </details>

                                    {/* Clerks Filter Dropdown */}
                                    <details className="rounded border border-gray-300 px-3 py-2">
                                        <summary className="cursor-pointer font-medium text-gray-700">Clerks</summary>
                                        <div className="mt-2 space-y-3 text-sm text-gray-700">
                                            {bench.clerks.length > 0 ? (
                                                bench.clerks.map((c) => (
                                                    <div key={c.id} className="ml-2 mt-1">
                                                        <p><strong>Name:</strong> {c.first_name} {c.last_name}</p>
                                                        <p><strong>Email:</strong> {c.email}</p>
                                                        <p><strong>Phone:</strong> {c.phone_number}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400">No clerks available.</p>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}