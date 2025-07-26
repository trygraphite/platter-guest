"use client";

import { useRestaurant } from "@/providers/restaurant";
import { CartButton } from "@/components/menu/cart-sheet";
import { RestaurantLanding } from "@/components/restaurant/RestaurantLanding";
import {
  transformRestaurantData,
  transformMenuData,
} from "@/utils/restaurant-data-transformer";
import type { MenuResponse } from "@/types/restaurant";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCart } from "@/providers/cart";
import { toast } from "sonner";
import { ChocoLoader } from "@/components/ui/choco-loader";
import { RestaurantLandingSkeleton } from "@/components/ui/restaurant-landing-skeleton";

interface ClientPageProps {
  subdomain: string;
  initialMenuData: MenuResponse | null;
  menuError: string | null;
}

export function ClientPage({
  subdomain,
  initialMenuData,
  menuError: serverMenuError,
}: ClientPageProps) {
  const {
    restaurant,
    isLoading: restaurantLoading,
    error: restaurantError,
  } = useRestaurant();

  const {
    data: menuData,
    isLoading: menuLoading,
    error: clientMenuError,
  } = useMenuItems(subdomain, initialMenuData);

  const { addItem } = useCart();
  const menuError = serverMenuError || clientMenuError;

  // Transform data for new components
  const restaurantData = restaurant
    ? transformRestaurantData(restaurant)
    : null;
  const menuDataTransformed = menuData ? transformMenuData(menuData) : null;

  // Handle menu item click
  const handleMenuItemClick = (item: any) => {
    // Convert back to the format expected by the cart
    const cartItem = {
      _id: item.id,
      name: item.name,
      price: item.price * 100, // Convert back to cents
      image: item.image || "",
      isAvailable: true,
      resolvedName: item.name,
      description: item.description,
      business: restaurant
        ? {
            _id: restaurant._id,
            name: restaurant.name,
            logo: restaurant.logo || "",
            image: restaurant.image || "",
          }
        : {
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
          name: item.category,
          description: "",
        },
        name: item.category,
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
      varieties: [],
    };

    addItem(cartItem);
    toast.success("Item Added!", {
      description: `${item.name} has been added to your order.`,
    });
  };

  if (restaurantLoading || menuLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <ChocoLoader
          fullScreen={false}
          label="Loading restaurant information"
          subLabel="Please wait while we prepare your dining experience"
        />
      </div>
    );
  }

  if (restaurantError || !restaurant || !restaurantData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">
            Failed to load restaurant data
          </p>
          <p className="text-sm text-destructive mt-2">
            {restaurantError?.message}
          </p>
        </div>
      </div>
    );
  }

  if (menuError || !menuDataTransformed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">Failed to load menu data</p>
          <p className="text-sm text-destructive mt-2">
            {typeof menuError === "string" ? menuError : menuError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RestaurantLanding
        restaurantData={restaurantData}
        menuData={menuDataTransformed}
        currency="₦"
        onMenuItemClick={handleMenuItemClick}
        isLoading={restaurantLoading || menuLoading}
        isRestaurantLoading={restaurantLoading}
        isMenuLoading={menuLoading}
      />
      <CartButton />
    </>
  );
}
