"use server";

import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// Define the interface for Menu Item
interface MenuItem {
  id?: string; // id is optional
  name: string;
  description: string;
  price: number;
  image?: string; // Optional image field in base64 format
}

// Define the return type for the function
interface SaveMenuItemResponse {
  success: boolean;
  message: string;
}

// Server action to save (add or update) a menu item in the "menuItems" collection
export const saveMenuItem = async (
  restaurantId: string,
  menuItem: MenuItem,
  isEdit: boolean
): Promise<SaveMenuItemResponse> => {
  try {
    // Ensure restaurantId and required fields are provided
    if (
      !restaurantId ||
      !menuItem.name ||
      !menuItem.description ||
      !menuItem.price
    ) {
      throw new Error(
        "Missing required fields: restaurantId, name, description, and price."
      );
    }

    // Generate a new document ID if not editing (if no ID is present)
    const menuItemId = menuItem.id || doc(collection(db, "menuItems")).id;

    // Reference to the menu item document in Firestore
    const menuItemRef = doc(db, "menuItems", menuItemId);

    // Prepare the menu item data to be saved
    const menuItemData = {
      restaurantId, // Link this menu item to the restaurant
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      image: menuItem.image || null, // Store the base64 image (if present)
    };

    // Save or update the menu item in the "menuItems" collection
    await setDoc(menuItemRef, menuItemData);

    // Revalidate the restaurant menu path to reflect changes
    revalidatePath(`/res-admin/menu`);

    return {
      success: true,
      message: isEdit
        ? "Menu item updated successfully!"
        : "Menu item added successfully!",
    };
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Firestore error:", error.message);

      // Handle specific Firestore error codes
      switch (error.code) {
        case "permission-denied":
          return {
            success: false,
            message: "Permission denied to update the menu item.",
          };
        case "not-found":
          return { success: false, message: "Menu item not found." };
        case "unavailable":
          return {
            success: false,
            message: "Firestore service is currently unavailable.",
          };
        default:
          return {
            success: false,
            message: `Firestore error: ${error.message}`,
          };
      }
    } else if (error instanceof Error) {
      // Handle general runtime errors
      console.error("Error saving menu item:", error.message);
      return {
        success: false,
        message: `Error: ${error.message}`,
      };
    } else {
      // Handle unknown errors
      console.error("Unknown error:", error);
      return {
        success: false,
        message:
          "An unknown error occurred while saving the menu item. Please try again.",
      };
    }
  }
};
