import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/menu";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  handleCartQuantityChange: (product: Product, increment: boolean, varietyId?: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, handleCartQuantityChange }) => {
  const hasMultipleVarieties = product.varieties && product.varieties.length > 1;

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleVarieties) {
      onClick(); // Open modal for multiple varieties
    } else {
      // Add single variety or base product directly
      const varietyId = product.varieties && product.varieties.length === 1 
        ? product.varieties[0]._id 
        : undefined;
      handleCartQuantityChange(product, true, varietyId);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      onClick();
    }
  };

  return (
    <div className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border rounded-xl bg-gradient-to-br from-white to-orange-100" onClick={handleCardClick}>
      <div className="relative">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={200}
            className="w-full h-32 sm:h-40 md:h-48 object-cover"
          />
        )}
        {product.outOfStock && (
          <span className="absolute top-3 left-3 bg-gray-200 px-2 py-1 rounded text-xs">Out of stock</span>
        )}
      </div>
      <div className="p-2 sm:p-3 md:p-4">
        <div className="flex items-start justify-between mb-1 sm:mb-2">
          <div className="flex-1">
            <div className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1">
              {product.varieties && product.varieties.length > 1 ? "from " : ""}
              {formatPrice(product.price)}
            </div>
            <h3 className="font-medium text-sm sm:text-base mb-0.5 sm:mb-1">{product.name}</h3>
            {product.weight && (
              <p className="text-xs sm:text-sm text-muted-foreground">{product.weight}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 sm:mt-4">
          <div />
          <Button
            size="sm"
            className={`rounded-full w-8 h-8 p-0 ${product.outOfStock ? "bg-gray-400 cursor-not-allowed" : ""}`}
            onClick={handleButtonClick}
            disabled={product.outOfStock}
            aria-label={
              product.outOfStock 
                ? "Out of stock" 
                : hasMultipleVarieties 
                  ? `Select ${product.name} options` 
                  : `Add ${product.name} to cart`
            }
          >
            {hasMultipleVarieties ? <ChevronRight className="w-4 h-4" /> : "+"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 