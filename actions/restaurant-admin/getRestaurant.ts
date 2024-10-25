// File: "@/actions/admin/getRestaurant.ts"
"use server";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Restaurant {
  id: string;
  name: string;
  address: string; // You can add more fields based on your Firestore structure
  phoneNumber?: string;
  email?: string;
  // Add other fields that are relevant to the restaurant
}

/**
 * Fetch a specific restaurant's details by its ID
 * @param restaurantId - The ID of the restaurant to fetch
 * @returns The restaurant details
 */
export const getRestaurantById = async (
  restaurantId: string
): Promise<Restaurant | null> => {
  try {
    // Reference to a specific restaurant document in Firestore
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);

    if (restaurantSnapshot.exists()) {
      const restaurantData = {
        id: restaurantSnapshot.id,
        ...restaurantSnapshot.data(),
      } as Restaurant;

      return restaurantData;
    } else {
      console.warn("Restaurant not found with the specified ID:", restaurantId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    throw new Error("Failed to fetch restaurant details.");
  }
};
