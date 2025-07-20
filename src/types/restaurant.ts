export interface Restaurant {
  _id: string;
  name: string;
  resolvedName: string;
  description: string;
  subdomain: string;
  website?: string;
  address?: {
    address: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  contacts: {
    email: {
      value: string;
      verified: boolean;
    };
    name: string;
    phone: string;
  };
  hours: Array<{
    day: string;
    opening: string;
    closing: string;
  }>;
  logo?: string;
  image?: string;
  socials?: string[];
}

export interface MenuItemVariety {
  _id: string;
  name: string;
  image: string;
  resolvedName: string;
  description: string;
  price: number;
  isAvailable: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  business: {
    _id: string;
    name: string;
    logo: string;
    image: string;
  };
  servicePoint: {
    _id: string;
    name: string;
    description: string;
  };
  category: {
    _id: string;
    group: {
      _id: string;
      name: string;
      description: string;
    };
    name: string;
    description: string;
  };
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: {
      value: string;
    };
  };
  varieties: MenuItemVariety[];
  name: string;
  image: string;
  isAvailable: boolean;
  resolvedName: string;
  description: string;
  price: number;
}

export interface MenuResponse {
  docs: MenuItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface CartItem {
  menuItemId: string;
  varietyId?: string;
  quantity: number;
  menuItem: MenuItem;
  selectedVariety?: MenuItemVariety;
  note?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Order-related types
export interface OrderItem {
  item: string;
  variety: string;
  status: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  image: string;
  description: string;
  resolvedName: string;
}

export interface OrderData {
  _id: string;
  customer: string;
  orderNumber: number;
  amount: number;
  vat: number;
  paymentMethod: string;
  table: {
    _id: string;
    name: string;
    resolvedName: string;
    link: string;
  };
  items: OrderItem[];
  status: string;
}

export interface OrderResponse {
  path: string;
  message: string;
  timestamp: string;
  data: OrderData;
}

export interface OrderStatusPageClientProps {
  subdomain: string;
  qr: string;
  orderId: string;
}

export interface RestaurantHeaderProps {
  restaurant: Restaurant | null;
  getTodayHours: (
    hours: { day: string; opening: string; closing: string }[] | undefined
  ) => string | null;
  qr: string;
}
