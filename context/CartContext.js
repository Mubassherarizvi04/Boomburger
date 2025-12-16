// context/CartContext.tsx
import React, { createContext, useContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addItems = (items) => setCart((prev) => [...prev, ...items]);
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
