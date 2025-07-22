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
  // Enhanced status display with estimated times
  const iconMap: Record<string, ReactElement> = {
    pending: <Clock className="h-10 w-10" />,
    confirmed: <Clock className="h-10 w-10" />,
    preparing: <Package className="h-10 w-10" />,
    delivered: <CheckCircle2 className="h-10 w-10" />,
    cancelled: <XCircle className="h-10 w-10" />,
  };

  const estimatedTimeMap: Record<string, string> = {
    pending: "Waiting for confirmation",
    confirmed: "15-20 minutes",
    preparing: "10-15 minutes",
    delivered: "Completed",
    cancelled: "Order cancelled",
  };

  const config =
    statusConfigs[status as keyof typeof statusConfigs] ||
    statusConfigs.pending;
  const icon = iconMap[status] || iconMap["pending"];
  const estimatedTime = estimatedTimeMap[status] || "Calculating...";

  return (
    <div
      className={`p-8 rounded-xl ${config.bgColor} ${config.color} border border-gray-200`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-white/20">{icon}</div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{config.text}</h3>
          <p className="text-base opacity-90">{config.message}</p>
          {status !== "delivered" && status !== "cancelled" && (
            <div className="mt-3 px-4 py-2 bg-white/20 rounded-lg">
              <p className="text-sm font-medium">
                Estimated time: {estimatedTime}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderDetails({ order }: { order: OrderData }) {
  return (
    <div className="space-y-6">
      {/* Order Summary Section with Better Hierarchy */}
      <div className="bg-gray-50 rounded-lg p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Table:</span>
            <span className="font-semibold text-gray-900">
              {order.table.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Payment Method:</span>
            <span className="font-semibold text-gray-900 capitalize">
              {order.paymentMethod}
            </span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(order.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section with Improved Spacing */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-gray-900">Items Ordered</h4>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl"
            >
              {item.image && (
                <div className="flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-2">
                <h5 className="font-bold text-gray-900 text-lg leading-tight">
                  {item.name}
                </h5>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">
                    {formatPrice(item.price)} × {item.quantity}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(item.total)}
                </p>
              </div>
            </div>
          ))}
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
      alert("Cancel order functionality will be implemented soon");
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-3 p-6 bg-gray-50 rounded-t-none border-t border-gray-200">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {(order.status === "pending" || order.status === "confirmed") && (
          <Button
            variant="destructive"
            disabled={isCancelling}
            onClick={handleCancelOrder}
            className="w-full sm:w-auto px-6 py-3 font-semibold"
            size="lg"
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
        <Button
          variant="outline"
          onClick={() => router.push(`/${qr}/menu`)}
          className="w-full sm:w-auto px-6 py-3 font-semibold border-2"
          size="lg"
        >
          Place Another Order
        </Button>
      </div>
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="flex items-center gap-3 bg-white p-6 rounded-lg border border-gray-200">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium">Loading business info...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <ChocoLoader
          label="Loading order status..."
          subLabel="Please wait while we fetch your order details"
        />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl border border-gray-200 max-w-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
          <Button
            onClick={() => router.push(`/${qr}/menu`)}
            className="px-6 py-3 font-semibold"
            size="lg"
          >
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 max-w-2xl py-6">
        {/* Header with Better Spacing */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="lg"
            className="px-3"
            onClick={() => router.push(`/${qr}`)}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
        </div>

        {/* Connection Failed Alert */}
        {connectionFailed && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3 text-red-600">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-lg">Connection Failed</p>
                <p className="text-sm text-red-700 mt-1">
                  Unable to establish a connection for real-time updates. Your
                  order is still valid, but status updates may be delayed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card with Enhanced Design */}
        <Card className="relative overflow-hidden border border-gray-200">
          {/* Prominent Order Number Header */}
          <CardHeader className="text-primary border-b border-gray-200">
            <div className="text-start space-y-2">
              {/* <CardTitle className="text-2xl font-bold">Order Status</CardTitle> */}
              <div className="inline-block px-4 bg-white/20 rounded-full">
                <p className="text-2xl font-bold">Order #{order.orderNumber}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-6">
            <OrderStatusDisplay status={order.status} />
            <OrderDetails order={order} />
          </CardContent>

          <OrderActions order={order} qr={qr} />
        </Card>
      </div>
    </div>
  );
}
