"use client";

import { useRouter, useParams } from "next/navigation";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ChocoLoader } from "@/components/ui/choco-loader";
import { RestaurantProvider } from "@/providers/restaurant";
import { CartProvider } from "@/providers/cart";

const statusColors: Record<string, string> = {
  pending: "bg-gray-50 dark:bg-gray-900/30",
  confirmed: "bg-yellow-50 dark:bg-yellow-900/30",
  preparing: "bg-blue-50 dark:bg-blue-900/30",
  delivered: "bg-green-50 dark:bg-green-900/30",
  cancelled: "bg-red-50 dark:bg-red-900/30",
};

export default function ViewOrdersPageProviders() {
  return (
    <RestaurantProvider>
      <CartProvider>
        <ViewOrdersPage />
      </CartProvider>
    </RestaurantProvider>
  );
}

function ViewOrdersPage() {
  const router = useRouter();
  const params = useParams<{ qr: string }>();
  const { data, isLoading, error } = useCustomerOrders();
  const docs = (data && typeof data === 'object' && 'data' in data && (data as any).data.docs) ? (data as any).data.docs : [];
  const pagination = (data && typeof data === 'object' && 'data' in data) ? (data as any).data : {};

  const handleOrderClick = (orderId: string, p0: any,) => {
    router.push(`/${params.qr}/order-status/${orderId}`);
  };

  const handleBackToHome = () => {
    if (params.qr) {
      router.push(`/${params.qr}`);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-transparent"
          onClick={handleBackToHome}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <div className="space-y-4">
          {isLoading ? (
            <ChocoLoader label="Loading orders..." subLabel="Please wait while we fetch your order history" />
          ) : (
            <>
              {error && <p className="text-red-500">Failed to load orders.</p>}
              {docs.map((order: any) => (
                <Card
                  key={order._id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${statusColors[order.status?.toLowerCase() || "pending"]}`}
                  onClick={() => handleOrderClick(order._id, order.table?.link || "")}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-xl">Order #{order.orderNumber}</span>
                      <span className="text-sm font-normal">
                        {formatDate(order.createdAt)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-2">Status: {order.status}</p>
                    <p className="mb-2">
                      Total: {formatPrice(Number(order.amount))}
                    </p>
                    {order.specialNotes && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Special Notes: {order.specialNotes}
                      </p>
                    )}
                    {order.confirmationTime && (
                      <p className="text-sm text-muted-foreground">
                        Confirmation Time: {order.confirmationTime} minutes
                      </p>
                    )}
                    {order.preparationTime && (
                      <p className="text-sm text-muted-foreground">
                        Preparation Time: {order.preparationTime} minutes
                      </p>
                    )}
                    {order.deliveryTime && (
                      <p className="text-sm text-muted-foreground">
                        Delivery Time: {order.deliveryTime} minutes
                      </p>
                    )}
                    {order.totalTime && (
                      <p className="text-sm text-muted-foreground">
                        Total Time: {order.totalTime} minutes
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {!isLoading && docs.length === 0 && (
                <p className="text-center text-muted-foreground mt-8">
                  No orders found.
                </p>
              )}
            </>
          )}
        </div>
        {/* Pagination info (optional) */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          </div>
        )}
        <Button
          onClick={() => router.push(`/menu`)}
          className="w-full mt-6"
        >
          Place New Order
        </Button>
      </div>
    </div>
  );
}
