import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useRestaurant } from "@/providers/restaurant";

interface OrderItem {
  item: string;
  variety: string;
  quantity: number;
}

interface PlaceOrderPayload {
  items: OrderItem[];
}

export function usePlaceOrder() {
  const params = useParams<{ qr: string }>();
  const { restaurant } = useRestaurant();

  // Get customer ID from cookie
  const getCustomerId = () => {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(/user_token_client=([^;]+)/);
    return match ? match[1] : "";
  };

  const getTableId = () => {
    // qr param is like '686999dd17cc79f9cf33ee90-a6'
    const qr = params.qr;
    if (!qr) return "";
    return qr.split("-")[0];
  };

  const placeOrder = useCallback(
    async ({ items }: PlaceOrderPayload) => {
      const customer = getCustomerId();
      const table = getTableId();
      const business = restaurant?._id;
      // Debug log
      console.log("[usePlaceOrder] customer:", customer);
      console.log("[usePlaceOrder] table:", table);
      console.log("[usePlaceOrder] business:", business);
      if (!customer || !table || !business) {
        throw new Error("Missing customer, table, or business ID");
      }
      const res = await fetch(`https://staging.api.platter.picatech.co/v1/order/${business}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          table,
          items,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to place order");
      }
      return res.json();
    },
    [restaurant, getTableId]
  );

  return { placeOrder };
} 