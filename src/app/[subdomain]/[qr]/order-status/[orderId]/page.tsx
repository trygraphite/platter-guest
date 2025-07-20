import React, { JSX } from "react";
import OrderStatusPageClient from "../../../../modules/qr-order-status/OrderStatusPageClient";

// type Params = { subdomain: string; qr: string; orderId: string };

export default async function OrderStatusPage({ params }: { params: any }): Promise<JSX.Element> {
  const { subdomain, qr, orderId } = params;
  return <OrderStatusPageClient subdomain={subdomain} qr={qr} orderId={orderId} />;
}
