// Shared types for menu components

export interface Variety {
  _id: string;
  name: string;
  price: number;
  outOfStock?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  priceFrom?: boolean;
  weight?: string;
  image?: string;
  outOfStock?: boolean;
  description?: string;
  category?: {
    name?: string;
    group?: {
      name?: string;
    };
  };
  varieties?: Variety[];
}

export interface CartItem {
  product: Product;
  quantity: number;
} 