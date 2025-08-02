import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Clock, CheckCircle2, XCircle, Package } from "lucide-react";
import type { ReactElement } from "react";
import React from "react";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DELIVERED = "delivered",
  COMPLETED = "completed",
  PREPARING = "preparing",
  CANCELLED = "cancelled",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const protocol =
  process.env.NODE_ENV === "production" ? "https" : "http";
export const rootDomain =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

export const statusConfigs = {
  pending: {
    icon: null, // Set in component
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    text: "Order Pending",
    message: "Your order has been received and is awaiting confirmation.",
  },
  confirmed: {
    icon: null,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    text: "Order Confirmed",
    message: "Your order has been confirmed and will be prepared soon.",
  },
  preparing: {
    icon: null,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    text: "Order Processing",
    message: "Your order is being prepared.",
  },
  delivered: {
    icon: null,
    color: "text-green-600",
    bgColor: "bg-green-100",
    text: "Order Delivered",
    message: "Your order has been delivered. Enjoy your meal!",
  },
  completed: {
    icon: null,
    color: "text-green-600",
    bgColor: "bg-green-100",
    text: "Order Completed",
    message: "Your order has been completed successfully!",
  },
  cancelled: {
    icon: null,
    color: "text-red-600",
    bgColor: "bg-red-50",
    text: "Order Cancelled",
    message: "Your order has been cancelled.",
  },
};

export const iconMap: Record<string, ReactElement> = {
  pending: React.createElement(Clock, { className: "h-8 w-8" }),
  confirmed: React.createElement(Clock, { className: "h-8 w-8" }),
  preparing: React.createElement(Package, { className: "h-8 w-8" }),
  delivered: React.createElement(CheckCircle2, { className: "h-8 w-8" }),
  completed: React.createElement(CheckCircle2, { className: "h-8 w-8" }),
  cancelled: React.createElement(XCircle, { className: "h-8 w-8" }),
};

export function formatPrice(amount: number) {
  return `₦ ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleString();
}
