import { request } from "@/utils/request";
import type { Restaurant, MenuResponse } from "@/types/restaurant";

export async function getRestaurantData(subdomain: string): Promise<Restaurant | null> {
  try {
    const response = await request<{ data: Restaurant }>(`/account/business/${subdomain}`);
    
    if (response.status === 200 && response.data?.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
}

export async function getMenuData(subdomain: string): Promise<MenuResponse | null> {
  try {
    const response = await request<{ data: MenuResponse }>(`/business/subdomain/${subdomain}/menu-items`);
    
    if (response.status === 200 && response.data?.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}