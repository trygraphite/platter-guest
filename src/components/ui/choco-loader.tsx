"use client";
import { cn } from "@/lib/utils";
import "../../styles/choco-loader.css";

interface ChocoLoaderProps {
  className?: string;
  label?: string;
  subLabel?: string;
  fullScreen?: boolean;
}

export function ChocoLoader({
  className,
  label = "Loading...",
  subLabel = "Please wait while we fetch your data",
  fullScreen = false,
}: ChocoLoaderProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className={cn("loader", className)} />
        {label && <p className="mt-6 font-medium text-center text-gray-700">{label}</p>}
        {subLabel && <p className="mt-2 text-sm text-gray-500 text-center">{subLabel}</p>}
      </div>
    </div>
  );
}