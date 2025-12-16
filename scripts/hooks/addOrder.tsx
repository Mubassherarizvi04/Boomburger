import { db } from "@/firebase/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// 🧾 Define the Order Type


export const addOrder = async (order: any, fetchUserOrders:any): Promise<void> => {

  try {
    // 🔹 Get current logged-in user ID
    const userId = await AsyncStorage.getItem("userUUID");

    if (!userId) {
      throw new Error("User ID not found in AsyncStorage");
    }

    // 🔹 Reference to 'orders' collection
    const ordersRef = collection(db, "orders");

    // 🔹 Add new order
    await addDoc(ordersRef, {
      userId,
      ...order,
      createdAt: serverTimestamp(),
      orderNumber: Math.floor(100000 + Math.random() * 900000), // random 6-digit order no
    });
    fetchUserOrders();
    console.log("✅ Order added successfully!");
  } catch (error) {
    console.error("❌ Error adding order:", error);
  }
};
