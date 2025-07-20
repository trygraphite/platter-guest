"use client";

import React, { useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { OrderData } from "@/types/restaurant";
import { useOrderDetails } from "@/hooks/useOrderDetails";
import { useRestaurant } from "@/providers/restaurant";
import { statusConfigs, formatPrice } from "@/lib/utils";
import { ChocoLoader } from "@/components/ui/choco-loader";
import Image from "next/image";

interface OrderStatusPageClientProps {
  subdomain: string;
  qr: string;
  orderId: string;
}

function OrderStatusDisplay({ status }: { status: string }) {
  // Set the icon dynamically since statusConfigs in utils has icon: null
  const iconMap: Record<string, ReactElement> = {
    pending: <Clock className="h-8 w-8" />,
    confirmed: <Clock className="h-8 w-8" />,
    preparing: <Package className="h-8 w-8" />,
    delivered: <CheckCircle2 className="h-8 w-8" />,
    cancelled: <XCircle className="h-8 w-8" />,
  };
  const config =
    statusConfigs[status as keyof typeof statusConfigs] ||
    statusConfigs.pending;
  const icon = iconMap[status] || iconMap["pending"];

  return (
    <div className={`p-6 rounded-lg ${config.bgColor} ${config.color}`}>
      <div className="flex flex-col items-center text-center space-y-2">
        {icon}
        <h3 className="text-xl font-semibold">{config.text}</h3>
        <p className="text-sm">{config.message}</p>
      </div>
    </div>
  );
}

function OrderDetails({ order }: { order: OrderData }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Order Details</h3>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Table:</span> {order.table.name}
        </p>
        <p>
          <span className="font-medium">Order Number:</span> #
          {order.orderNumber}
        </p>
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold mb-4">Items Ordered</h4>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.total)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between items-center font-bold px-4">
            <span>Total:</span>
            <span>{formatPrice(order.amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderActions({ order, qr }: { order: OrderData; qr: string }) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      // TODO: Implement actual cancel order API call
      // const response = await fetch(`/api/orders/${order._id}/cancel`, {
      //   method: 'POST',
      // });
      // if (response.ok) {
      //   // Handle successful cancellation
      // }

      // For now, just show alert
      alert("Cancel order functionality will be implemented soon");
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="flex justify-between gap-2 p-6">
      {(order.status === "pending" || order.status === "confirmed") && (
        <Button
          variant="destructive"
          disabled={isCancelling}
          onClick={handleCancelOrder}
        >
          {isCancelling ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </>
          )}
        </Button>
      )}
      <Button variant="outline" onClick={() => router.push(`/${qr}/menu`)}>
        Place Another Order
      </Button>
    </div>
  );
}

export default function OrderStatusPageClient({
  qr,
  orderId,
}: OrderStatusPageClientProps) {
  const router = useRouter();
  const { restaurant } = useRestaurant();
  const businessId = restaurant?._id;
  const { data, isLoading, isError, error } = useOrderDetails(
    orderId,
    businessId ?? ""
  );
  const order = (data && (data as any).data) as OrderData;
  const [connectionFailed, setConnectionFailed] = useState(false);

  console.log("orderdets", order);

  if (!businessId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading business info...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <ChocoLoader
          label="Loading order status..."
          subLabel="Please wait while we fetch your order details"
        />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">
            The order you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push(`/${qr}/menu`)}>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-2 pb-6">
      <div className="container mx-auto px-4 max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => router.push(`/${qr}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Menu
        </Button>

        {connectionFailed && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md shadow-sm">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Connection Failed</p>
                <p className="text-sm text-gray-600">
                  Unable to establish a connection for real-time updates. Your
                  order is still valid, but status updates may be delayed.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="relative overflow-hidden">
          {/* Connection status indicator commented out */}
          {/* <div className="text-xs text-green-600 absolute top-2 right-2">
            ● Live
          </div> */}

          <CardHeader className="py-4 px-4">
            <CardTitle className="text-lg font-medium">Order Status</CardTitle>
            <p className="text-xs text-gray-500">Order #{order.orderNumber}</p>
          </CardHeader>
          <CardContent className="space-y-4 px-4 py-2">
            <OrderStatusDisplay status={order.status} />
            <OrderDetails order={order} />
          </CardContent>
          <OrderActions order={order} qr={qr} />
        </Card>
      </div>
    </div>
  );
}
