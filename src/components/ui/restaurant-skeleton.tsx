import { Skeleton } from "@/components/ui/skeleton"

// Restaurant Header Skeleton
export function RestaurantHeaderSkeleton() {
  return (
    <div className="bg-white rounded-b-2xl">
      <div className="mx-auto max-w-4xl">
        {/* Image skeleton */}
        <div className="relative w-full md:w-full lg:w-full aspect-[4/2] md:aspect-[16/9] lg:aspect-[21/9] rounded-b-xl overflow-hidden flex-shrink-0 mb-4 mx-auto">
          <Skeleton className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {/* Back button skeleton */}
          <div className="absolute top-3 left-3">
            <Skeleton className="h-8 w-16 bg-white/70" />
          </div>
          
          {/* Restaurant name skeleton */}
          <div className="absolute bottom-12 left-4 md:left-1/2 md:-translate-x-1/2 md:text-center md:bottom-4">
            <Skeleton className="h-8 w-48 md:w-64 bg-white/80" />
          </div>
          
          {/* Description skeleton (mobile only) */}
          <div className="absolute bottom-4 left-4 w-[90%] md:hidden">
            <Skeleton className="h-4 w-full bg-white/60" />
          </div>
        </div>

        {/* Info card skeleton (desktop only) */}
        <div className="hidden md:flex flex-col md:flex-row gap-4 md:gap-6 items-start mx-4">
          <div className="relative w-full md:flex-1">
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 min-h-[200px] sm:min-h-[224px] justify-center">
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-1 flex-shrink-0" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Menu Item Card Skeleton
export function MenuItemCardSkeleton() {
  return (
    <div className="overflow-hidden border rounded-xl bg-gradient-to-br from-white to-orange-100">
      <div className="relative">
        <Skeleton className="w-full h-32 sm:h-40 md:h-60" />
      </div>
      <div className="p-2 sm:p-2 md:p-3">
        <div className="flex items-start justify-between mb-0.5 sm:mb-1">
          <div className="flex-1">
            <Skeleton className="h-5 w-16 mb-1" />
            <Skeleton className="h-4 w-24 mb-1" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1 sm:mt-2">
          <div />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Product Grid Skeleton
export function ProductGridSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-32 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <MenuItemCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

// Category Navigation Skeleton
export function CategoryNavigationSkeleton() {
  return (
    <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
      <div className="flex gap-2 py-2 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton 
            key={index} 
            className="h-10 w-20 rounded-2xl flex-shrink-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

// Menu Page Skeleton
export function MenuPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeaderSkeleton />
      
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <CategoryNavigationSkeleton />
        
        <div className="space-y-4 mt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={{ animationDelay: `${index * 0.2}s` }}>
              <ProductGridSkeleton />
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart skeleton */}
      <div className="fixed bottom-4 right-4">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    </div>
  )
} 