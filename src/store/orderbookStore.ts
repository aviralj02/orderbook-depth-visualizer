"use client";

import { Settings } from "@/types/orderbook";
import { create } from "zustand";

interface OrderbookStore {
  symbol: string;
  isConnected: boolean;
  error: string | null;
  settings: Settings;
  ws: WebSocket | null;

  setSymbol: (symbol: string) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
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

  setSymbol: (symbol) => {
    set({ symbol });
    get().disconnectWebSocket();
    setTimeout(() => get().connectWebSocket(), 1000);
  },

  setConnected: (isConnected) => set({ isConnected }),
  setError: (error) => set({ error }),

  connectWebSocket: () => {
    const { symbol } = get();
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        set({ isConnected: true, error: null, ws });
      };

      ws.onmessage = () => {};

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
}));

if (typeof window !== "undefined") {
  setTimeout(() => {
    useOrderbookStore.getState().connectWebSocket();
  }, 1000);
}
