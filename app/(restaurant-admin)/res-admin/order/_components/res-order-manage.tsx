"use client";

import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";

// Dummy data for orders
// interface Order {
//   id: string;
//   customerName: string;
//   orderDate: string;
//   status: "Pending" | "Processing" | "Completed" | "Cancelled";
//   totalAmount: number;
// }

export const RestaurantOrderManagement: React.FC = () => {
  // const [orders, setOrders] = useState<Order[]>([
  //   {
  //     id: "ORD-001",
  //     customerName: "John Doe",
  //     orderDate: "2024-10-01",
  //     status: "Pending",
  //     totalAmount: 150.5,
  //   },
  //   {
  //     id: "ORD-002",
  //     customerName: "Jane Smith",
  //     orderDate: "2024-10-02",
  //     status: "Processing",
  //     totalAmount: 200.0,
  //   },
  //   {
  //     id: "ORD-003",
  //     customerName: "Alice Johnson",
  //     orderDate: "2024-10-03",
  //     status: "Completed",
  //     totalAmount: 300.75,
  //   },
  // ]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // const handleStatusChange = (id: string, status: Order["status"]) => {
  //   setOrders((prevOrders) =>
  //     prevOrders.map((order) =>
  //       order.id === id ? { ...order, status } : order
  //     )
  //   );
  // };

  // const filteredOrders = orders.filter((order) =>
  //   order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Order Management
          </h1>
          <Input
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-64"
          />
        </div>
        <div className="space-y-4">
          {/* {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Order ID: {order.id}
                </h2>
                <p className="text-gray-600">Customer: {order.customerName}</p>
                <p className="text-gray-600">Order Date: {order.orderDate}</p>
                <p className="text-gray-800 font-bold">
                  Total: {order.totalAmount.toFixed(2)}
                </p>
                <p
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Processing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </p>
              </div>
              <div className="space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                      Update Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(order.id, "Pending")}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(order.id, "Processing")}
                    >
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(order.id, "Completed")}
                    >
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(order.id, "Cancelled")}
                    >
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  className="bg-gray-600 text-white hover:bg-gray-700"
                  onClick={() => alert(`Viewing details for ${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))} */}
          <div className="bg-white p-6 rounded-lg  flex flex-col items-center justify-center text-center">
            <div className="flex justify-center items-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m2 4H7m8 4H9m10-2a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h10a1 1 0 011 1v12z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mt-2">
              There are currently no orders. Please check back later for
              updates.
            </p>
            <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
