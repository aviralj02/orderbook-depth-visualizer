"use client";

import { findVolumeClusters, getPressureLevel } from "@/lib/utils";
import { Orderbook, PressureZone, Settings } from "@/types/orderbook";
import { create } from "zustand";

interface OrderbookStore {
  orderbook: Orderbook;
  symbol: string;
  isConnected: boolean;
  error: string | null;
  settings: Settings;
  pressureZones: PressureZone[];
  ws: WebSocket | null;

  setOrderbook: (orderbook: Orderbook) => void;
  setSymbol: (symbol: string) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  clearOrderbook: () => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  analyzePressureZones: () => void;
}

const defaultSettings: Settings = {
  autoRotate: true,
  isPaused: false,
  maxDepth: 20,
  timeRange: 300,
  visualizationMode: "realtime",
  pressureThreshold: 0.5,
};

export const useOrderbookStore = create<OrderbookStore>((set, get) => ({
  orderbook: { bids: [], asks: [] },
  symbol: "BTCUSDT",
  isConnected: false,
  error: null,
  settings: defaultSettings,
  pressureZones: [],
  ws: null,

  setOrderbook: (orderbook) => {
    set({ orderbook });
    get().analyzePressureZones();
  },

  setSymbol: (symbol) => {
    set({ symbol });
    get().disconnectWebSocket();
    setTimeout(() => get().connectWebSocket(), 1000);
  },

  setConnected: (isConnected) => set({ isConnected }),
  setError: (error) => set({ error }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  clearOrderbook: () =>
    set({
      orderbook: { bids: [], asks: [] },
      pressureZones: [],
    }),

  connectWebSocket: () => {
    const { symbol } = get();
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        set({ isConnected: true, error: null, ws });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.bids && data.asks) {
            const orderbook: Orderbook = {
              bids: data.bids.map(([price, quantity]: [string, string]) => ({
                price: parseFloat(price),
                quantity: parseFloat(quantity),
                venue: "binance",
                timestamp: Date.now(),
              })),
              asks: data.asks.map(([price, quantity]: [string, string]) => ({
                price: parseFloat(price),
                quantity: parseFloat(quantity),
                venue: "binance",
                timestamp: Date.now(),
              })),
              lastUpdateId: data.lastUpdateId,
            };
            get().setOrderbook(orderbook);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          set({ error: "Failed to parse market data" });
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        set({ error: "WebSocket connection error", isConnected: false });
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        set({ isConnected: false, ws: null });

        // Reconnect after 3 seconds
        setTimeout(() => {
          if (!get().isConnected) {
            get().connectWebSocket();
          }
        }, 3000);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      set({ error: "Failed to connect to market data", isConnected: false });
    }
  },

  disconnectWebSocket: () => {
    const { ws } = get();
    if (ws) {
      ws.close();
      set({ ws: null, isConnected: false });
    }
  },

  analyzePressureZones: () => {
    const { orderbook, settings } = get();
    const zones: PressureZone[] = [];

    if (!orderbook.bids.length || !orderbook.asks.length) return;

    // Analyze bid pressure zones
    const bidClusters = findVolumeClusters(
      orderbook.bids,
      settings.pressureThreshold
    );
    bidClusters.forEach((cluster, index) => {
      zones.push({
        x: (cluster.avgPrice - orderbook.bids[0].price) * 0.1,
        y: cluster.totalVolume * 0.01,
        z: -index * 0.5,
        intensity: Math.min(cluster.intensity, 1),
        radius: cluster.radius,
        type: getPressureLevel(cluster.intensity),
      });
    });

    // Analyze ask pressure zones
    const askClusters = findVolumeClusters(
      orderbook.asks,
      settings.pressureThreshold
    );
    askClusters.forEach((cluster, index) => {
      zones.push({
        x: (cluster.avgPrice - orderbook.asks[0].price) * 0.1,
        y: cluster.totalVolume * 0.01,
        z: index * 0.5,
        intensity: Math.min(cluster.intensity, 1),
        radius: cluster.radius,
        type:
          cluster.intensity > 0.7
            ? "high"
            : cluster.intensity > 0.4
            ? "medium"
            : "low",
      });
    });

    set({ pressureZones: zones });
  },
}));

if (typeof window !== "undefined") {
  setTimeout(() => {
    useOrderbookStore.getState().connectWebSocket();
  }, 1000);
}
