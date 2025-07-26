import { Skeleton } from "@/components/ui/skeleton"

// Restaurant Hero Skeleton
export function RestaurantHeroSkeleton() {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background skeleton */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-accent/20 opacity-40">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary/20 rounded-full animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-accent/20 rounded-full animate-pulse" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo skeleton */}
        <div className="mb-6 flex justify-center">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>
        
        {/* Restaurant name skeleton */}
        <Skeleton className="h-12 w-80 mx-auto mb-4" />
        
        {/* Tagline skeleton */}
        <Skeleton className="h-6 w-96 mx-auto mb-8" />
        
        {/* CTA button skeleton */}
        <Skeleton className="h-12 w-48 mx-auto" />
      </div>
    </div>
  )
}

// Restaurant Info Skeleton
export function RestaurantInfoSkeleton() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - About */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            
            {/* Social media skeleton */}
            <div className="flex gap-4 mt-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="w-10 h-10 rounded-full" />
              ))}
            </div>
          </div>
          
          {/* Right side - Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hours card */}
            <div className="bg-card rounded-2xl p-6 shadow-lg">
              <Skeleton className="h-6 w-16 mb-4" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            {/* Location card */}
            <div className="bg-card rounded-2xl p-6 shadow-lg">
              <Skeleton className="h-6 w-20 mb-4" />
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-36" />
            </div>
            
            {/* Contact card */}
            <div className="bg-card rounded-2xl p-6 shadow-lg">
              <Skeleton className="h-6 w-18 mb-4" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-28" />
            </div>
            
            {/* Cuisine card */}
            <div className="bg-card rounded-2xl p-6 shadow-lg">
              <Skeleton className="h-6 w-16 mb-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Restaurant Menu Skeleton
export function RestaurantMenuSkeleton() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>
        
        {/* Category tabs skeleton */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton 
                key={index} 
                className="h-10 w-24 rounded-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Menu items grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl p-6 shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Skeleton className="w-full h-48 rounded-xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Full Restaurant Landing Skeleton
export function RestaurantLandingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeroSkeleton />
      <RestaurantInfoSkeleton />
      <RestaurantMenuSkeleton />
    </div>
  )
} 