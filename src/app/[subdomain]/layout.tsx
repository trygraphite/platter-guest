import { Metadata } from "next";
import { RestaurantProvider } from "@/providers/restaurant";
import { CartProvider } from "@/providers/cart";
import { getRestaurantData } from "@/utils/queries";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getRestaurantData(subdomain);
  return {
    title: {
      template: `${data?.name}`,
      default: data?.name ?? "Platter",
    },
  };
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RestaurantProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </RestaurantProvider>
  );
}