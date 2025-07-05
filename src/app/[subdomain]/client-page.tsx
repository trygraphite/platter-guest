"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRestaurant } from "@/providers/restaurant";
import { request } from "@/utils/request";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { CartButton } from "@/components/menu/cart-sheet";
import Container from "@/components/layout/container";
import type { MenuResponse } from "@/types/restaurant";

interface ClientPageProps {
  subdomain: string;
  initialMenuData: MenuResponse | null;
  menuError: string | null;
}

export function ClientPage({ subdomain, initialMenuData, menuError: serverMenuError }: ClientPageProps) {
  const { restaurant, isLoading: restaurantLoading, error: restaurantError } = useRestaurant();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: menuData,
    isLoading: menuLoading,
    error: clientMenuError,
  } = useQuery({
    queryKey: ["menu", subdomain],
    queryFn: async () => {
      const response = await request<{ data: MenuResponse }>(`/business/subdomain/${subdomain}/menu-items`);
      
      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }
      
      throw new Error("Menu not found");
    },
    initialData: initialMenuData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const menuItems = menuData?.docs || [];
  const menuError = serverMenuError || clientMenuError;

  // Get unique categories
  const categories = Array.from(
    new Set(menuItems.map(item => item.category?.group?.name).filter(Boolean))
  ) as string[];

  // Filter items by category
  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category?.group?.name === selectedCategory)
    : menuItems;

  // Format operating hours
  const formatOperatingHours = (hours: { day: string; opening: string; closing: string }[]) => {
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
    
    const todayHours = hours.find(h => h.day.toLowerCase() === currentDay);
    
    if (todayHours) {
      return `${todayHours.opening} - ${todayHours.closing}`;
    }
    return "Hours not available";
  };

  // Check if restaurant is open
  const isRestaurantOpen = () => {
    if (!restaurant?.hours?.length) return null;
    
    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = restaurant.hours.find(h => h.day.toLowerCase() === currentDay);
    
    if (!todayHours) return false;
    
    return currentTime >= todayHours.opening && currentTime <= todayHours.closing;
  };

  const isOpen = isRestaurantOpen();

  if (restaurantLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
          <p className="text-muted-foreground">Failed to load restaurant data</p>
          <p className="text-sm text-destructive mt-2">{restaurantError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary to-primary/80">
        {restaurant.image && (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Container className="text-center text-white">
            {restaurant.logo && (
              <div className="mb-4">
                <img
                  src={restaurant.logo}
                  alt={`${restaurant.name} logo`}
                  className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border-4 border-white shadow-lg"
                />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto">
              {restaurant.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className={`px-4 py-2 rounded-full font-medium ${
                isOpen === true 
                  ? "bg-green-500 text-white" 
                  : isOpen === false 
                  ? "bg-red-500 text-white"
                  : "bg-muted text-muted-foreground"
              }`}>
                {isOpen === true ? "Open Now" : isOpen === false ? "Closed" : "Hours Unknown"}
              </div>
              
              {restaurant.hours.length > 0 && (
                <span className="text-white/80 bg-black/20 px-3 py-1 rounded-full">
                  Today: {formatOperatingHours(restaurant.hours)}
                </span>
              )}
            </div>
          </Container>
        </div>
      </div>

      {/* Content */}
      <Container className="py-6 md:py-8">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-6 md:mb-8">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                all
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category.toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Category Title */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground capitalize">
            {selectedCategory || "All Items"}
          </h2>
        </div>

        {/* Menu Items */}
        {menuLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading menu...</p>
            </div>
          </div>
        ) : menuError ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Error loading menu</h3>
            <p className="text-muted-foreground">Please try again later</p>
            <p className="text-sm text-destructive mt-2">{typeof menuError === 'string' ? menuError : menuError.message}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {selectedCategory 
                ? `No items available in "${selectedCategory}" category` 
                : "This restaurant hasn't added any menu items yet"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* Restaurant Info */}
        <div className="mt-12 bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Contact:</span>{" "}
              <span className="text-muted-foreground">{restaurant.contacts.name}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Phone:</span>{" "}
              <span className="text-muted-foreground">{restaurant.contacts.phone}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Email:</span>{" "}
              <span className="text-muted-foreground">{restaurant.contacts.email.value}</span>
            </div>
            {restaurant.website && (
              <div>
                <span className="font-medium text-foreground">Website:</span>{" "}
                <span className="text-muted-foreground">{restaurant.website}</span>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Floating Cart Button */}
      <CartButton />
    </Container>
  );
}
