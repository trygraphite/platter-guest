export interface RestaurantData {
  name: string;
  tagline: string;
  logo?: string;
  backgroundImage?: string;
  location: string;
  openingHours: string;
  hours: { day: string; opening: string; closing: string }[];
  cuisineType: string;
  rating?: number;
  reviewSnippet?: string;
  acceptsOrders: boolean;
  socialMedia?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface MenuItemVariety {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  popular?: boolean;
  varieties?: MenuItemVariety[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface RestaurantMenuData {
  categories: MenuCategory[];
} 