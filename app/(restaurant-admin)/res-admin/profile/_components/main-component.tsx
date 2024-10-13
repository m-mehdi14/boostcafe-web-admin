"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext/AuthContext";
import { updateRestaurantProfile } from "@/actions/restaurant-admin/updateRestaurantProfile";
import { getRestaurantAdminData } from "@/actions/restaurant-admin/getRestaurantAdminData"; // Import getRestaurantAdminData
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const RestaurantProfileComponent: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true); // Track profile loading
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });

  // Fetch restaurant admin data on component mount
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!user) return;

      // Fetch restaurant admin data using server action
      const result = await getRestaurantAdminData(user.uid);

      if (result.success && result.data) {
        setProfile(result.data); // Set profile data with fetched data
      } else {
        toast.error(result.message);
      }
      setLoadingProfile(false);
    };

    fetchRestaurantData();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setLoading(true);

    // Call server action to update restaurant profile
    const result = await updateRestaurantProfile(user.uid, profile);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Restaurant Profile
        </h1>
        {loadingProfile ? (
          // <p>Loading profile...</p> // Show loading state while fetching profile data
          <div className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Restaurant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Address
              </h2>
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : (
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
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleLogout}
                className=" text-white ml-4"
                variant={"destructive"}
              >
                Log Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
