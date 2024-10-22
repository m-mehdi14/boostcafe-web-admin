// app/actions/getRestaurants.ts
"use server";

import { db } from "@/lib/firebase"; // Import Firestore configuration
import { collection, getDocs } from "firebase/firestore";

// Server action to get all restaurant details from Firestore
export async function getRestaurantsForAnalytics() {
  try {
    const restaurantCollection = collection(db, "restaurants"); // Collection reference
    const snapshot = await getDocs(restaurantCollection);

    // Extract restaurant data from Firestore
    const restaurants = snapshot.docs.map((doc) => ({
      id: doc.id, // Restaurant ID
      ...doc.data(), // Restaurant data
    }));

    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return [];
  }
}
