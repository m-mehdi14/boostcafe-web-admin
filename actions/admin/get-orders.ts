// app/actions/getUsers.ts
"use server";

import { db } from "@/lib/firebase"; // Example with Firestore
import { collection, getDocs, getDoc, doc } from "firebase/firestore";

// Server action to get users and restaurant details from Firestore
export async function getOrders() {
  try {
    const ordersCollection = collection(db, "orders");
    const snapshot = await getDocs(ordersCollection);

    // Use Promise.all to resolve promises for both order and restaurant fetches
    const orders = await Promise.all(
      snapshot.docs.map(async (document) => {
        const orderData = document.data();
        const restaurantId = orderData.restaurantName; // Check if restaurantId exists

        console.log("Processing order with restaurantId:", restaurantId);

        let restaurantData = null;
        if (restaurantId) {
          // Fetch restaurant details only if restaurantId exists
          try {
            const restaurantRef = doc(db, "restaurants", restaurantId);
            const restaurantSnap = await getDoc(restaurantRef);

            // Check if restaurant snapshot exists and fetch data
            if (restaurantSnap.exists()) {
              restaurantData = restaurantSnap.data();
            }
          } catch (restaurantError) {
            console.error(
              "Error fetching restaurant details:",
              restaurantError
            );
          }
        }

        return {
          id: document.id,
          ...orderData,
          restaurantDetails: restaurantData, // Attach restaurant data (or null if not found)
        };
      })
    );

    return orders;
  } catch (error) {
    console.error("Error fetching orders or restaurant details:", error);
    return [];
  }
}
