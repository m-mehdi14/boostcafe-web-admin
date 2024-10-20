// app/actions/getOrdersForRestaurant.ts
"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

// Server action to get orders for a specific restaurant and the restaurant details
export async function getOrdersForRestaurant(adminId: string) {
  try {
    console.log("🚀 ~ getOrdersForRestaurant ~ adminId:", adminId);

    // Fetch restaurant details using the adminId
    const restaurantRef = doc(db, "restaurants", adminId);
    const restaurantSnap = await getDoc(restaurantRef);

    let restaurantData = null;
    if (restaurantSnap.exists()) {
      restaurantData = restaurantSnap.data();
    } else {
      console.error("Restaurant not found");
      return [];
    }

    // Fetch orders for the restaurant
    const ordersCollection = collection(db, "orders");
    const q = query(ordersCollection, where("restaurantName", "==", adminId)); // Filter orders by restaurantId
    const snapshot = await getDocs(q);

    const orders = snapshot.docs.map((document) => {
      const orderData = document.data();
      return {
        id: document.id,
        ...orderData,
        restaurantDetails: restaurantData, // Attach restaurant data to each order
      };
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders or restaurant details:", error);
    return [];
  }
}
