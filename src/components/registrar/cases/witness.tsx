"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useLoginStore } from "@/app/hooks/useLoginStore";

interface Address {
    village: string;
    gewog: string;
    dzongkhag: string;
}

interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    cid: string;
    contact: string;
    email: string;
    occupation: string;
    houseNo: string;
    thramNo: string;
    age: string;
    gender: string;
    presentAddress: Address;
    permanentAddress: Address;
}

interface WitnessProps {
    caseId: string;
}

export default function WitnessPage({ caseId }: WitnessProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        id: 1,
        firstName: "",
        lastName: "",
        cid: "",
        contact: "",
        email: "",
        occupation: "",
        houseNo: "",
        thramNo: "",
        age: "",
        gender: "Male",
        presentAddress: { village: "", gewog: "", dzongkhag: "" },
        permanentAddress: { village: "", gewog: "", dzongkhag: "" },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useLoginStore();

    useEffect(() => {
        const fetchWitnessData = async () => {
            try {
                const response = await fetch(`http://nganglam.lvh.me:3001/api/v1/cases/${caseId}/witness`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (response.ok && data.status === "ok") {
                    setProfile(data.data);
                } else {
                    setError("Failed to fetch witness data");
                }
            } catch (err) {
                setError("An error occurred while fetching witness data");
            } finally {
                setLoading(false);
            }
        };

        if (caseId) {
            fetchWitnessData();
        }
    }, [caseId, token]);

    const handleEditToggle = () => {
        if (isEditing) {
            alert("Saved Successfully!"); // Show alert when saving
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (key: string, value: string) => {
        setProfile({ ...profile, [key]: value });
    };

    const handleAddressChange = (type: "presentAddress" | "permanentAddress", key: string, value: string) => {
        setProfile({
            ...profile,
            [type]: { ...profile[type], [key]: value },
        });
    };

    if (loading) return <p className="text-center text-gray-600">Loading witness data...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="min-h-screen flex justify-center p-8">
            <div className="w-full max-w-6xl border border-textPrimary rounded-lg p-12 flex flex-col sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold pl-4">Witness Profile</h2>
                    <Button
                        className="bg-primary-normal text-white flex items-center hover:bg-primary-light transition-all duration-300 ease-in-out"
                        onClick={handleEditToggle}
                    >
                        <Pencil size={16} className="mr-1" />
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row gap-6 mb-6">
                    {/* General Information Section (Card for general info) */}
                    <div
                        className="p-6 bg-white shadow-md rounded-lg flex-1 hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out"
                    >
                        {Object.entries(profile)
                            .filter(([key]) => key !== "presentAddress" && key !== "permanentAddress" && key !== "id")
                            .map(([key, value]) => (
                                <div key={key} className="mb-3 flex flex-col">
                                    <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}: </p>
                                    {key === "gender" ? ( // Dropdown for gender field
                                        isEditing ? (
                                            <select
                                                className="border p-1 rounded text-gray-800"
                                                value={value}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <p className="text-gray-700">{value}</p>
                                        )
                                    ) : isEditing ? (
                                        <input
                                            type="text"
                                            className="border p-1 rounded text-gray-800"
                                            value={value}
                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{value}</p>
                                    )}
                                </div>
                            ))}
                    </div>

                    <div className="space-y-4 flex-1">
                        {/* Present Address Section */}
                        <div
                            className="bg-white shadow-md rounded-lg p-6 border flex flex-col hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out"
                        >
                            <p className="font-bold text-green-600">Present Address</p>
                            {Object.entries(profile.presentAddress).map(([subKey, subValue]) => (
                                <div key={subKey} className="mb-2 flex flex-col">
                                    <p className="font-semibold capitalize">{subKey}: </p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border p-1 rounded text-gray-800"
                                            value={subValue}
                                            onChange={(e) => handleAddressChange("presentAddress", subKey, e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{subValue}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Permanent Address Section */}
                        <div
                            className="bg-white shadow-md rounded-lg p-6 border flex flex-col hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 ease-in-out"
                        >
                            <p className="font-bold text-green-600">Permanent Address</p>
                            {Object.entries(profile.permanentAddress).map(([subKey, subValue]) => (
                                <div key={subKey} className="mb-2 flex flex-col">
                                    <p className="font-semibold capitalize">{subKey}: </p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border p-1 rounded text-gray-800"
                                            value={subValue}
                                            onChange={(e) => handleAddressChange("permanentAddress", subKey, e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{subValue}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}