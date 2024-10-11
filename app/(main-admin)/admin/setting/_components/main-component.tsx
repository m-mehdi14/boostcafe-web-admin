"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext/AuthContext";

export const MainSettingComponent: React.FC = () => {
  const { handleLogout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Software Engineer at Example Corp.",
  });
  // const [notifications, setNotifications] = useState({
  //   emailNotifications: true,
  //   smsNotifications: false,
  // });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // const handleNotificationChange = (type: string) => {
  //   setNotifications({ ...notifications, [type]: !notifications[type] });
  // };

  const handleSaveChanges = () => {
    setLoading(true);
    // Simulate saving changes
    setTimeout(() => {
      setLoading(false);
      alert("Changes saved successfully!");
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information Section */}
          <div className=" bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Bio
                </label>
                <Textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="w-full"
                  rows={4}
                />
              </div> */}
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Current Password
                </label>
                <Input type="password" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  New Password
                </label>
                <Input type="password" className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Confirm New Password
                </label>
                <Input type="password" className="w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-600">
                Email Notifications
              </label>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={() =>
                  handleNotificationChange("emailNotifications")
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-600">
                SMS Notifications
              </label>
              <Switch
                checked={notifications.smsNotifications}
                onCheckedChange={() =>
                  handleNotificationChange("smsNotifications")
                }
              />
            </div>
          </div>
        </div> */}

        {/* Save Changes Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveChanges}
            className="bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleLogout}
            className=" text-white"
            disabled={loading}
            variant={"destructive"}
          >
            {loading ? "Logging Out" : "Log Out"}
          </Button>
        </div>
      </div>
    </div>
  );
};
