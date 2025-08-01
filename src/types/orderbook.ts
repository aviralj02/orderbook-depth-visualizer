export interface Settings {
  autoRotate: boolean;
  isPaused: boolean;
  maxDepth: number;
  timeRange: number;
  visualizationMode: "realtime" | "historical" | "pressure" | "flow";
  pressureThreshold: number;
}
