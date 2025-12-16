import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/firebase/firebase.config";
import { collection, query, where, onSnapshot, orderBy, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminOrder, setAdminOrder] = useState([]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userUUID");
      console.log(userId)
      if (!userId) throw new Error("User ID not found");

      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(list);
        console.log("orders list", orders)
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("❌ Error fetching user orders:", error);
      setLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const allOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdminOrder(allOrders);
      setLoading(false);
    });

    return unsubscribe; // cl
  };

  useEffect(() => {
    let unsubscribe;
    const init = async () => {
      unsubscribe = await fetchUserOrders();
    };
    init();

    fetchUserOrders();
    fetchAllOrders();
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, adminOrder, loading, fetchUserOrders, fetchAllOrders }}>
      {children}
    </OrderContext.Provider>
  );
};
