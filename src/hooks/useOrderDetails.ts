import { useQuery } from "@tanstack/react-query";
import { request } from "@/utils/request";

export function useOrderDetails(orderId: string, businessId: string) {
  return useQuery({
    queryKey: ["order-details", orderId, businessId],
    queryFn: async () => {
      const response = await request(`/order/${orderId}/${businessId}`);
      console.log("Order details API response:", response);
      return response.data;
    },
    enabled: !!orderId && !!businessId,
  });
}