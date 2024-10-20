"use server";
import { db } from "@/lib/firebase"; // Adjust the path based on your Firebase setup
import { doc, deleteDoc } from "firebase/firestore"; // Firestore methods to delete data

// The function to delete an order
export const deleteOrder = async (orderId: string) => {
  try {
    // Create a reference to the order document
    const orderRef = doc(db, "orders", orderId); // Assuming your collection is called 'orders'

    // Delete the order document
    await deleteDoc(orderRef);

    console.log(`Order ${orderId} successfully deleted!`);
    return true; // Return true if successful
  } catch (error) {
    console.error("Error deleting order: ", error);
    return false; // Return false if there's an error
  }
};
