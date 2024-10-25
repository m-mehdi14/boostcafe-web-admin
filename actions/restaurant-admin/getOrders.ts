// app/actions/getUsers.ts
"use server";

import { db } from "@/lib/firebase"; // Example with Firestore
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

// Server action to get orders for a specific restaurant from Firestore
export async function getOrders(restaurantId: string) {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(
      ordersCollection,
      where("restaurantName", "==", restaurantId)
    );
    const snapshot = await getDocs(q);

    const orders = await Promise.all(
      snapshot.docs.map(async (document) => {
        const orderData = document.data();
        const restaurantId = orderData.restaurantName;

        let restaurantData = null;
        if (restaurantId) {
          try {
            const restaurantRef = doc(db, "restaurants", restaurantId);
            const restaurantSnap = await getDoc(restaurantRef);

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
          restaurantDetails: restaurantData,
        };
      })
    );

    return orders;
  } catch (error) {
    console.error("Error fetching orders or restaurant details:", error);
    return [];
  }
}
