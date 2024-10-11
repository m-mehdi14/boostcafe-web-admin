// app/actions/get-total-restaurants.ts
"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Define the type for the API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function getTotalRestaurants(): Promise<ApiResponse<number>> {
  try {
    const restaurantsCollection = collection(db, "restaurants");
    const restaurantSnapshot = await getDocs(restaurantsCollection);
    const totalRestaurants = restaurantSnapshot.size; // Get the total number of documents

    return { success: true, data: totalRestaurants };
  } catch (error) {
    console.error("Error fetching total number of restaurants:", error);
    return {
      success: false,
      message: "Failed to fetch the total number of restaurants.",
    };
  }
}
