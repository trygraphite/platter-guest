import { getMenuData } from "@/utils/queries";
import { ClientPage } from "./client-page";

interface PageProps {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RestaurantPage({ params }: PageProps) {
  const { subdomain } = await params;

  console.log("subdomain", subdomain);

  const menuData = await getMenuData(subdomain);

  return (
    <ClientPage 
      subdomain={subdomain}
      initialMenuData={menuData}
      menuError={menuData ? null : "Error fetching menu"}
    />
  );
}
