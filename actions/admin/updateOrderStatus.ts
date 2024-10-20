/* eslint-disable @typescript-eslint/ban-ts-comment */
// app/actions/admin/updateOrderStatus.ts
"use server";

import { db } from "@/lib/firebase"; // Example with Firestore
import { doc, updateDoc } from "firebase/firestore";

// Server action to update order status in Firestore
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    const orderRef = doc(db, "orders", orderId); // Reference to the order document
    await updateDoc(orderRef, {
      orderStatus: newStatus, // Update the status field
    });
    return true; // Indicate success
  } catch (error) {
    console.error("Error updating order status:", error);
    return false; // Indicate failure
  }
}

// The function to update order details
// @ts-ignore
export const updateOrderDetails = async (orderId: string, updatedOrderData) => {
  try {
    // Create a reference to the order document
    const orderRef = doc(db, "orders", orderId); // Assuming your collection is called 'orders'

    // Update the order document with the updated data
    await updateDoc(orderRef, updatedOrderData);

    console.log(`Order ${orderId} successfully updated!`);
    return true; // Return true if successful
  } catch (error) {
    console.error("Error updating order: ", error);
    return false; // Return false if there's an error
  }
};
