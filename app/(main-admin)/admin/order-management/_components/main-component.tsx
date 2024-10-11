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

// Dummy data for orders
interface Order {
  id: string;
  customerName: string;
  restaurantName: string;
  orderDate: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  totalAmount: number;
}

export const OrderMainComponent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock fetch function
  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setOrders([
        {
          id: "ORD-001",
          customerName: "John Doe",
          restaurantName: "Boost Cafe",
          orderDate: "2024-10-01",
          status: "Pending",
          totalAmount: 150.5,
        },
        {
          id: "ORD-002",
          customerName: "Jane Smith",
          restaurantName: "Boost Cafe",
          orderDate: "2024-10-02",
          status: "Processing",
          totalAmount: 200.0,
        },
        {
          id: "ORD-003",
          customerName: "Alice Johnson",
          restaurantName: "Boost Cafe",
          orderDate: "2024-10-03",
          status: "Completed",
          totalAmount: 300.75,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-5 rounded-lg shadow">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold text-gray-800">
            Order Management
          </h1>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search by customer name..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-64"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Filter Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Pending</DropdownMenuItem>
                <DropdownMenuItem>Processing</DropdownMenuItem>
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuItem>Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="bg-blue-600 text-white">Add New Order</Button>
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
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600  tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600  tracking-wider"
                    >
                      Customer Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600  tracking-wider"
                    >
                      Restaurant Name
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600  tracking-wider"
                    >
                      Order Date
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600  tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-600  tracking-wider"
                    >
                      Total Amount
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-600  tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order.id}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order.customerName}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order.restaurantName}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order.orderDate}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                            order.status === "Pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : order.status === "Processing"
                              ? "text-blue-700 bg-blue-100"
                              : order.status === "Completed"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          }`}
                        >
                          <span
                            aria-hidden
                            className="absolute inset-0 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <p className="text-gray-900 whitespace-no-wrap">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <Button variant="link" className="text-blue-600">
                          View
                        </Button>
                        <Button variant="link" className="text-blue-600 ml-2">
                          Edit
                        </Button>
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
