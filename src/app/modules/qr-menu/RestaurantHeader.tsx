import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Clock, MapPin, Globe, Users, ArrowLeft } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";
import { useRouter } from "next/navigation";
import { RestaurantHeaderSkeleton } from "@/components/ui/restaurant-skeleton";

interface RestaurantHeaderProps {
  restaurant: Restaurant | null;
  qr: string;
  isLoading?: boolean;
}

export default function RestaurantHeader({
  restaurant,
  qr,
  isLoading = false,
}: RestaurantHeaderProps) {
  const router = useRouter();
  const [hoursOpen, setHoursOpen] = useState(false);

  if (isLoading || !restaurant) {
    return <RestaurantHeaderSkeleton />;
  }

  // Find today's hours
  let todayLabel = "";
  let todayHours = "";
  if (Array.isArray(restaurant?.hours) && restaurant.hours.length > 0) {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];
    const todayObj = restaurant.hours.find(
      (h) => h.day.toLowerCase() === today
    );
    todayLabel = today.charAt(0).toUpperCase() + today.slice(1);
    todayHours = todayObj
      ? `${todayObj.opening} - ${todayObj.closing}`
      : "Closed";
  }

  return (
    <div className="bg-white rounded-b-2xl">
      <div className="mx-auto max-w-4xl">
        {/* Responsive Image with overlayed restaurant name and back button */}
        <div className="relative w-full md:w-full lg:w-full aspect-[4/2] md:aspect-[16/9] lg:aspect-[21/9] rounded-b-xl overflow-hidden flex-shrink-0 mb-4 mx-auto">
          <Image
            src={restaurant?.image || "/file.svg"}
            alt={restaurant?.name || "Restaurant"}
            fill
            className="object-cover object-center shadow-lg"
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/70 hover:bg-white/90 text-gray-900 shadow"
              onClick={() => router.push(`/${qr}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="absolute bottom-12 left-4 text-left text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg px-2 md:left-1/2 md:-translate-x-1/2 md:text-center md:bottom-4 mb-2 md:mb-0">
            {restaurant?.name
              ? restaurant.name.charAt(0).toUpperCase() +
                restaurant.name.slice(1)
              : "Restaurant"}
          </h1>
          {/* Mobile-only description below the title */}
          {restaurant?.description && (
            <p className="absolute bottom-4 left-4 w-[90%] text-left text-white text-sm font-normal drop-shadow-md px-2 md:hidden">
              {restaurant.description}
            </p>
          )}
        </div>

        {/* Original info card layout */}
        <div className="hidden md:flex flex-col md:flex-row gap-4 md:gap-6 items-start mx-4">
          <div className="relative w-full md:flex-1">
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 min-h-[200px] sm:min-h-[224px] justify-center">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-sm sm:text-base">
                    {todayLabel}: {todayHours}
                  </span>
                  {Array.isArray(restaurant?.hours) &&
                    restaurant.hours.length > 0 && (
                      <>
                        <button
                          className="ml-2 text-md text-blue-600 underline hover:text-blue-800 focus:outline-none"
                          onClick={() => setHoursOpen(true)}
                          type="button"
                        >
                          View all hours
                        </button>
                        <Dialog open={hoursOpen} onOpenChange={setHoursOpen}>
                          <DialogContent className="max-w-xs w-full p-4">
                            <DialogTitle>Opening Hours</DialogTitle>
                            <ul className="mt-4 text-md text-gray-700 space-y-1">
                              {restaurant.hours.map((h, idx) => (
                                <li key={h.day + idx} className="flex gap-2">
                                  <span className="capitalize w-20">
                                    {h.day}:
                                  </span>
                                  <span>
                                    {h.opening} - {h.closing}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base break-words">
                  {restaurant &&
                  "address" in restaurant &&
                  (restaurant as any).address?.address
                    ? (restaurant as any).address.address
                    : "Address not available"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-1 flex-shrink-0" />
                {restaurant?.website ? (
                  <a
                    href={
                      restaurant.website.startsWith("http")
                        ? restaurant.website
                        : `https://${restaurant.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-md break-all hover:text-blue-800 transition-colors"
                  >
                    {restaurant.website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span className="text-blue-600 text-sm sm:text-base break-all">
                    Website not available
                  </span>
                )}
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  {restaurant?.description || "No description"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
