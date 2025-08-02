import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/utils/request";

interface CancelOrderPayload {
  order: string;
  customer: string;
  business: string;
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ order, customer, business }: CancelOrderPayload) => {
      const response = await request("/order/customer/status/cancel", "POST", {
        order,
        customer,
        business,
      });
      console.log("Cancel order API response:", response);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch order-related queries
      queryClient.invalidateQueries({ queryKey: ["order-details"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });
}
