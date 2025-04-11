
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MotorAnimationProps {
  isRunning: boolean;
  slip: number;
}

const MotorAnimation = ({ isRunning, slip }: MotorAnimationProps) => {
  // Animation speed based on slip (higher slip = slower rotation)
  const animationDuration = isRunning ? `${8 + slip * 20}s` : "8s";

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="w-48 h-48 relative">
        {/* Stator */}
        <div className="absolute inset-0 border-8 border-slate-700 rounded-full flex items-center justify-center">
          {/* Rotor */}
          <div 
            className={cn(
              "w-3/4 h-3/4 bg-blue-600 rounded-full motor-rotate flex items-center justify-center",
              isRunning && "running"
            )}
            style={{ animationDuration }}
          >
            {/* Rotor markings for visual feedback */}
            <div className="w-full h-2 bg-white"></div>
            <div className="w-2 h-full bg-white absolute"></div>
          </div>
        </div>
        {/* Shaft */}
        <div className="absolute top-1/2 right-0 w-12 h-2 bg-gray-500 transform -translate-y-1/2 translate-x-6"></div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-sm font-medium">
          {isRunning ? "Motor Running" : "Motor Stopped"}
        </div>
        <div className="text-xs text-gray-500">
          Slip: {(slip * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default MotorAnimation;
