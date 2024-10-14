/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState } from "react";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { editUser } from "@/actions/admin/edit-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Importing toast from sonner

interface EditUserProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  };
  refreshUsers: () => void;
}

const EditUserDialog: React.FC<EditUserProps> = ({ user, refreshUsers }) => {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: "admin" | "user") => {
    setUpdatedUser({ ...updatedUser, role });
  };

  const handleEditUser = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      await editUser(updatedUser);
      refreshUsers(); // Call refreshUsers after success
      toast.success("User updated successfully.");
    } catch (err) {
      toast.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogTitle>Edit User</DialogTitle>
      <Input
        name="name"
        placeholder="Name"
        value={updatedUser.name}
        onChange={handleInputChange}
      />
      <Input
        name="email"
        placeholder="Email"
        value={updatedUser.email}
        onChange={handleInputChange}
      />

      {/* Role Selection */}
      <Select value={updatedUser.role} onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      <DialogFooter>
        <Button onClick={handleEditUser} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditUserDialog;
