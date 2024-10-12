// app/actions/restaurant-admin/deleteMenuItem.ts
"use server";

import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";

// Define the return type for the function
interface DeleteMenuItemResponse {
  success: boolean;
  message: string;
}

// Server action to delete a menu item that belongs to a specific restaurant
export const deleteMenuItem = async (
  restaurantId: string,
  menuItemId: string
): Promise<DeleteMenuItemResponse> => {
  try {
    // First, check if the menu item belongs to the restaurant
    const menuItemRef = doc(db, "menuItems", menuItemId);
    const menuItemSnapshot = await getDoc(menuItemRef);

    if (!menuItemSnapshot.exists()) {
      return { success: false, message: "Menu item not found." };
    }

    const menuItemData = menuItemSnapshot.data();

    // Ensure the menu item belongs to the correct restaurant
    if (menuItemData?.restaurantId !== restaurantId) {
      return {
        success: false,
        message: "You do not have permission to delete this menu item.",
      };
    }

    // If the restaurantId matches, delete the menu item
    await deleteDoc(menuItemRef);

    return {
      success: true,
      message: "Menu item deleted successfully!",
    };
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Firestore error:", error.message);
      return { success: false, message: `Firestore error: ${error.message}` };
    } else {
      console.error("Unknown error:", error);
      return {
        success: false,
        message: "Failed to delete menu item. Please try again.",
      };
    }
  }
};
