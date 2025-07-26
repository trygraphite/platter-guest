import { Restaurant } from "@/types/restaurant";
import { MenuResponse } from "@/types/restaurant";
import { RestaurantData, MenuItem, MenuCategory, RestaurantMenuData } from "@/types/restaurant-landing";

// Transform restaurant data to new format
export function transformRestaurantData(restaurant: Restaurant): RestaurantData {
  // Format operating hours
  const formatOperatingHours = (hours: { day: string; opening: string; closing: string }[]) => {
    const currentDay = [
      "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
    ][new Date().getDay()];

    const todayHours = hours.find((h) => h.day.toLowerCase() === currentDay);
    if (todayHours) {
      return `${todayHours.opening} - ${todayHours.closing}`;
    }
    return "Closed today";
  };

  // Create location string
  const location = restaurant.address 
    ? `${restaurant.address.address}, ${restaurant.address.city}, ${restaurant.address.country}`
    : "Location not specified";

  const transformedData = {
    name: restaurant.name,
    tagline: restaurant.description,
    logo: restaurant.logo,
    backgroundImage: restaurant.image,
    location,
    openingHours: formatOperatingHours(restaurant.hours),
    hours: restaurant.hours,
    cuisineType: "Restaurant", // Default value, can be enhanced later
    rating: 4.5, // Default rating, can be enhanced later
    reviewSnippet: "Amazing food and great service!", // Default review, can be enhanced later
    acceptsOrders: true, // Default to true, can be enhanced later
    socialMedia: {
      website: restaurant.website,
      facebook: undefined, // Can be enhanced later
      instagram: undefined, // Can be enhanced later
      twitter: undefined, // Can be enhanced later
    },
  };

  console.log('Transformed restaurant data:', {
    name: transformedData.name,
    logo: transformedData.logo,
    hasLogo: !!transformedData.logo,
    logoType: typeof transformedData.logo
  });

  return transformedData;
}

// Transform menu data to new format
export function transformMenuData(menuResponse: MenuResponse): RestaurantMenuData {
  const menuItems = menuResponse.docs || [];

  // Group items by category name (not group name)
  const categoryMap = new Map<string, { id: string; name: string; items: MenuItem[] }>();

  menuItems.forEach((item) => {
    const categoryId = item.category?._id || item.category?.name || "other";
    const categoryName = item.category?.name || "Other";

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, { id: categoryId, name: categoryName, items: [] });
    }

    const transformedItem: MenuItem = {
      id: item._id,
      name: item.name,
      description: item.description || "",
      price: item.price, 
      image: item.image,
      category: categoryName,
      popular: false, // Default to false, can be enhanced later
      varieties: item.varieties?.map(variety => ({
        id: variety._id,
        name: variety.name,
        price: variety.price,
        description: variety.description || "",
      })) || [],
    };

    categoryMap.get(categoryId)!.items.push(transformedItem);
  });

  // Convert to categories array
  const categories: MenuCategory[] = Array.from(categoryMap.values());

  return {
    categories,
  };
} 