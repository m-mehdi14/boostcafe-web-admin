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
import { addUser } from "@/actions/admin/add-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

interface AddUserDialogProps {
  refreshUsers: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ refreshUsers }) => {
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: "admin" | "user") => {
    setNewUser({ ...newUser, role });
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      await addUser(newUser);
      toast.success("User added successfully.");
      refreshUsers(); // Call refreshUsers after success
      setNewUser({ name: "", email: "", password: "", role: "user" });
      // @ts-ignore
    } catch (err) {
      toast.error("Failed to add user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogTitle>Add New User</DialogTitle>
      <Input
        name="name"
        placeholder="Name"
        value={newUser.name}
        onChange={handleInputChange}
      />
      <Input
        name="email"
        placeholder="Email"
        value={newUser.email}
        onChange={handleInputChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={handleInputChange}
      />

      <Select value={newUser.role} onValueChange={handleRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      <DialogFooter>
        <Button onClick={handleAddUser} disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AddUserDialog;
