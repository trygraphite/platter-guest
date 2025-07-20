import { useQuery } from "@tanstack/react-query";
import { request } from "@/utils/request";
import type { MenuResponse } from "@/types/restaurant";

export function useMenuItems(subdomain: string, initialMenuData: MenuResponse | null) {
  return useQuery({
    queryKey: ["menu", subdomain],
    queryFn: async () => {
      const response = await request<{ data: MenuResponse }>(`/business/subdomain/${subdomain}/menu-items`);
      console.log("API raw response:", response);
      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }
      throw new Error("Menu not found");
    },
    initialData: initialMenuData,
    staleTime: 5 * 60 * 1000,
    enabled: !!subdomain,
  });
} 