import { RestaurantData, MenuItem, RestaurantMenuData } from "@/types/restaurant-landing";
import { RestaurantHero } from "./RestaurantHero";
import { RestaurantInfo } from "./RestaurantInfo";
import { RestaurantMenu } from "./RestaurantMenu";
import { toast } from "sonner";

interface RestaurantLandingProps {
  restaurantData: RestaurantData;
  menuData: RestaurantMenuData;
  currency?: string;
  onMenuItemClick?: (item: MenuItem) => void;
  onCtaClick?: () => void;
  isLoading?: boolean;
  isRestaurantLoading?: boolean;
  isMenuLoading?: boolean;
}

export const RestaurantLanding = ({
  restaurantData,
  menuData,
  currency = "$",
  onMenuItemClick,
  onCtaClick,
  isLoading = false,
  isRestaurantLoading = false,
  isMenuLoading = false,
}: RestaurantLandingProps) => {
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      // Default behavior - scroll to menu
      const menuSection = document.getElementById("menu-section");
      if (menuSection) {
        menuSection.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    }
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    } else {
      // Default behavior - show toast
      toast.success("Item Added!", {
        description: `${item.name} has been added to your order.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-1000">
      {/* Hero Section */}
      <RestaurantHero 
        data={restaurantData} 
        onCtaClick={handleCtaClick}
        isLoading={isLoading || isRestaurantLoading}
      />
      
      {/* Restaurant Info Section */}
      <RestaurantInfo 
        data={restaurantData} 
        isLoading={isLoading || isRestaurantLoading}
      />
      
      {/* Menu Section */}
      <div id="menu-section">
        <RestaurantMenu 
          data={menuData} 
          currency={currency}
          onItemClick={restaurantData.acceptsOrders ? handleMenuItemClick : undefined}
          isLoading={isLoading || isMenuLoading}
        />
      </div>
    </div>
  );
}; 