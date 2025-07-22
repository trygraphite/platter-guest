"use client"
import React from "react";
import { useParams } from "next/navigation";
import { useRestaurant } from "@/providers/restaurant";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { Clock, MapPin, Phone, Mail, Globe, Instagram, Home } from "lucide-react";
import { ChocoLoader } from "@/components/ui/choco-loader";

export default function TablePage() {
  // Extract params
  const params = useParams<{ subdomain: string; qr: string }>();
  const { restaurant, isLoading, error } = useRestaurant();
  const router = useRouter();
  const pathname = usePathname();

  // Extract tableId and tableName from qr param
  let tableId = "";
  let tableName = "";
  if (params.qr) {
    const [id, ...nameParts] = params.qr.split("-");
    tableId = id.toUpperCase(); // Convert to uppercase
    tableName = nameParts.join("-");
  }

  // Get today's hours
  const getTodayHours = () => {
    if (!restaurant?.hours || !Array.isArray(restaurant.hours)) return "Hours not available";
    
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const today = days[new Date().getDay()];
    const todayHours = restaurant.hours.find(h => h.day.toLowerCase() === today);
    
    if (todayHours) {
      return `${todayHours.opening} - ${todayHours.closing}`;
    }
    return "Closed today";
  };

  if (isLoading) {
    return <ChocoLoader label="Loading restaurant..." subLabel="Please wait while we fetch restaurant information" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error loading restaurant info.
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          No restaurant found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          className="bg-white/90 hover:bg-white shadow-sm"
          onClick={() => window.open(`http://${restaurant.subdomain}.localhost:3000/`, '_blank')}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Restaurant Image */}
            <div className="flex-shrink-0">
        <Image
                src={restaurant.logo || restaurant.image || "/default-restaurant.png"}
          alt={restaurant.name}
                width={120}
                height={120}
                className="rounded-2xl object-cover"
              />
            </div>
            
            {/* Restaurant Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {restaurant.name?.charAt(0).toUpperCase() + restaurant.name?.slice(1) || "Restaurant"}
              </h1>
              <p className="text-gray-600 mb-4 max-w-2xl">
                {restaurant.description || "Welcome to our restaurant"}
              </p>
              
              {/* Table Info */}
              <div className="inline-flex items-center justify-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                <span className="text-lg">Table:</span>
                <span className="ml-2 text-lg">{(tableName || tableId).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Action Buttons */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={() => router.push(`${pathname}/menu`)}
                  className="h-14 text-base font-medium"
                >
                  🍽️ View Menu
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.push(`${pathname}/view-orders`)}
                  className="h-14 text-base font-medium"
                >
                  📋 View Orders
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-14 text-base font-medium"
                >
                  📝 Leave Review
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="h-14 text-base font-medium"
                >
                  💬 Leave Complaint
                </Button>
              </div>
            </div>

            {/* Restaurant Description */}
            {restaurant.description && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Us</h3>
                <p className="text-gray-700 leading-relaxed">{restaurant.description}</p>
              </div>
            )}
          </div>

          {/* Restaurant Details Sidebar */}
          <div className="space-y-6">
            
            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Hours</h3>
              </div>
              <p className="text-gray-700 mb-2">Today: {getTodayHours()}</p>
              {restaurant.hours && restaurant.hours.length > 0 && (
                <div className="space-y-1 text-sm text-gray-600">
                  {restaurant.hours.map((hour, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="capitalize">{hour.day}</span>
                      <span>{hour.opening} - {hour.closing}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            {restaurant.address && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Location</h3>
                </div>
                <address className="text-gray-700 not-italic leading-relaxed">
                  {restaurant.address.address}<br />
                  {restaurant.address.city}, {restaurant.address.country}<br />
                  {restaurant.address.postalCode && <span>{restaurant.address.postalCode}</span>}
                </address>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                {restaurant.contacts?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a 
                      href={`tel:${restaurant.contacts.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {restaurant.contacts.phone}
                    </a>
                  </div>
                )}
                {restaurant.contacts?.email?.value && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a 
                      href={`mailto:${restaurant.contacts.email.value}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {restaurant.contacts.email.value}
                    </a>
                  </div>
                )}
                {restaurant.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a 
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {restaurant.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {restaurant.socials && restaurant.socials.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-gray-500" />
                    <a 
                      href={restaurant.socials[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Follow us on Instagram
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}