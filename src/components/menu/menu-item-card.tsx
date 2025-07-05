"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/providers/cart";
import type { MenuItem } from "@/types/restaurant";
import { MenuItemDialog } from "./menu-item-dialog";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addItem, getItemQuantity } = useCart();

  const defaultVariety = item.varieties.find(v => v.isDefault) || item.varieties[0];
  const displayPrice = defaultVariety?.price || item.price;
  const hasVarieties = item.varieties.length > 1;
  
  const currentQuantity = getItemQuantity(item._id, defaultVariety?._id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVarieties) {
      setIsOpen(true);
    } else {
      addItem(item, defaultVariety);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  return (
    <>
      <Card 
        className="group cursor-pointer overflow-hidden bg-card hover:shadow-lg transition-all duration-300 border-border"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-medium bg-black/40 px-3 py-1 rounded-full">
                Not Available
              </span>
            </div>
          )}
          {currentQuantity > 0 && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md">
              {currentQuantity}
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg leading-tight mb-1">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(displayPrice)}
                </span>
                {hasVarieties && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    from
                  </span>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="ml-3 h-10 w-10 p-0 rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              onClick={handleQuickAdd}
              disabled={!item.isAvailable}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          
          {item.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">
              {item.category && (
                <span className="bg-muted px-2 py-1 rounded-full">
                  {item.category.name}
                </span>
              )}
            </div>
            
            {hasVarieties && (
              <span className="text-xs text-muted-foreground font-medium">
                Multiple sizes
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <MenuItemDialog
        item={item}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
} 