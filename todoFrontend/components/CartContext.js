import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    // Check if the product is already in the cart
    const existingItem = cartItems.find((item) => item.product.id === product.id);
    if (existingItem) {
      // Update the quantity if the product is already in the cart
      existingItem.quantity += quantity;
      setCartItems([...cartItems]);
    } else {
      // Add the product to the cart if it's not already in the cart
      setCartItems([...cartItems, { product, quantity }]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
