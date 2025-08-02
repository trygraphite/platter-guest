import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/utils/request";

interface OrderItem {
  item: string;
  variety: string;
  quantity: number;
}

interface EditOrderPayload {
  order: string;
  items: OrderItem[];
}

export function useEditOrder(businessId: string, customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ order, items }: EditOrderPayload) => {
      const response = await request(
        `/order/business/${businessId}/customer/${customerId}`,
        "PATCH",
        { order, items }
      );
      console.log("Edit order API response:", response);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch order-related queries
      queryClient.invalidateQueries({ queryKey: ["order-details"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });
}
