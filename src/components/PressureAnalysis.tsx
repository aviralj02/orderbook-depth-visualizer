"use client";

import React from "react";
import { useOrderbookStore } from "@/store/orderbookStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, BarChart3 } from "lucide-react";

export function PressureAnalysis() {
  const { pressureZones, orderbook } = useOrderbookStore();

  // Calculate pressure metrics
  const totalBidVolume = orderbook.bids.reduce(
    (sum, bid) => sum + bid.quantity,
    0
  );
  const totalAskVolume = orderbook.asks.reduce(
    (sum, ask) => sum + ask.quantity,
    0
  );
  const bidAskRatio = totalBidVolume / (totalAskVolume || 1);
  const imbalance = Math.abs(bidAskRatio - 1) * 100;

  const highPressureZones = pressureZones.filter(
    (zone) => zone.type === "high"
  );
  const mediumPressureZones = pressureZones.filter(
    (zone) => zone.type === "medium"
  );

  return (
    <Card className="absolute top-20 right-4 w-80 bg-black/20 backdrop-blur-md border-white/10 text-white z-10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="w-5 h-5" />
          Pressure Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bid/Ask Imbalance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bid/Ask Imbalance</span>
            <Badge
              variant={
                imbalance > 20
                  ? "destructive"
                  : imbalance > 10
                  ? "default"
                  : "secondary"
              }
              className="text-xs"
            >
              {imbalance.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={Math.min(imbalance, 100)} className="h-2" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Balanced</span>
            <span>Imbalanced</span>
          </div>
        </div>

        {/* Volume Distribution */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Volume Distribution</span>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-400 font-mono text-lg">
                {totalBidVolume.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">Total Bids</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-mono text-lg">
                {totalAskVolume.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400">Total Asks</div>
            </div>
          </div>
        </div>

        {/* Pressure Zones */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Pressure Zones</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                High Pressure
              </span>
              <Badge variant="destructive" className="text-xs">
                {highPressureZones.length}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                Medium Pressure
              </span>
              <Badge variant="default" className="text-xs">
                {mediumPressureZones.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {imbalance > 25 && (
          <div className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">
              High market imbalance detected
            </span>
          </div>
        )}

        {highPressureZones.length > 2 && (
          <div className="flex items-center gap-2 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">
              Multiple pressure zones active
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
