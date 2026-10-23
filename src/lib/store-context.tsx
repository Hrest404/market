"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "./mock-data";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  comparison: string[];
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  user: AuthUser | null;
  loginUser: (user: AuthUser) => void;
  logoutUser: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparison, setComparison] = useState<string[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("apex_cart");
      const savedFavs = localStorage.getItem("apex_favorites");
      const savedComp = localStorage.getItem("apex_compare");
      const savedUser = localStorage.getItem("apex_user");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedComp) setComparison(JSON.parse(savedComp));
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error("Failed to load local state", e);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("apex_cart", JSON.stringify(cart));
      localStorage.setItem("apex_favorites", JSON.stringify(favorites));
      localStorage.setItem("apex_compare", JSON.stringify(comparison));
      if (user) {
        localStorage.setItem("apex_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("apex_user");
      }
    } catch (e) {
      console.error("Failed to save local state", e);
    }
  }, [cart, favorites, comparison, user, hydrated]);

  const loginUser = (newUser: AuthUser) => {
    setUser(newUser);
  };

  const logoutUser = () => {
    setUser(null);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.stock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.priceUzs * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const toggleCompare = (productId: string) => {
    setComparison((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        alert("В сравнение можно добавить не более 4 товаров.");
        return prev;
      }
      return [...prev, productId];
    });
  };

  const isInCompare = (productId: string) => comparison.includes(productId);

  const clearCompare = () => setComparison([]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        favorites,
        toggleFavorite,
        isFavorite,
        comparison,
        toggleCompare,
        isInCompare,
        clearCompare,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
