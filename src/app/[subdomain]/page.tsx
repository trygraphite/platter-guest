import { getMenuData } from "@/utils/queries";
import { ClientPage } from "./client-page";
import { JSX } from "react";

export default async function RestaurantPage({ params }: { params: any }): Promise<JSX.Element> {
  const { subdomain } = params;
  const menuData = await getMenuData(subdomain);
  return (
    <ClientPage 
      subdomain={subdomain}
      initialMenuData={menuData}
      menuError={menuData ? null : "Error fetching menu"}
    />
  );
}
