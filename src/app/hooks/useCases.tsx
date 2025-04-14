"use client";

import React, { useState, useEffect } from "react";

interface Address {
  dzongkhag: string;
  gewog: string;
  street_address: string;
  address_type: "present" | "permanent";
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  cid_no: string;
  phone_number: string;
  email: string;
  house_no: string;
  thram_no: string;
  age: number;
  gender: string;
  addresses_attributes: Address[];
  profileImage?: string;
}

const initialProfileState: Profile = {
  id: "1",
  first_name: "",
  last_name: "",
  cid_no: "",
  phone_number: "",
  email: "",
  house_no: "",
  thram_no: "",
  age: 0,
  gender: "",
  addresses_attributes: [
    {
      dzongkhag: "",
      gewog: "",
      street_address: "",
      address_type: "present"
    },
    {
      dzongkhag: "",
      gewog: "",
      street_address: "",
      address_type: "permanent"
    }
  ],
};

const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4OGQ3NDgyNS0zOTNmLTRiM2MtYmZjMy0zNDZhODUyYjQxOWUiLCJzdWIiOiI3Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzQzNDM3MjgwLCJleHAiOjE3NDM0MzgxODB9.qJvSqURgExa2EpQ_EwfuAMw1CB1iLNi6qY3MjxpG9Go";

const API_BASE_URL = "http://nganglam.lvh.me:3001/api/v1";

const authHeaders = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json'
};

const AddressSection = ({
  title,
  address,
  onChange,
  isEditing,
}: {
  title: string;
  address: Address;
  onChange: (key: keyof Address, value: string) => void;
  isEditing: boolean;
}) => (
  <div className="bg-white shadow-md rounded-lg p-5 border flex flex-col w-full transition-all duration-300 hover:shadow-lg h-full">
    <p className="font-bold text-green-600">{title}</p>
    {Object.entries(address).map(([subKey, subValue]) => (
      subKey !== 'address_type' && (
        <div key={subKey} className="mb-2 flex flex-col">
          <p className="font-semibold capitalize">{subKey.replace('_', ' ')}: </p>
          {isEditing ? (
            <input
              type="text"
              className="w-full border border-gray-400 p-2 rounded-md"
              value={subValue}
              onChange={(e) => onChange(subKey as keyof Address, e.target.value)}
            />
          ) : (
            <p className="text-gray-700">{subValue}</p>
          )}
        </div>
      )
    ))}
  </div>
);

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(initialProfileState);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getInitials = () => {
    const first = profile.first_name?.charAt(0) || '';
    const last = profile.last_name?.charAt(0) || '';
    return `${first}${last}` || 'US';
  };

  const getAddressByType = (type: "present" | "permanent"): Address => {
    const defaultAddress = {
      dzongkhag: "",
      gewog: "",
      street_address: "",
      address_type: type
    };

    if (!profile.addresses_attributes) {
      return defaultAddress;
    }

    return profile.addresses_attributes.find(addr => addr.address_type === type) || defaultAddress;
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: authHeaders
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch profile (${response.status})`);
      }
      
      const result = await response.json();
      
      if (!result.data) {
        throw new Error("Invalid API response structure");
      }
      
      const apiData = result.data;
      const profileData = {
        ...initialProfileState,
        ...apiData,
        addresses_attributes: apiData.addresses_attributes || initialProfileState.addresses_attributes
      };
      
      setProfile(profileData);
      
      if (apiData.profileImage) {
        setPhotoPreview(apiData.profileImage);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    return () => {
      if (photoPreview && photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First handle photo upload if changed
      const updateData = { ...profile };
      if (photoFile) {
        const formData = new FormData();
        formData.append('profile_image', photoFile);
        
        const uploadResponse = await fetch(`${API_BASE_URL}/profile/upload`, {
          method: "POST",
          headers: { 'Authorization': `Bearer ${BEARER_TOKEN}` },
          body: formData
        });

        if (!uploadResponse.ok) throw new Error("Image upload failed");
        const { imageUrl } = await uploadResponse.json();
        updateData.profileImage = imageUrl;
      }

      // Then update profile data
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          profile: updateData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error details:", errorData);
        throw new Error(errorData.message || "Update failed");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Update error:", error);
      setError(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Profile) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handleAddressChange = (
    addressType: "present" | "permanent",
    field: keyof Address,
    value: string
  ) => {
    const updatedAddresses = profile.addresses_attributes.map(address => {
      if (address.address_type === addressType) {
        return { ...address, [field]: value };
      }
      return address;
    });

    setProfile({
      ...profile,
      addresses_attributes: updatedAddresses
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  if (isLoading && !isEditing) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchProfile}
            className="ml-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center p-8 bg-gray-100">
      <div className="w-full max-w-4xl border border-gray-300 rounded-lg p-8 flex flex-col bg-white shadow-md">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full bg-primary-normal hover:bg-primary-light flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setPhotoPreview(null)}
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
          {isEditing && (
            <>
              <input
                type="file"
                id="upload-photo"
                className="mt-4 hidden"
                onChange={handlePhotoChange}
                accept="image/*"
              />
              <label
                htmlFor="upload-photo"
                className="mt-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-lg font-semibold">+ {photoPreview ? "Change Photo" : "Upload Photo"}</span>
              </label>
            </>
          )}
        </div>

        {/* Profile Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
            onClick={isEditing ? handleUpdateProfile : () => setIsEditing(true)}
            disabled={isLoading}
          >
            {isEditing ? (isLoading ? "Saving..." : "Save Changes") : "Edit Profile"}
          </button>
        </div>

        {/* Main Profile Information Card */}
        <div className="p-6 bg-white rounded-lg mb-6 border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-col">
                <p className="font-semibold">First Name:</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full border border-gray-400 p-2 rounded-md"
                    value={profile.first_name}
                    onChange={(e) => handleChange(e, "first_name")}
                  />
                ) : (
                  <p className="text-gray-700">{profile.first_name}</p>
                )}
              </div>

              {/* Other fields... */}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Other fields... */}
            </div>
          </div>
        </div>

        {/* Address Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AddressSection
            title="Present Address"
            address={getAddressByType("present")}
            onChange={(key, value) => handleAddressChange("present", key, value)}
            isEditing={isEditing}
          />
          <AddressSection
            title="Permanent Address"
            address={getAddressByType("permanent")}
            onChange={(key, value) => handleAddressChange("permanent", key, value)}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;