"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { request } from "@/utils/request";
import type { Restaurant, RestaurantContextType } from "@/types/restaurant";

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

interface RestaurantProviderProps {
  children: React.ReactNode;
}

export function RestaurantProvider({ children }: RestaurantProviderProps) {
  const params = useParams<{ subdomain: string }>();
  console.log("params", params);

  const {
    data: restaurant,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["restaurant", params.subdomain],
    queryFn: async () => {
      if (!params.subdomain) throw new Error("No subdomain provided");
      
      const response = await request<{ data: Restaurant }>(`/account/business/${params.subdomain}`);
      
      if (response.status === 200 && response.data?.data) {
        return response.data.data;
      }
      
      throw new Error("Restaurant not found");
    },
    enabled: !!params.subdomain,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const value: RestaurantContextType = {
    restaurant: restaurant || null,
    isLoading,
    error: error as Error | null,
    refetch,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}

export { RestaurantContext };
