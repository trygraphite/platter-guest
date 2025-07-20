"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import type { Product } from "../../../types/menu";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useRestaurant } from "@/providers/restaurant";
import { useCart } from "@/providers/cart";
import RestaurantHeader from "./RestaurantHeader";
import MenuProductGrid from "./MenuProductGrid";
import CartSummary from "./CartSummary";
import { ChocoLoader } from "@/components/ui/choco-loader";

// Types
interface MenuPageClientProps {
  subdomain: string;
  qr: string;
  initialMenuData: any;
}

// Custom hooks for reusable logic
function useCategories(items: Product[]) {
  return useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item.category?.group?.name).filter(Boolean))
    ) as string[];
  }, [items]);
}

// MAIN COMPONENT
export default function MenuPageClient({
  subdomain,
  qr,
  initialMenuData,
}: MenuPageClientProps) {
  const {
    data: menuData,
    isLoading,
    error,
  } = useMenuItems(subdomain, initialMenuData);
  const {
    restaurant,
  } = useRestaurant();
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const menuItems: Product[] = menuData?.docs || [];
  const categories = useCategories(menuItems);

  useEffect(() => {
    if (categories.length && !activeCategory) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  // open modal and set product on product click
  const openModalWithProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  // Handlers
  const addToCart = useCallback(
    (product: Product, varietyId?: string) => {
      if (product.outOfStock) return;
      // Find the specific variety if provided
      const selectedVarietyRaw = varietyId
        ? product.varieties?.find(v => v._id === varietyId)
        : (product.varieties && product.varieties.length === 1 ? product.varieties[0] : undefined);
      // Convert to MenuItemVariety shape if present
      const selectedVariety = selectedVarietyRaw
        ? {
            _id: selectedVarietyRaw._id,
            name: selectedVarietyRaw.name,
            image: "",
            resolvedName: selectedVarietyRaw.name,
            description: "",
            price: selectedVarietyRaw.price,
            isAvailable: !selectedVarietyRaw.outOfStock,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : undefined;
      // Convert Product to MenuItem format for CartProvider
      const menuItem = {
        _id: product._id,
        name: product.name,
        price: selectedVariety?.price || product.price,
        image: product.image || "",
        isAvailable: !product.outOfStock,
        resolvedName: product.name,
        description: "",
        business: restaurant ? {
          _id: restaurant._id,
          name: restaurant.name,
          logo: restaurant.logo || "",
          image: restaurant.image || "",
        } : {
          _id: "",
          name: "Restaurant",
          logo: "",
          image: "",
        },
        servicePoint: {
          _id: "",
          name: "Service Point",
          description: "",
        },
        category: {
          _id: "",
          group: {
            _id: "",
            name: product.category?.group?.name || "General",
            description: "",
          },
          name: product.category?.group?.name || "General",
          description: "",
        },
        createdBy: {
          _id: "",
          firstName: "Admin",
          lastName: "User",
          email: {
            value: "admin@example.com",
          },
        },
        varieties: product.varieties?.map(v => ({
          _id: v._id,
          name: v.name,
          image: "",
          resolvedName: v.name,
          description: "",
          price: v.price,
          isAvailable: !v.outOfStock,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) || [],
      };
      addItem(menuItem, selectedVariety);
    },
    [addItem, restaurant]
  );

  // Robust cart quantity handler
  const handleCartQuantityChange = useCallback(
    (product: Product, increment: boolean, varietyId?: string) => {
      const cartItem = cart.items.find(
        (item) =>
          item.menuItemId === product._id &&
          (varietyId ? item.varietyId === varietyId : !item.varietyId)
      );
      if (cartItem) {
        if (!increment && cartItem.quantity === 1) {
          removeItem(product._id, varietyId);
        } else {
          updateQuantity(product._id, varietyId, cartItem.quantity + (increment ? 1 : -1));
        }
      } else if (increment) {
        addToCart(product, varietyId);
      }
    },
    [cart.items, addToCart, removeItem, updateQuantity]
  );

  // Handlers for category/group selection
  // Remove group/category selection logic and UI
  // Only keep categories and activeCategory

  // Cart open/close scroll lock (optional, for mobile UX)
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const clearCartHandler = () => {
    clearCart();
    setIsCartOpen(false);
  };

  const callWaiter = () =>
    alert("🙋‍♂️ Waiter has been called! Someone will be with you shortly.");

  const requestBill = () => {
    if (!cart.items.length) {
      alert("🧾 Your bill is $0.00. Add some items to your order first!");
      return;
    }
    const cartDetails = cart.items
      .map(
        (item) =>
          `${item.menuItem.name}${item.selectedVariety ? ` (${item.selectedVariety.name})` : ""} x${item.quantity} = $${(
            (item.selectedVariety?.price || item.menuItem.price) * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");
    alert(
      `🧾 Your Bill:\n\n${cartDetails}\n\n💰 Total: $${cart.total.toFixed(
        2
      )}\n\nBill has been requested!`
    );
  };

  // UI
  if (isLoading) return <ChocoLoader label="Loading menu..." subLabel="Please wait while we fetch the menu items" />;
  if (error)
    return (
      <div className="p-8 text-center text-red-500">Error loading menu.</div>
    );
  if (!menuItems.length)
    return <div className="p-8 text-center">No menu items found.</div>;

  // Only show category navigation (no group UI)
  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader restaurant={restaurant} qr={qr} />
     
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <MenuProductGrid
          menuItems={menuItems}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          openModalWithProduct={openModalWithProduct}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          selectedProduct={selectedProduct}
          handleCartQuantityChange={handleCartQuantityChange}
        />
      </div>
      <CartSummary
        cart={cart.items}
        cartTotal={cart.total}
        cartItemsCount={cart.itemCount}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        handleCartQuantityChange={handleCartQuantityChange}
        clearCart={clearCartHandler}
        callWaiter={callWaiter}
        requestBill={requestBill}
        qr={qr}
      />
    </div>
  );
}