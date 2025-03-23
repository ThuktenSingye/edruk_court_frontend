"use client";

import React, { useState, useEffect } from "react";

// Define the types for profile state
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

const AddressSection = ({
    title,
    address,
    onChange,
    isEditing,
}: {
    title: string;
    address: Address;
    onChange: (key: string, value: string) => void;
    isEditing: boolean;
}) => (
    <div className="bg-white shadow-md rounded-lg p-5 border flex flex-col w-full">
        <p className="font-bold text-green-600">{title}</p>
        {Object.entries(address).map(([subKey, subValue]) => (
            <div key={subKey} className="mb-2 flex flex-col">
                <p className="font-semibold capitalize">{subKey}: </p>
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full border border-gray-400 p-2 rounded-md"
                        value={subValue}
                        onChange={(e) => onChange(subKey, e.target.value)}
                    />
                ) : (
                    <p className="text-gray-700">{subValue}</p>
                )}
            </div>
        ))}
    </div>
);

const ProfilePage = () => {
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

    const [photo, setPhoto] = useState<File | null>(null);

    useEffect(() => {
        fetch("http://localhost:5000/profiles/1")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                return response.json();
            })
            .then((data) => setProfile(data))
            .catch((error) => console.error("Error fetching profile:", error));
    }, []);

    const toggleEdit = () => {
        if (isEditing) {
            fetch("http://localhost:5000/profiles/1", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to update profile");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Profile updated:", data);
                    setIsEditing(false);
                })
                .catch((error) => console.error("Error updating profile:", error));
        } else {
            setIsEditing(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Profile) => {
        setProfile({ ...profile, [field]: e.target.value });
    };

    const handleAddressChange = (
        addressKey: "presentAddress" | "permanentAddress",
        field: string,
        value: string
    ) => {
        setProfile({
            ...profile,
            [addressKey]: {
                ...profile[addressKey],
                [field]: value,
            },
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
        }
    };

    return (
        <div className="min-h-screen flex justify-center p-8 bg-gray-100">
            <div className="w-full max-w-4xl border border-gray-300 rounded-lg p-8 flex flex-col bg-white shadow-md">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-primary-normal hover:bg-primary-light flex items-center justify-center text-white text-2xl font-bold">
                        {photo ? (
                            <img src={URL.createObjectURL(photo)} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span>{profile.firstName.charAt(0)}</span>
                        )}
                    </div>
                    <input
                        type="file"
                        id="upload-photo"
                        className="mt-4 hidden"
                        onChange={handlePhotoChange}
                        accept="image/*"
                    />
                    <label htmlFor="upload-photo" className="mt-2 cursor-pointer text-gray-500 hover:text-gray-700">
                        <span className="text-lg font-semibold">+</span>
                    </label>
                    <p className="mt-2 text-gray-600 text-sm">Click to upload photo</p>
                </div>

                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">User Profile</h2>
                    <button
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                        onClick={toggleEdit}
                    >
                        {isEditing ? "Save" : "Edit Profile"}
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="p-6 bg-white rounded-lg flex-1 border border-gray-200">
                        {Object.entries(profile)
                            .filter(([key]) => key !== "presentAddress" && key !== "permanentAddress" && key !== "id")
                            .map(([key, value]) => (
                                <div key={key} className="mb-4 flex flex-col">
                                    <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}: </p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="w-full border border-gray-400 p-2 rounded-md"
                                            value={value}
                                            onChange={(e) => handleChange(e, key as keyof Profile)}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{value}</p>
                                    )}
                                </div>
                            ))}
                    </div>

                    <div className="space-y-4 flex-1">
                        <AddressSection
                            title="Present Address"
                            address={profile.presentAddress}
                            onChange={(field, value) => handleAddressChange("presentAddress", field, value)}
                            isEditing={isEditing}
                        />
                        <AddressSection
                            title="Permanent Address"
                            address={profile.permanentAddress}
                            onChange={(field, value) => handleAddressChange("permanentAddress", field, value)}
                            isEditing={isEditing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
