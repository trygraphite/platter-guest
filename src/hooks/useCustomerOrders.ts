import { useQuery } from "@tanstack/react-query";
import { request } from "@/utils/request";
import { useRestaurant } from "@/providers/restaurant";
import { useEffect, useState } from "react";

interface UseCustomerOrdersOptions {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
}

function getCustomerIdFromCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/user_token_client=([^;]+)/);
  return match ? match[1] : "";
}

export function useCustomerOrders(options: UseCustomerOrdersOptions = {}) {
  const { restaurant } = useRestaurant();
  const [customerId, setCustomerId] = useState<string>("");

  useEffect(() => {
    setCustomerId(getCustomerIdFromCookie());
  }, []);

  const businessId = restaurant?._id;

  return useQuery({
    queryKey: [
      "customer-orders",
      customerId,
      businessId,
      options.page,
      options.limit,
      options.sort,
      options.search,
      options.status,
    ],
    queryFn: async () => {
      if (!customerId || !businessId) return null;
      const params = new URLSearchParams();
      if (options.page) params.append("page", String(options.page));
      if (options.limit) params.append("limit", String(options.limit));
      if (options.sort) params.append("sort", options.sort);
      if (options.search) params.append("search", options.search);
      if (options.status) params.append("status", options.status);
      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await request(`/order/customer/${customerId}/${businessId}${query}`);
      return response.data;
    },
    enabled: !!customerId && !!businessId,
  });
} 