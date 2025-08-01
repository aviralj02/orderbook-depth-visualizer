"use client";

import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-white animate-spin" />
      <div className="text-white text-lg font-medium">
        Connecting to Binance WebSocket...
      </div>
      <div className="text-gray-400 text-sm">
        Initializing 3D orderbook visualization
      </div>
    </div>
  );
};

export default LoadingSpinner;
