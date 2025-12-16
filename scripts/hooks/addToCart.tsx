import { db } from "@/firebase/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";


// 🔹 Type define kar le for cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image : string;
}

// 🔹 Add to cart function
export const addToCart = async (item: CartItem, refresh:any, setLoading:any): Promise<void> => {

   try {
    setLoading(true)
    const userId = await AsyncStorage.getItem("userUUID");

    if (!userId) {
      throw new Error("User ID not found in AsyncStorage.");
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User document not found in Firestore.");
    }

    // 🔹 Get existing cart or empty array
    const data = userSnap.data();
    const currentCart: CartItem[] = data.cart || [];

    // 🔹 Check if item already exists in cart
    const existingIndex = currentCart.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
      // ✅ Item exists → update quantity
      currentCart[existingIndex].quantity += item.quantity;
    } else {
      // 🆕 New item → push to cart
      currentCart.push(item);
    }

    // 🔥 Update Firestore document
    await updateDoc(userRef, { cart: currentCart });
    refresh();
    setLoading(false)
    console.log("✅ Cart updated successfully!");
  } catch (error) {
    console.error("❌ Error updating cart:", error);
  }
};
