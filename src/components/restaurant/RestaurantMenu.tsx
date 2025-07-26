import { useState, useEffect, useRef, useMemo } from "react";
import { RestaurantMenuData, MenuItem } from "@/types/restaurant-landing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatPrice } from "@/lib/utils";
import { MenuItemDetailsModal } from "./MenuItemDetailsModal";
import { RestaurantMenuSkeleton } from "@/components/ui/restaurant-landing-skeleton";

interface RestaurantMenuProps {
  data: RestaurantMenuData;
  currency?: string;
  onItemClick?: (item: MenuItem) => void;
  isLoading?: boolean;
}

const MenuItemCard = ({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: () => void;
}) => {
  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 animate-in fade-in cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Item Image */}
          {item.image && (
            <div className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
              />
            </div>
          )}

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                {item.popular && (
                  <Badge variant="default" className="text-xs bg-primary/20 text-primary">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}
              </div>
              <span className="font-bold text-primary text-lg whitespace-nowrap">
                {formatPrice(item.price)}
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {item.description}
            </p>

            {/* Show varieties if available (skip first variety as it's the same as base item) */}
            {item.varieties && item.varieties.length > 1 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">Available in:</p>
                <div className="flex flex-wrap gap-1">
                  {item.varieties.slice(1).map((variety) => (
                    <Badge key={variety.id} variant="outline" className="text-xs">
                      {variety.name} - {formatPrice(variety.price)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RestaurantMenu = ({ data, onItemClick, isLoading = false }: RestaurantMenuProps) => {
  if (isLoading) {
    return <RestaurantMenuSkeleton />;
  }

  const [scrollActiveCategory, setScrollActiveCategory] = useState(data.categories[0]?.name || "");
  const [scrolled, setScrolled] = useState(false);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Extract all menu items and categories
  const allMenuItems = data.categories.flatMap((category) => category.items);
  const categories = data.categories.map((cat) => cat.name);

  // Filter products by category (similar to MenuProductGrid)
  const filteredProductsByCategory = useMemo(() => {
    const result: Record<string, MenuItem[]> = {};
    for (const category of categories) {
      result[category] = allMenuItems.filter((item) => item.category === category);
    }
    return result;
  }, [categories, allMenuItems]);

  // Handle scroll to detect active category
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for header
      setScrolled(window.scrollY > 2);
      let currentActive = categories[0];
      for (const category of categories) {
        const element = categoryRefs.current[category];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentActive = category;
            break;
          }
        }
      }
      if (currentActive !== scrollActiveCategory) {
        setScrollActiveCategory(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, scrollActiveCategory]);

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setScrollActiveCategory(category);
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in duration-1000">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Menu
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with the finest ingredients
          </p>
        </div>
        {/* Fixed Category Navigation */}
        <div
          className={`sticky top-0 z-10 bg-background transition-all mb-8 ${
            scrolled ? "border-b shadow-sm" : ""
          }`}
        >
          <div className="flex gap-2 py-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`whitespace-nowrap flex-shrink-0 text-xl rounded-2xl px-4 py-2 ${scrollActiveCategory === category ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'} transition-colors`}
                onClick={() => scrollToCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {/* Category Sections */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div
              key={category}
              ref={(el) => {
                categoryRefs.current[category] = el;
              }}
              id={`category-${category}`}
              className="scroll-mt-16"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {category}
                </h3>
                <div className="w-16 h-1 bg-primary rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProductsByCategory[category]?.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: "both",
                    }}
                  >
                    <MenuItemCard
                      item={item}
                      onClick={() => {
                        setSelectedItem(item);
                        setModalIsOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
              {/* Empty State */}
              {(!filteredProductsByCategory[category] || filteredProductsByCategory[category].length === 0) && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No items available in this category yet.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Modal/Drawer for menu item details */}
      <MenuItemDetailsModal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        item={selectedItem}
        isDesktop={isDesktop}
      />
    </section>
  );
}; 