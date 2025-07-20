import React from "react";
import MenuPageClient from "../../../modules/qr-menu/MenuPageClient";
import { getMenuData } from "@/utils/queries";

// type Params = { subdomain: string; qr: string };

export default async function MenuPage({ params }: { params: any }) {
  const { subdomain, qr } = params;
  const menuData = await getMenuData(subdomain);
  return <MenuPageClient subdomain={subdomain} qr={qr} initialMenuData={menuData} />;
}