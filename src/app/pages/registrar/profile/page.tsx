"use client";

import React, { useState, useEffect } from "react";
import CaseStatsCard from "@/components/ui/CaseStatsCard";

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
  id: "",
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
    { dzongkhag: "", gewog: "", street_address: "", address_type: "present" },
    { dzongkhag: "", gewog: "", street_address: "", address_type: "permanent" }
  ],
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
  const [, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const userId = '7';
  const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4OGQ3NDgyNS0zOTNmLTRiM2MtYmZjMy0zNDZhODUyYjQxOWUiLCJzdWIiOiI3Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzQ0NjQ0MDgyLCJleHAiOjE3NDQ2NDQ5ODJ9.dE_MGyYgVoSr4UVGd0DO4J3EAKJHoecZwSzo13AGGM0";

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  });

  const getInitials = () => {
    const first = profile.first_name?.charAt(0) || '';
    const last = profile.last_name?.charAt(0) || '';
    return `${first}${last}` || 'US';
  };

  const getAddressByType = (type: "present" | "permanent"): Address => {
    return profile.addresses_attributes.find(addr => addr.address_type === type) || {
      dzongkhag: "", gewog: "", street_address: "", address_type: type
    };
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://nganglam.lvh.me:3001/api/v1/users/${userId}/profile`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (!result.data) throw new Error("Invalid API response structure");
      
      setProfile({
        ...initialProfileState,
        ...result.data,
        addresses_attributes: result.data.addresses_attributes || initialProfileState.addresses_attributes
      });
      
      if (result.data.profileImage) {
        setPhotoPreview(result.data.profileImage);
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
      if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    };
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const payload = {
        profile: {
          ...profile,
          gender: profile.gender.toLowerCase(),
          addresses_attributes: profile.addresses_attributes.map(addr => ({
            ...addr,
            address_type: addr.address_type
          }))
        }
      };

      const response = await fetch(`http://nganglam.lvh.me:3001/api/v1/users/${userId}/profile`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Profile) => {
    setProfile({
      ...profile,
      [field]: field === 'age' ? parseInt(e.target.value) || 0 : e.target.value
    });
  };

  const handleAddressChange = (
    addressType: "present" | "permanent",
    field: keyof Address,
    value: string
  ) => {
    setProfile({
      ...profile,
      addresses_attributes: profile.addresses_attributes.map(addr => 
        addr.address_type === addressType ? { ...addr, [field]: value } : addr
      )
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const renderProfileField = (field: keyof Profile) => {
    const value = profile[field];
    const displayValue = value === undefined || value === null || value === '' ? '-' : String(value);
    
    return (
      <div className="flex flex-col">
        <p className="font-semibold capitalize">{field.toString().replace('_', ' ')}:</p>
        {isEditing ? (
          field === 'gender' ? (
            <select
              className="w-full border border-gray-400 p-2 rounded-md"
              value={profile.gender}
              onChange={(e) => handleChange(e, 'gender')}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <input
              type={field === 'age' ? 'number' : field === 'email' ? 'email' : 'text'}
              className="w-full border border-gray-400 p-2 rounded-md"
              value={value as string | number}
              onChange={(e) => handleChange(e, field)}
            />
          )
        ) : (
          <p className="text-gray-700">{displayValue}</p>
        )}
      </div>
    );
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
        
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full bg-primary-normal hover:bg-primary-light flex items-center justify-center text-white text-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" onError={() => setPhotoPreview(null)} />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
          {isEditing && (
            <>
              <input type="file" id="upload-photo" className="mt-4 hidden" onChange={handlePhotoChange} accept="image/*" />
              <label htmlFor="upload-photo" className="mt-2 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
                <span className="text-lg font-semibold">+ {photoPreview ? "Change Photo" : "Upload Photo"}</span>
              </label>
            </>
          )}
        </div>

        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <div className="flex gap-2">
            {isEditing && (
              <button
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
              onClick={isEditing ? handleUpdateProfile : () => setIsEditing(true)}
              disabled={isLoading}
            >
              {isEditing ? (isLoading ? "Saving..." : "Save Changes") : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg mb-6 border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {(['first_name', 'last_name', 'cid_no', 'phone_number', 'email'] as (keyof Profile)[]).map((field) => (
                <div key={field}>
                  {renderProfileField(field)}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {(['house_no', 'thram_no', 'age', 'gender'] as (keyof Profile)[]).map((field) => (
                <div key={field}>
                  {renderProfileField(field)}
                </div>
              ))}
            </div>
          </div>
        </div>

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

        {/* CaseStatsCard with self-contained data fetching */}
        <CaseStatsCard userId={userId} />
      </div>
    </div>
  );
};

export default ProfilePage;