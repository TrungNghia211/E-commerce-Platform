"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getCartCount } from "@/apiRequests/cart";
import { clientSessionToken } from "@/lib/http";

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined)
    throw new Error("useCart must be used within a CartProvider");
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    if (!clientSessionToken.value) {
      setCartCount(0);
      return;
    }

    try {
      const count = await getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Error refreshing cart count:", error);
    }
  };

  useEffect(() => {
    const handleCartUpdate = () => {
      if (clientSessionToken.value) refreshCartCount();
      else setCartCount(0);
    };

    if (clientSessionToken.value) handleCartUpdate();

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("login", handleCartUpdate);
    window.addEventListener("logout", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("login", handleCartUpdate);
      window.removeEventListener("logout", handleCartUpdate);
    };
  }, [refreshCartCount]);

  const value = {
    cartCount,
    refreshCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
