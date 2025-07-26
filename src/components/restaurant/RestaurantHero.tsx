import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, ChevronRight } from "lucide-react";
import { RestaurantData } from "@/types/restaurant-landing";
import Image from "next/image";
import { HoursModal } from "./HoursModal";
import { useState } from "react";
import { RestaurantHeroSkeleton } from "@/components/ui/restaurant-landing-skeleton";

interface RestaurantHeroProps {
  data: RestaurantData;
  onCtaClick?: () => void;
  isLoading?: boolean;
}

export const RestaurantHero = ({ data, onCtaClick, isLoading = false }: RestaurantHeroProps) => {
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  
  if (isLoading) {
    return <RestaurantHeroSkeleton />;
  }
  
  console.log(data);
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent overflow-hidden">
      {/* Background Image */}
      {data.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in fade-in duration-1000">
        {/* Logo */}
        {data.logo && (
          <div className="mb-6 animate-in zoom-in duration-700">
            <Image 
              src={data.logo} 
              alt={`${data.name} logo`}
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full object-cover shadow-lg"
              onError={() => {
                console.error('Logo failed to load:', data.logo);
              }}
              onLoad={() => {
                console.log('Logo loaded successfully:', data.logo);
              }}
            />
          </div>
        )}
        {/* Debug info - remove this after testing */}
        {!data.logo && (
          <div className="mb-6 text-sm text-muted-foreground">
            No logo available for {data.name}
          </div>
        )}
        
        {/* Restaurant Name */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-in slide-in-from-bottom-4 duration-700">
          {data.name}
        </h1>
        
        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-300">
          {data.tagline}
        </p>
        
        {/* Quick Info Cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-card-foreground">{data.location}</span>
          </div>
          
          <div 
            className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm cursor-pointer hover:bg-card/90 transition-all duration-200 hover:scale-105 group"
            onClick={() => setIsHoursModalOpen(true)}
          >
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-card-foreground">{data.openingHours}</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">View All</span>
          </div>
          
          {data.rating && (
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="text-sm text-card-foreground">{data.rating}/5</span>
            </div>
          )}
        </div>
        
        {/* CTA Button */}
        <div className="animate-in zoom-in duration-700 delay-600">
          <Button 
            variant="default" 
            size="lg"
            onClick={onCtaClick}
            className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {data.acceptsOrders ? "View Menu" : "View Menu"}
          </Button>
        </div>
      </div>
      
      {/* Hours Modal */}
      <HoursModal
        isOpen={isHoursModalOpen}
        onClose={() => setIsHoursModalOpen(false)}
        hours={data.hours}
        restaurantName={data.name}
      />
    </section>
  );
}; 