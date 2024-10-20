/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { MdDeleteForever } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { getOrders } from "@/actions/admin/get-orders"; // Import server action
import { updateOrderStatus } from "@/actions/admin/updateOrderStatus"; // Import update function
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Import Dialog component from ShadCN
import { deleteOrder } from "@/actions/admin/delete-order";

// Order interface updated to include restaurantDetails and cartItems
interface Order {
  id: string;
  customerName: string;
  restaurantName: string;
  restaurantDetails: {
    name: string;
    address: string;
  } | null;
  orderDate: string;
  orderStatus: "Pending" | "Processing" | "Completed" | "Cancelled";
  totalAmount: number;
  cartItems: {
    name: string;
    price: string;
    quantity: number;
    description: string;
    restaurantId: string;
  }[];
}

export const OrderMainComponent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null); // Track which order is being updated
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null); // Track which order is being viewed
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null); // Track which order is being deleted
  const [deletingOrder, setdeletingOrder] = useState(false);

  // Fetch data from Firestore
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await getOrders(); // Fetch orders from Firestore
        // @ts-ignore
        setOrders(data); // Set the fetched orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle status update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId); // Set the current order ID being updated
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      //@ts-ignore
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } else {
      console.error("Failed to update order status");
    }
    setUpdatingOrderId(null); // Reset the updating order ID after completion
  };

  // Function to handle order deletion
  const confirmDeleteOrder = async () => {
    if (deletingOrderId) {
      setdeletingOrder(true);
      const success = await deleteOrder(deletingOrderId);
      if (success) {
        // Remove the deleted order from the state
        setOrders((prevOrders) =>
          prevOrders.filter((o) => o.id !== deletingOrderId)
        );
      } else {
        console.error("Failed to delete order");
      }
      setDeletingOrderId(null); // Close the dialog after deletion
      setdeletingOrder(false);
    }
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
            <Button className="bg-blue-600 text-white">Add New Order</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            // Display a skeleton table with multiple rows when loading
            <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Order ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Restaurant Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Order Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-600 tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-600 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render skeletons for rows */}
                  {[1, 2, 3, 4].map((_, idx) => (
                    <tr key={idx}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Skeleton className="w-24 h-5" />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Skeleton className="w-32 h-5" />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Skeleton className="w-32 h-5" />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Skeleton className="w-40 h-5" />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Skeleton className="w-24 h-5" />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <Skeleton className="w-16 h-5" />
                      </td>
                      <td className="px-5 py-5 border-b flex flex-row items-center border-gray-200 bg-white text-sm text-right">
                        <Skeleton className="w-24 h-5" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Order ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Restaurant Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Order Date
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-600 tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-sm font-semibold text-gray-600 tracking-wider">
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
                          {order.restaurantDetails?.name || "N/A"}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}{" "}
                          {new Date(order.orderDate).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex items-center space-x-1"
                            >
                              {updatingOrderId === order.id ? (
                                <Skeleton className="w-16 h-5" />
                              ) : (
                                <>
                                  <span>
                                    {order.orderStatus || "Unknown Status"}
                                  </span>
                                  <svg
                                    className="w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(order.id, "Pending")
                              }
                            >
                              Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(order.id, "Processing")
                              }
                            >
                              Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(order.id, "Completed")
                              }
                            >
                              Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(order.id, "Cancelled")
                              }
                            >
                              Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <p className="text-gray-900 whitespace-no-wrap">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b flex flex-row items-center border-gray-200 bg-white text-sm text-right">
                        {/* View button with dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              className="text-blue-600 flex items-center"
                              onClick={() => setViewingOrder(order)}
                            >
                              <FiEye className="mr-1" size={20} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl p-6">
                            {viewingOrder && (
                              <div>
                                <DialogTitle className="text-lg font-semibold mb-4">
                                  Order Summary
                                </DialogTitle>

                                {/* Order Info Section */}
                                <div className="border-b pb-4 mb-4">
                                  <h3 className="font-semibold text-gray-700">
                                    Order Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <p>
                                      <strong>Customer Name:</strong>{" "}
                                      {viewingOrder.customerName}
                                    </p>
                                    <p>
                                      <strong>Order ID:</strong>{" "}
                                      {viewingOrder.id}
                                    </p>
                                    <p>
                                      <strong>Order Date:</strong>{" "}
                                      {new Date(
                                        viewingOrder.orderDate
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </p>
                                    <p>
                                      <strong>Status:</strong>{" "}
                                      <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                                          viewingOrder.orderStatus === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : viewingOrder.orderStatus ===
                                              "Processing"
                                            ? "bg-blue-100 text-blue-700"
                                            : viewingOrder.orderStatus ===
                                              "Completed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {viewingOrder.orderStatus}
                                      </span>
                                    </p>
                                    <p>
                                      <strong>Total Amount:</strong> $
                                      {viewingOrder.totalAmount.toFixed(2)}
                                    </p>
                                  </div>
                                </div>

                                {/* Restaurant Info Section */}
                                <div className="border-b pb-4 mb-4">
                                  <h3 className="font-semibold text-gray-700">
                                    Restaurant Information
                                  </h3>
                                  <div className="grid grid-cols-2 gap-4 mt-2">
                                    <p>
                                      <strong>Name:</strong>{" "}
                                      {viewingOrder.restaurantDetails?.name ||
                                        "N/A"}
                                    </p>
                                    <p>
                                      <strong>Address:</strong>{" "}
                                      {viewingOrder.restaurantDetails
                                        ?.address || "N/A"}
                                    </p>
                                  </div>
                                </div>

                                {/* Cart Items Section */}
                                <div className="mb-4">
                                  <h3 className="font-semibold text-gray-700">
                                    Cart Items
                                  </h3>
                                  <table className="min-w-full table-auto mt-2 text-sm">
                                    <thead>
                                      <tr>
                                        <th className="px-4 py-2 text-left">
                                          Item Name
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                          Quantity
                                        </th>
                                        <th className="px-4 py-2 text-left">
                                          Price
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {viewingOrder.cartItems.map(
                                        (item, idx) => (
                                          <tr key={idx}>
                                            <td className="px-4 py-2">
                                              {item.name}
                                            </td>
                                            <td className="px-4 py-2">
                                              {item.quantity}
                                            </td>
                                            <td className="px-4 py-2">
                                              ${item.price}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Additional Item Descriptions */}
                                <div>
                                  <h3 className="font-semibold text-gray-700">
                                    Item Descriptions
                                  </h3>
                                  <ul className="list-disc list-inside mt-2">
                                    {viewingOrder.cartItems.map((item, idx) => (
                                      <li key={idx}>
                                        <strong>{item.name}</strong>:{" "}
                                        {item.description}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {/* <Button
                          variant="link"
                          className="text-blue-600 ml-2 flex items-center"
                        >
                          <MdEdit size={20} className="mr-1" />
                        </Button> */}
                        {/* <Button
                          variant="link"
                          className="text-red-600 ml-2 flex items-center"
                        >
                          <MdDeleteForever size={20} className="mr-1" />
                        </Button> */}

                        {/* Delete button with confirmation dialog */}
                        <Dialog
                          open={deletingOrderId !== null} // Open dialog if deletingOrderId is set
                          onOpenChange={(isOpen) => {
                            if (!isOpen) {
                              setDeletingOrderId(null); // Close dialog when user cancels or dialog closes
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              className="text-red-600 ml-2 flex items-center"
                              onClick={() => setDeletingOrderId(order.id)}
                              disabled={deletingOrderId !== null} // Disable button while dialog is open
                            >
                              <MdDeleteForever size={20} className="mr-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md p-6">
                            <DialogTitle className="text-lg font-semibold mb-4">
                              Confirm Deletion
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this order? This
                              action cannot be undone.
                            </DialogDescription>
                            <DialogFooter className="mt-4">
                              <Button
                                variant="secondary"
                                onClick={() => setDeletingOrderId(null)} // Close the dialog if canceled
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => confirmDeleteOrder()} // Call the delete function
                                disabled={deletingOrder}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
