import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/menu";
import { ProductGridSkeleton } from "@/components/ui/restaurant-skeleton";

interface ProductGridProps {
  category: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  handleCartQuantityChange: (product: Product, increment: boolean, varietyId?: string) => void;
  isLoading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  category, 
  products, 
  onProductClick, 
  handleCartQuantityChange,
  isLoading = false 
}) => {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  return (
    <div className="animate-in fade-in duration-700">
      <h2 className="text-2xl font-bold mb-4 capitalize animate-in slide-in-from-bottom-4 duration-500">{category}</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product, index: number) => (
          <div 
            key={product._id}
            className="animate-in fade-in duration-500"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard
              product={product}
              onClick={() => onProductClick(product)}
              handleCartQuantityChange={handleCartQuantityChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 