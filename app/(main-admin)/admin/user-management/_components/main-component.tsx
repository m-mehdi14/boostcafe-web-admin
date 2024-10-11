"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// Dummy data for users
interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User" | "Moderator";
  status: "Active" | "Inactive" | "Banned";
}

export const UserMainComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock fetch function
  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setUsers([
        {
          id: "USR-001",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Admin",
          status: "Active",
        },
        {
          id: "USR-002",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "User",
          status: "Inactive",
        },
        {
          id: "USR-003",
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          role: "Moderator",
          status: "Banned",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-5 rounded-lg shadow">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold text-gray-800">
            User Management
          </h1>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search by user name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-64"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Filter Role</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Admin</DropdownMenuItem>
                <DropdownMenuItem>User</DropdownMenuItem>
                <DropdownMenuItem>Moderator</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-blue-600 text-white">Add New User</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <Skeleton className="w-full h-20" />
          ) : (
            <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 capitalize tracking-wider"
                    >
                      User ID
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 capitalize tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 capitalize tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 capitalize tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 capitalize tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-600 capitalize tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.id}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.name}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {user.role}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                            user.status === "Active"
                              ? "text-green-700 bg-green-100"
                              : user.status === "Inactive"
                              ? "text-yellow-700 bg-yellow-100"
                              : "text-red-700 bg-red-100"
                          }`}
                        >
                          <span
                            aria-hidden
                            className="absolute inset-0 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">{user.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        {/* <Button variant="link" className="text-blue-600">
                          View
                        </Button>
                        <Button variant="link" className="text-blue-600 ml-2">
                          Edit
                        </Button> */}
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
