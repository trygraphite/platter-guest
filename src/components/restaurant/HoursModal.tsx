import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";

interface HoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  hours: { day: string; opening: string; closing: string }[];
  restaurantName: string;
}

const dayNames = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
];

const formatDayName = (day: string) => {
  return day.charAt(0).toUpperCase() + day.slice(1);
};

export const HoursModal = ({ isOpen, onClose, hours, restaurantName }: HoursModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Opening Hours
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {dayNames.map((day) => {
            const dayHours = hours.find((h) => h.day.toLowerCase() === day);
            const isToday = day === dayNames[new Date().getDay()];
            
            return (
              <div 
                key={day}
                className={`flex justify-between items-center p-3 rounded-lg border ${
                  isToday 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'bg-muted/50 border-border'
                }`}
              >
                <span className={`font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {formatDayName(day)}
                  {isToday && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Today</span>}
                </span>
                <span className={`text-sm ${isToday ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {dayHours ? `${dayHours.opening} - ${dayHours.closing}` : 'Closed'}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 