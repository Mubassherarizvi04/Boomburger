import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase.config";

/**
 * Update quantity of a specific cart item
 * @param {string} itemId - Item ID in cart
 * @param {number} change - +1 or -1
 */
export const UpdateCartQuantity = async (itemId, change) => {
  try {
    const userId = await AsyncStorage.getItem("userUid");
    if (!userId) throw new Error("User not found in AsyncStorage");

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User not found in Firestore");

    const userData = userSnap.data();
    const cart = userData.cart || [];

    // 🔹 Find and update quantity
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 }; // quantity never < 1
      }
      return item;
    });

    // 🔹 Save updated cart to Firestore
    await updateDoc(userRef, { cart: updatedCart });

    console.log("✅ Quantity updated for item:", itemId);
    return updatedCart;
  } catch (error) {
    console.error("❌ Error updating quantity:", error);
    return null;
  }
};
export const removeCartItem = async (itemId,setLoading) => {
  try {
    setLoading(true)
    const userId = await AsyncStorage.getItem("userUid");
    if (!userId) throw new Error("User not found in AsyncStorage");

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User not found in Firestore");

    const userData = userSnap.data();
    const cart = Array.isArray(userData.cart) ? userData.cart : [];

    console.log("🛍️ Current cart before delete:", cart);

    // 🔹 Filter out item to remove
    const updatedCart = cart.filter((item) => item.id !== itemId);

    console.log("🗑️ Updated cart after delete:", updatedCart);
    setLoading(false)

    // 🔹 Update Firestore
    await updateDoc(userRef, {
      cart: updatedCart,
    });

    console.log("✅ Item removed successfully:", itemId);

    return updatedCart;
  } catch (error) {
    console.error("❌ Error removing item:", error);
    return null;
  }
};
