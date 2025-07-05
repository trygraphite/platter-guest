"use client";

import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useCart } from "@/providers/cart";
import type { MenuItem, MenuItemVariety } from "@/types/restaurant";

interface MenuItemDialogProps {
  item: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuItemDialog({ item, open, onOpenChange }: MenuItemDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-foreground">{item.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {item.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <MenuItemForm item={item} onClose={() => onOpenChange(false)} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="text-left pb-4">
          <DrawerTitle className="text-xl font-bold text-foreground">{item.name}</DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            {item.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <MenuItemForm item={item} onClose={() => onOpenChange(false)} className="px-4" />
        </div>
        <DrawerFooter className="pt-4 pb-6">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface MenuItemFormProps {
  item: MenuItem;
  onClose: () => void;
  className?: string;
}

function MenuItemForm({ item, onClose, className }: MenuItemFormProps) {
  const { addItem, getItemQuantity } = useCart();
  const [selectedVariety, setSelectedVariety] = useState<MenuItemVariety | undefined>(
    item.varieties.find(v => v.isDefault) || item.varieties[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const currentQuantity = getItemQuantity(item._id, selectedVariety?._id);
  const displayPrice = selectedVariety?.price || item.price;
  const totalPrice = displayPrice * quantity;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const handleAddToCart = () => {
    addItem(item, selectedVariety, quantity, note);
    onClose();
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className={`space-y-6 pb-4 ${className}`}>
      {/* Image */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-64 object-cover rounded-lg"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
            <span className="text-white font-medium bg-black/40 px-4 py-2 rounded-full">
              Not Available
            </span>
          </div>
        )}
      </div>

      {/* Varieties Selection */}
      {item.varieties.length > 1 && (
        <div className="space-y-4">
          <Label className="text-lg font-semibold text-foreground">Choose Size</Label>
          <div className="space-y-3">
            {item.varieties.map((variety) => (
              <label
                key={variety._id}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedVariety?._id === variety._id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
                onClick={() => setSelectedVariety(variety)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedVariety?._id === variety._id
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}>
                    {selectedVariety?._id === variety._id && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{variety.name}</div>
                    {variety.description && (
                      <div className="text-sm text-muted-foreground">{variety.description}</div>
                    )}
                  </div>
                </div>
                <div className="font-bold text-foreground">
                  {formatPrice(variety.price)}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Category and Service Point Info */}
      <div className="space-y-2 text-sm">
        {item.category && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Category:</span>
            <span className="bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {item.category.name}
            </span>
          </div>
        )}
        {item.servicePoint && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Service Point:</span>
            <span className="bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {item.servicePoint.name}
            </span>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-foreground">Quantity</Label>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="h-12 w-12 p-0 rounded-full border-2"
          >
            <Minus className="h-5 w-5" />
          </Button>
          <span className="text-xl font-bold w-12 text-center text-foreground">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={incrementQuantity}
            className="h-12 w-12 p-0 rounded-full border-2"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-4">
        <Label htmlFor="note" className="text-lg font-semibold text-foreground">
          Add your comment
        </Label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Any special requests..."
          className="w-full p-4 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          rows={3}
        />
      </div>

      {/* Current Cart Info */}
      {currentQuantity > 0 && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
          <span className="text-sm text-primary font-medium">
            Already in cart: {currentQuantity} item{currentQuantity > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={!item.isAvailable}
        className="w-full h-14 text-lg font-semibold"
        size="lg"
      >
        add for {formatPrice(totalPrice)}
      </Button>
    </div>
  );
} 