"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

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

export default function WitnessPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        id: 1,
        firstName: "Ugyen",
        lastName: "Penjor",
        cid: "1190901141",
        contact: "Nov 11, 2024",
        email: "Normal",
        occupation: "Active",
        houseNo: "NO",
        thramNo: "NO",
        age: "This is case summary and all.",
        gender: "This is case summary and all.",
        presentAddress: { village: "17289389", gewog: "17289389", dzongkhag: "17289389" },
        permanentAddress: { village: "17289389", gewog: "17289389", dzongkhag: "17289389" },
    });

    const handleEditToggle = () => {
        if (isEditing) {
            alert("Saved Successfully!");
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

    return (
        <div className="min-h-screen flex justify-center p-8">
            <div className="w-full max-w-6xl border border-textPrimary rounded-lg p-12 flex flex-col sm:w-full md:w-4/5 lg:w-3/4 xl:w-2/3">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold pl-4">Witness Profile</h2>
                    <Button className="bg-green-600 text-white flex items-center" onClick={handleEditToggle}>
                        <Pencil size={16} className="mr-1" />
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row gap-6 mb-6">
                    <div className="p-6 bg-white rounded-lg flex-1">
                        {Object.entries(profile)
                            .filter(([key]) => key !== "presentAddress" && key !== "permanentAddress" && key !== "id")
                            .map(([key, value]) => (
                                <div key={key} className="mb-3 flex flex-col">
                                    <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}: </p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border p-2 rounded text-gray-800"
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
                        <div className="bg-white shadow-md rounded-lg p-6 border flex flex-col">
                            <p className="font-bold text-green-600">Present Address</p>
                            {Object.entries(profile.presentAddress).map(([subKey, subValue]) => (
                                <div key={subKey} className="mb-2 flex flex-col">
                                    <p className="font-semibold capitalize">{subKey}: </p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border p-2 rounded text-gray-800"
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
                        <div className="bg-white shadow-md rounded-lg p-6 border flex flex-col">
                            <p className="font-bold text-green-600">Permanent Address</p>
                            {Object.entries(profile.permanentAddress).map(([subKey, subValue]) => (
                                <div key={subKey} className="mb-2 flex flex-col">
                                    <p className="font-semibold capitalize">{subKey}: </p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="border p-2 rounded text-gray-800"
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
