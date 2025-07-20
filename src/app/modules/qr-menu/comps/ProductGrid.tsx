import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/menu";

interface ProductGridProps {
  category: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  handleCartQuantityChange: (product: Product, increment: boolean, varietyId?: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, products, onProductClick, handleCartQuantityChange }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => onProductClick(product)}
            handleCartQuantityChange={handleCartQuantityChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 