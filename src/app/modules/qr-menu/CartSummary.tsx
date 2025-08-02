import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, Plus, Minus, Bell } from "lucide-react";
import type { CartItem as RestaurantCartItem } from "../../../types/restaurant";
import type { Product } from "../../../types/menu";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { useEditOrder } from "@/hooks/useEditOrder";
import { useRouter, useSearchParams } from "next/navigation";
import { useRestaurant } from "@/providers/restaurant";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface CartSummaryProps {
  cart: RestaurantCartItem[];
  cartTotal: number;
  cartItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  handleCartQuantityChange: (
    product: Product,
    increment: boolean,
    varietyId?: string
  ) => void;
  clearCart: () => void;
  qr: string;
}

function CartItemRow({
  item,
  handleCartQuantityChange,
}: {
  item: RestaurantCartItem;
  handleCartQuantityChange: (
    product: Product,
    increment: boolean,
    varietyId?: string
  ) => void;
}) {
  // Convert back to Product format for addToCart
  const product: Product = {
    _id: item.menuItem._id,
    name: item.menuItem.name,
    price: item.menuItem.price,
    image: item.menuItem.image,
    outOfStock: !item.menuItem.isAvailable,
    varieties: item.menuItem.varieties?.map((v) => ({
      _id: v._id,
      name: v.name,
      price: v.price,
      outOfStock: !v.isAvailable,
    })),
    category: item.menuItem.category,
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCartQuantityChange(product, true, item.varietyId);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCartQuantityChange(product, false, item.varietyId);
  };

  const isOutOfStock = item.selectedVariety
    ? !item.selectedVariety.isAvailable
    : !item.menuItem.isAvailable;

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
      {item.menuItem.image && (
        <Image
          src={item.menuItem.image}
          alt={item.menuItem.name}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-lg"
        />
      )}
      <div className="flex-1">
        <h3 className="font-medium text-base">{item.menuItem.name}</h3>
        <p className="text-muted-foreground text-sm">
          {formatPrice(item.selectedVariety?.price || item.menuItem.price)}
        </p>
        {item.selectedVariety && (
          <p className="text-xs text-gray-500">{item.selectedVariety.name}</p>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          className="w-8 h-8 p-0"
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="w-8 h-8 p-0"
          disabled={isOutOfStock}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <div className="text-right">
        <p className="font-medium">
          {formatPrice(
            (item.selectedVariety?.price || item.menuItem.price) * item.quantity
          )}
        </p>
      </div>
    </div>
  );
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  cartTotal,
  cartItemsCount,
  isCartOpen,
  setIsCartOpen,
  handleCartQuantityChange,
  clearCart,
  qr,
}) => {
  const [isActionsExpanded, setIsActionsExpanded] = React.useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const { placeOrder } = usePlaceOrder();
  const { restaurant } = useRestaurant();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if we're in editing mode
  const isEditing = searchParams.get("editing") === "true";
  const orderId = searchParams.get("orderId");

  // Get customer ID from cookie
  const getCustomerId = () => {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(/user_token_client=([^;]+)/);
    return match ? match[1] : "";
  };

  // Initialize edit order hook if in editing mode
  const customerId = getCustomerId();
  const businessId = restaurant?._id;
  const { mutate: editOrder, isPending: isEditingOrder } = useEditOrder(
    businessId || "",
    customerId
  );

  // Helper to map cart to order payload
  const getOrderPayload = () => {
    return {
      items: cart.map((item) => ({
        item: item.menuItemId,
        variety: item.varietyId || "",
        quantity: item.quantity,
      })),
    };
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      if (isEditing && orderId) {
        // Update existing order
        await editOrder(
          {
            order: orderId,
            items: getOrderPayload().items,
          },
          {
            onSuccess: () => {
              alert("Order updated successfully!");
              clearCart();
              setIsCartOpen(false);
              // Navigate back to order status page
              router.push(`/${qr}/order-status/${orderId}`);
            },
            onError: (error) => {
              console.error("Failed to update order:", error);
              alert("Failed to update order. Please try again.");
            },
          }
        );
      } else {
        // Place new order
        const orderResponse = await placeOrder(getOrderPayload());
        clearCart();
        setIsCartOpen(false);

        // Extract orderId from the response
        const newOrderId = orderResponse?.data?._id || orderResponse?._id;

        // Pass both orderId and businessId to the order status page
        if (newOrderId && businessId) {
          const redirectUrl = `/${qr}/order-status/${newOrderId}?businessId=${businessId}`;
          console.log(
            "[CartSummary] Redirecting to:",
            redirectUrl,
            "with businessId:",
            businessId
          );
          router.push(
            `/${qr}/order-status/${newOrderId}?businessId=${businessId}`
          );
        } else {
          alert("Order placed, but could not get order or business ID.");
        }
      }
    } catch (err: any) {
      alert(err?.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      {/* Cart Button - Only show if cart has items */}
      <div className="fixed bottom-20 right-10 z-40 flex items-end space-x-3">
        {cart.length > 0 && (
          <Button
            onClick={() => setIsCartOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-6 rounded-xl shadow-lg w-[300px] animate-in slide-in-from-bottom-4 duration-500"
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-xl font-medium">Cart</span>
              <span className="text-xl font-bold text-white drop-shadow-sm">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </Button>
        )}
      </div>

      {/* Bottom Slider - Only show if cart has items */}
      {isCartOpen && cart.length > 0 && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Slider Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-3xl h-[70vh] overflow-hidden shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Order</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-gray-500 hover:text-red-500"
                    title="Clear cart"
                  >
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="overflow-y-auto h-[calc(70vh-230px)]">
              {cart.map((item) => (
                <CartItemRow
                  key={item.menuItemId + (item.varietyId || "")}
                  item={item}
                  handleCartQuantityChange={handleCartQuantityChange}
                />
              ))}

              {/* Special Notes */}
              <div className="p-4 border-t border-gray-200">
                <label
                  htmlFor="special-notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Special Notes
                </label>
                <textarea
                  id="special-notes"
                  placeholder="Any special requests or instructions..."
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={2}
                />
              </div>
            </div>

            {/* Footer with Total and Checkout */}
            <div className="px-6 py-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-xl font-bold">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-2xl py-6 rounded-xl"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || isEditingOrder}
              >
                {isPlacingOrder || isEditingOrder
                  ? isEditing
                    ? "Updating Order..."
                    : "Placing Order..."
                  : isEditing
                  ? "Update Order"
                  : "Proceed to Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSummary;
