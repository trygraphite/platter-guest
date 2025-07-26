import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/types/restaurant-landing";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

interface MenuItemDetailsModalProps {
  open: boolean;
  onClose: () => void;
  item: MenuItem | null;
  isDesktop: boolean;
}

export const MenuItemDetailsModal = ({ open, onClose, item, isDesktop }: MenuItemDetailsModalProps) => {
  if (!item) return null;

  const content = (
    <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
      {item.image && (
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 bg-gray-50 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            width={320}
            height={224}
            className="rounded-2xl w-full h-40 md:h-64 object-cover"
          />
        </div>
      )}
      <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 mt-2 md:mt-0 pr-8">
          {item.name}
        </h2>
        {item.description && (
          <p className="text-muted-foreground text-sm mb-4">
            {item.description}
          </p>
        )}
        <div className="mb-4">
          <span className="font-bold text-primary text-lg">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.varieties && item.varieties.length > 1 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Available in:</p>
            <div className="flex flex-wrap gap-2">
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
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent showCloseButton className="w-[95vw] max-w-md md:max-w-2xl p-0 overflow-hidden max-h-[90vh]">
          <DialogTitle className="sr-only">Menu Item Details</DialogTitle>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DrawerContent className="h-[95vh] max-h-[95vh] w-full flex flex-col">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-xl font-bold">
            {item.name}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col w-full px-0 overflow-y-auto max-h-[calc(95vh-56px)] mb-6">
          {content}
        </div>
      </DrawerContent>
    </Drawer>
  );
}; 