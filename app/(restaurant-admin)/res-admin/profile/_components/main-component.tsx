"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext/AuthContext";

export const RestaurantProfileComponent: React.FC = () => {
  const { handleLogout } = useAuth();
  const [profile, setProfile] = useState({
    name: "Quetta Cafe Pindi",
    email: "mrlegendg007@gmail.com",
    phone: "03308555912",
    address: "abc road, abc house.",
    status: "Active",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveChanges = () => {
    // Simulate saving changes
    setTimeout(() => {
      alert("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Restaurant Profile
        </h1>
        <div className="space-y-6">
          {/* Restaurant Information Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Restaurant Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Restaurant Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <Input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Status
                </label>
                <Input
                  type="text"
                  name="status"
                  value={profile.status}
                  onChange={handleInputChange}
                  className="w-full"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Address
            </h2>
            <Textarea
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              className="w-full"
              rows={4}
            />
          </div>

          {/* Save Changes Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </Button>
            <Button
              onClick={handleLogout}
              className=" text-white "
              variant={"destructive"}
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
