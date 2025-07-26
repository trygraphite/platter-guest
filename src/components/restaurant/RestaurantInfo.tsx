import { RestaurantData } from "@/types/restaurant-landing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ChefHat, Star, ExternalLink, Instagram, Facebook, Globe, ChevronRight } from "lucide-react";
import { HoursModal } from "./HoursModal";
import { useState } from "react";
import { RestaurantInfoSkeleton } from "@/components/ui/restaurant-landing-skeleton";

interface RestaurantInfoProps {
  data: RestaurantData;
  isLoading?: boolean;
}

export const RestaurantInfo = ({ data, isLoading = false }: RestaurantInfoProps) => {
  const [isHoursModalOpen, setIsHoursModalOpen] = useState(false);
  
  if (isLoading) {
    return <RestaurantInfoSkeleton />;
  }
  
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-secondary/20 to-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About {data.name}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what makes us special
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Location Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Location</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {data.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Hours Card */}
          <Card 
            className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 cursor-pointer hover:scale-105" 
            style={{ animationDelay: '0.1s' }}
            onClick={() => setIsHoursModalOpen(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">Hours</h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {data.openingHours}
                  </p>
                  <p className="text-xs text-primary mt-1 group-hover:font-medium transition-all">
                    Click to view all hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Cuisine Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Cuisine</h3>
                  <Badge variant="secondary" className="text-xs">
                    {data.cuisineType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Rating Card */}
          {(data.rating || data.reviewSnippet) && (
            <Card className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-700 md:col-span-2 lg:col-span-2" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Star className="w-6 h-6 text-primary fill-current" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">Reviews</h3>
                      {data.rating && (
                        <Badge variant="default">
                          {data.rating}/5 ⭐
                        </Badge>
                      )}
                    </div>
                    {data.reviewSnippet && (
                      <p className="text-muted-foreground text-sm italic leading-relaxed">
                        "{data.reviewSnippet}"
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Social Links Card */}
          {data.socialMedia && (
            <Card className="group hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Connect With Us</h3>
                <div className="flex flex-wrap gap-2">
                  {data.socialMedia.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={data.socialMedia.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {data.socialMedia.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={data.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {data.socialMedia.facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={data.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {data.socialMedia.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={data.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
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