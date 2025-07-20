import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import type { CartItem } from "../../../types/menu";

interface FloatingActionsProps {
  callWaiter: () => void;
  requestBill: () => void;
  cart: CartItem[];
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ callWaiter, requestBill, cart }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Background Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-3">
        {/* Expanded Action Buttons */}
        {isExpanded && (
          <>
            <Button
              size="lg"
              className="rounded-full bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-500 text-md font-semibold transform translate-y-0 opacity-100"
              style={{
                animation: 'slideInFromBottom 0.3s ease-out'
              }}
              onClick={() => {
                callWaiter();
                setIsExpanded(false);
              }}
              title="Call Waiter"
            >
              Request a waiter
            </Button>
            <Button
              size="lg"
              className="rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg transition-all duration-500 text-md font-semibold transform translate-y-0 opacity-100"
              style={{
                animation: 'slideInFromBottom 0.3s ease-out 0.1s both'
              }}
              onClick={() => {
                requestBill();
                setIsExpanded(false);
              }}
              disabled={!cart.length}
              title="Request Bill"
            >
              Request a bill
            </Button>
          </>
        )}
        
        {/* Main Bell Button */}
        <Button
          size="lg"
          className={`rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 ${
            isExpanded ? 'bg-blue-700 rotate-12 scale-110' : ''
          }`}
          onClick={toggleExpanded}
          title={isExpanded ? "Close Actions" : "Open Actions"}
        >
          <Bell className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingActions; 