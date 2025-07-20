"use client";

import React, { createContext, useContext, useReducer } from "react";
import type { Cart, CartItem, MenuItem, MenuItemVariety } from "@/types/restaurant";

interface CartContextType {
  cart: Cart;
  addItem: (item: MenuItem, variety?: MenuItemVariety, quantity?: number, note?: string) => void;
  removeItem: (menuItemId: string, varietyId?: string) => void;
  updateQuantity: (menuItemId: string, varietyId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string, varietyId?: string) => number;
}

interface CartAction {
  type: "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY" | "CLEAR_CART";
  payload?: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuItem, variety, quantity = 1, note } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.menuItemId === menuItem._id &&
          item.varietyId === variety?._id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
        if (note) {
          newItems[existingItemIndex].note = note;
        }
      } else {
        // Add new item
        const newItem: CartItem = {
          menuItemId: menuItem._id,
          varietyId: variety?._id,
          quantity,
          menuItem,
          selectedVariety: variety,
          note,
        };
        newItems = [...state.items, newItem];
      }

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const total = newItems.reduce((sum, item) => {
        const price = item.selectedVariety?.price || item.menuItem.price;
        return sum + price * item.quantity;
      }, 0);

      return {
        items: newItems,
        itemCount,
        total,
      };
    }

    case "REMOVE_ITEM": {
      const { menuItemId, varietyId } = action.payload;
      const newItems = state.items.filter(
        (item) =>
          !(item.menuItemId === menuItemId && item.varietyId === varietyId)
      );

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const total = newItems.reduce((sum, item) => {
        const price = item.selectedVariety?.price || item.menuItem.price;
        return sum + price * item.quantity;
      }, 0);

      return {
        items: newItems,
        itemCount,
        total,
      };
    }

    case "UPDATE_QUANTITY": {
      const { menuItemId, varietyId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { menuItemId, varietyId },
        });
      }

      const newItems = state.items.map((item) =>
        item.menuItemId === menuItemId && item.varietyId === varietyId
          ? { ...item, quantity }
          : item
      );

      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const total = newItems.reduce((sum, item) => {
        const price = item.selectedVariety?.price || item.menuItem.price;
        return sum + price * item.quantity;
      }, 0);

      return {
        items: newItems,
        itemCount,
        total,
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        itemCount: 0,
        total: 0,
      };

    default:
      return state;
  }
}

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    itemCount: 0,
    total: 0,
  });

  const addItem = (
    item: MenuItem,
    variety?: MenuItemVariety,
    quantity = 1,
    note?: string
  ) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { menuItem: item, variety, quantity, note },
    });
  };

  const removeItem = (menuItemId: string, varietyId?: string) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { menuItemId, varietyId },
    });
  };

  const updateQuantity = (
    menuItemId: string,
    varietyId: string | undefined,
    quantity: number
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { menuItemId, varietyId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemQuantity = (menuItemId: string, varietyId?: string) => {
    const item = cart.items.find(
      (item) =>
        item.menuItemId === menuItemId && item.varietyId === varietyId
    );
    return item?.quantity || 0;
  };

  const value: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export { CartContext }; 