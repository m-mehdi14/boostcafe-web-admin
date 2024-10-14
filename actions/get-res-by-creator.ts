"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { revalidatePath } from "next/cache";

// Function to fetch restaurants by creatorId from Firestore
export async function GetRestaurantsByCreator(creatorId: string) {
  try {
    const restaurantsCollection = collection(db, "restaurants");

    // Query to fetch restaurants where the creatorId matches
    const q = query(restaurantsCollection, where("createdBy", "==", creatorId));
    const restaurantSnapshot = await getDocs(q);

    const restaurantList = restaurantSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    revalidatePath("/admin");
    return { success: true, data: restaurantList };
  } catch (error) {
    console.error("Error fetching restaurants by creatorId:", error);
    return { success: false, message: "Failed to fetch restaurant data." };
  }
}
