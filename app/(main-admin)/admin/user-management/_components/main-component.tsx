/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getUsers } from "@/actions/admin/get-users-data";
import AddUserDialog from "@/components/AddUserDialog"; // Add User dialog component
import EditUserDialog from "@/components/EditUserDialog"; // Edit User dialog component
import { deleteUser } from "@/actions/admin/deleteUser"; // Import deleteUser function
import { toast } from "sonner"; // Import toast for notifications
import ConfirmDialog from "@/components/ConfirmDialog"; // Import ConfirmDialog component

// Define the User type with strict role values as admin or user
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user"; // Only admin and user roles
  status: "Active" | "Inactive" | "Banned";
}

export const UserMainComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State to store users
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for errors
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search input state
  const [selectedRole, setSelectedRole] = useState<"All" | "admin" | "user">(
    "All"
  ); // State for role filter
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // State for selected user to edit

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false); // State for delete confirmation dialog
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null); // State for tracking which user to delete
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  // Use effect to fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users
  const fetchUsers = async () => {
    setLoading(true); // Set loading to true
    setError(null); // Reset any previous errors
    try {
      // @ts-ignore
      const data: User[] = await getUsers(); // Fetch users
      setUsers(data); // Update users state
      // @ts-ignore
    } catch (err) {
      setError("Failed to load users. Please try again."); // Handle errors
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Function to refresh users list after user actions
  const refreshUsers = () => {
    fetchUsers();
  };

  // Function to handle search input changes
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle role filter changes
  const handleRoleFilterChange = (role: "All" | "admin" | "user") => {
    setSelectedRole(role);
  };

  // Function to handle user deletion
  const handleDeleteUser = async (userId: string) => {
    const response = await deleteUser({ userId });
    if (response.success) {
      setUsers(users.filter((user) => user.id !== userId)); // Update users state to remove deleted user
      toast.success("User deleted successfully."); // Show success toast

      closeDeleteDialog(); // Close dialog
    } else {
      toast.error(response.message); // Show error toast
    }
  };

  // Function to open the delete confirmation dialog
  const openDeleteDialog = (userId: string) => {
    setUserIdToDelete(userId);
    setDeleteDialogOpen(true);
  };

  // Function to close the delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserIdToDelete(null);
  };

  // Function to confirm and delete a user
  const confirmDelete = () => {
    if (userIdToDelete) {
      setIsLoadingDelete(true);
      handleDeleteUser(userIdToDelete); // Delete user
      setIsLoadingDelete(false);
      // closeDeleteDialog(); // Close dialog
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers: User[] = users.filter((user: User) => {
    const matchesSearchQuery = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    return matchesSearchQuery && matchesRole;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-semibold text-gray-800">
            User Management
          </h1>
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="Search by user name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-64 border-2 border-gray-300 rounded-lg p-2"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Filter Role
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleRoleFilterChange("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleFilterChange("admin")}
                >
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleFilterChange("user")}
                >
                  User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add User Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add User</Button>
              </DialogTrigger>
              <AddUserDialog refreshUsers={refreshUsers} />
            </Dialog>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              No users found matching the search criteria.
            </p>
          ) : (
            <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-right text-sm font-semibold text-gray-600 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.id}
                        </p>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.name}
                        </p>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.role}
                        </p>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 bg-white text-sm text-right">
                        <div className="flex justify-end space-x-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="link"
                                className="text-blue-600 ml-2"
                                onClick={() => setSelectedUser(user)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            {selectedUser && (
                              <EditUserDialog
                                user={selectedUser}
                                refreshUsers={refreshUsers}
                              />
                            )}
                          </Dialog>

                          {/* Delete Button */}
                          <Button
                            variant="link"
                            className="text-red-600"
                            onClick={() => openDeleteDialog(user.id)}
                            disabled={isLoadingDelete}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        title="Confirm Delete"
        description="Are you sure you want to delete this user?"
        isOpen={isDeleteDialogOpen}
        onConfirm={confirmDelete}
        onCancel={closeDeleteDialog}
        isLoading={isLoadingDelete}
      />
    </div>
  );
};

export default UserMainComponent;
