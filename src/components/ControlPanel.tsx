"use client";

import React from "react";
import { useOrderbookStore } from "@/store/orderbookStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, TrendingUp, TrendingDown } from "lucide-react";
import { symbols } from "@/lib/constants";

export function ControlPanel() {
  const { settings, updateSettings, symbol, setSymbol, orderbook, setDepth } =
    useOrderbookStore();

  return (
    <Card className="absolute top-20 left-4 w-80 bg-black/20 backdrop-blur-md border-white/10 text-white z-10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Symbol Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Trading Pair</label>
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger className="bg-white/10 border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              {symbols.map((sym) => (
                <SelectItem
                  key={sym}
                  value={sym}
                  className="text-white hover:bg-white/10"
                >
                  {sym}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Animation Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto Rotate</label>
            <Switch
              checked={settings.autoRotate}
              onCheckedChange={(checked) =>
                updateSettings({ autoRotate: checked })
              }
              className="shadow-2xl drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Depth Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Depth Levels: {settings.maxDepth}
          </label>
          <Slider
            value={[settings.maxDepth]}
            onValueChange={([value]) => setDepth(value)}
            max={50}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        {/* Stats */}
        <div className="pt-2 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-xs text-gray-400">Best Bid</div>
                <div className="font-mono">
                  {orderbook.bids[0]?.price.toFixed(2) || "--"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-xs text-gray-400">Best Ask</div>
                <div className="font-mono">
                  {orderbook.asks[0]?.price.toFixed(2) || "--"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
