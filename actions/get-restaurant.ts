// app/actions/getRestaurants.ts
"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// Function to fetch all restaurants from Firestore
export async function GetRestaurants() {
  try {
    const restaurantsCollection = collection(db, "restaurants");
    const restaurantSnapshot = await getDocs(restaurantsCollection);
    const restaurantList = restaurantSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    revalidatePath("/admin");
    return { success: true, data: restaurantList };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return { success: false, message: "Failed to fetch restaurant data." };
  }
}
