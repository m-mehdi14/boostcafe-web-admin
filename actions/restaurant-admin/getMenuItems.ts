// app/actions/restaurant-admin/getMenuItems.ts
"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";

// Define the return type for the function
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
}

interface GetMenuItemsResponse {
  success: boolean;
  message: string;
  data?: MenuItem[];
}

// Server action to fetch menu items for a specific restaurant
export const getMenuItems = async (
  restaurantId: string
): Promise<GetMenuItemsResponse> => {
  try {
    // Reference the "menuItems" collection and query items by restaurantId
    const menuItemsRef = collection(db, "menuItems");
    const q = query(menuItemsRef, where("restaurantId", "==", restaurantId));

    // Execute the query
    const querySnapshot = await getDocs(q);
    const menuItems: MenuItem[] = [];

    // Loop through the query results and construct the menuItems array
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      menuItems.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image || null,
      });
    });

    return {
      success: true,
      message: "Menu items fetched successfully!",
      data: menuItems,
    };
  } catch (error) {
    if (error instanceof FirestoreError) {
      console.error("Firestore error:", error.message);
      return { success: false, message: `Firestore error: ${error.message}` };
    } else {
      console.error("Unknown error:", error);
      return {
        success: false,
        message: "Failed to fetch menu items. Please try again.",
      };
    }
  }
};
