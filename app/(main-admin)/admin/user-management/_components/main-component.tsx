/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// app/components/UserMainComponent.tsx
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
import { getUsers } from "@/actions/admin/get-users-data"; // Import the server action

// Define the User interface with strict types
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "User" | "Moderator";
  status: "Active" | "Inactive" | "Banned";
}

export const UserMainComponent: React.FC = () => {
  // Define state types explicitly
  const [users, setUsers] = useState<User[]>([]); // User[] is an array of User objects
  const [loading, setLoading] = useState<boolean>(true); // Boolean to track loading
  const [error, setError] = useState<string | null>(null); // String or null for error handling
  const [searchQuery, setSearchQuery] = useState<string>(""); // String for search input
  const [selectedRole, setSelectedRole] = useState<
    "All" | "admin" | "User" | "Moderator"
  >("All"); // Selected role with strict typing

  // Fetch users using server action with proper error handling
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // @ts-ignore
        const data: User[] = await getUsers(); // Fetch users and expect an array of User objects
        setUsers(data);
        // @ts-ignore
      } catch (err: unknown) {
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input change with correct type for the event
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle role filter change with correct type for role
  const handleRoleFilterChange = (
    role: "All" | "Admin" | "User" | "Moderator"
  ) => {
    // @ts-ignore
    setSelectedRole(role);
  };

  // Filter users by search query and selected role
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
                  // @ts-ignore
                  onClick={() => handleRoleFilterChange("admin")}
                >
                  Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    <th
                      scope="col"
                      className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider"
                    >
                      User ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 border-b-2 border-gray-300 bg-gray-100 text-right text-sm font-semibold text-gray-600 tracking-wider"
                    >
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
                        <Button variant="link" className="text-red-600 ml-2">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMainComponent;
