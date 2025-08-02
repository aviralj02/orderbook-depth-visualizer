export interface OrderbookLevel {
  price: number;
  quantity: number;
  venue?: string;
  timestamp?: number;
}

export interface Orderbook {
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  lastUpdateId?: number;
}

export type PressureZoneType = "high" | "medium" | "low";

export interface PressureZone {
  x: number;
  y: number;
  z: number;
  intensity: number;
  radius: number;
  type: PressureZoneType;
}

export interface Settings {
  autoRotate: boolean;
  isPaused: boolean;
  maxDepth: number;
  timeRange: number;
  visualizationMode: "realtime" | "historical" | "pressure" | "flow";
  pressureThreshold: number;
}
