"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAdminProfile } from "@/actions/admin/updateProfile";
import { changeAdminPassword } from "@/actions/admin/changePassword";
import { useAuth } from "@/lib/AuthContext/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // Assuming you are using sonner for toast notifications

export const MainSettingComponent: React.FC = () => {
  const { handleLogout, user } = useAuth();
  const [isPending, startTransition] = useTransition();
  console.log("🚀 ~ isPending:", isPending);

  // Separate loading states for profile, password, and logout actions
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [passwordSaving, setPasswordSaving] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  const [profile, setProfile] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleSaveProfile = () => {
    setProfileSaving(true);
    startTransition(async () => {
      const result = await updateAdminProfile({
        adminId: user?.uid || "",
        name: profile.name,
        email: profile.email,
      });

      if (result.success) {
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Failed to update profile. " + result.message);
      }
      setProfileSaving(false);
    });
  };

  const handleSavePassword = () => {
    if (password.newPassword !== password.confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setPasswordSaving(true);
    startTransition(async () => {
      const result = await changeAdminPassword({
        adminId: user?.uid || "",
        newPassword: password.newPassword,
      });

      if (result.success) {
        toast.success("Password updated successfully.");
      } else {
        toast.error("Failed to update password. " + result.message);
      }
      setPasswordSaving(false);
    });
  };

  const handleLogoutClick = () => {
    setLogoutLoading(true);
    startTransition(() => {
      handleLogout();
      toast.success("Logged out successfully.");
      setLogoutLoading(false);
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              {profileSaving ? (
                <>
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Change Password
            </h2>
            <div className="space-y-4">
              {passwordSaving ? (
                <>
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      New Password
                    </label>
                    <Input
                      type="password"
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      name="confirmNewPassword"
                      value={password.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Save Changes Section */}
        <div className="mt-6 flex justify-end space-x-4">
          <Button
            onClick={handleSaveProfile}
            className="bg-blue-600 text-white"
            disabled={profileSaving}
          >
            {profileSaving ? "Saving Profile..." : "Save Profile"}
          </Button>
          <Button
            onClick={handleSavePassword}
            className="bg-blue-600 text-white"
            disabled={passwordSaving}
          >
            {passwordSaving ? "Saving Password..." : "Save Password"}
          </Button>
        </div>

        {/* Logout Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleLogoutClick}
            className="bg-red-600 text-white"
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging Out..." : "Log Out"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainSettingComponent;
