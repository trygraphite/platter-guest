"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCart } from "@/providers/cart";

interface CartSheetProps {
  children: React.ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Checkout:', cart);
    alert('Checkout functionality coming soon!');
  };

  const CartContent = () => (
    <div className="h-full flex flex-col">
      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground">Start adding some items to your cart</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-1">
              {cart.items.map((item) => {
                const displayPrice = item.selectedVariety?.price || item.menuItem.price;
                const itemTotal = displayPrice * item.quantity;

                return (
                  <div key={`${item.menuItemId}-${item.varietyId}`} className="bg-card rounded-lg p-4 border">
                    <div className="flex gap-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground leading-tight">
                          {item.menuItem.name}
                        </h4>
                        {item.selectedVariety && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.selectedVariety.name}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-sm text-muted-foreground mt-1 italic">
                            Note: {item.note}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.menuItemId, item.varietyId, item.quantity - 1)}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.menuItemId, item.varietyId, item.quantity + 1)}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-foreground">
                              {formatPrice(itemTotal)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.menuItemId, item.varietyId)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="border-t bg-background p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Subtotal:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Price is not final, it may include service charge
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleCheckout} 
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                place order
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="flex-1"
                >
                  clear
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your cart
            </SheetTitle>
            <SheetDescription>
              Review your items and proceed to checkout
            </SheetDescription>
          </SheetHeader>
          <CartContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] flex flex-col">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your cart
          </DrawerTitle>
          <DrawerDescription>
            Review your items and proceed to checkout
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 px-4">
          <CartContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// Floating Cart Button Component
export function CartButton() {
  const { cart } = useCart();

  if (cart.itemCount === 0) return null;

  return (
    <CartSheet>
      <Button
        className="fixed bottom-6 right-6 h-16 px-6 rounded-full shadow-lg z-50 bg-primary text-primary-foreground hover:bg-primary/90"
        size="lg"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        <span className="mr-2">cart</span>
        <span className="bg-primary-foreground text-primary rounded-full px-2 py-1 text-sm font-bold">
          {formatPrice(cart.total)}
        </span>
      </Button>
    </CartSheet>
  );
}

// Helper function for price formatting
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price / 100);
}; 