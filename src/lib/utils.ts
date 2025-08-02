import { OrderbookLevel, PressureZoneType } from "@/types/orderbook";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to find volume clusters
 * @param levels
 * @param threshold
 * @returns clusters
 */
export function findVolumeClusters(
  levels: Array<OrderbookLevel>,
  threshold: number
) {
  const clusters = [];
  const maxVolume = Math.max(...levels.map((l) => l.quantity));

  for (let i = 0; i < levels.length - 2; i++) {
    const window = levels.slice(i, i + 3);
    const totalVolume = window.reduce((sum, level) => sum + level.quantity, 0);
    const avgPrice =
      window.reduce((sum, level) => sum + level.price, 0) / window.length;
    const intensity = totalVolume / (maxVolume * 3); // Normalized intensity

    if (intensity > threshold) {
      clusters.push({
        avgPrice,
        totalVolume,
        intensity,
        radius: Math.min(intensity * 2, 1.5),
      });
    }
  }

  return clusters;
}

export const getPressureLevel = (intensity: number): PressureZoneType => {
  if (intensity > 0.7) return "high";
  if (intensity > 0.4) return "medium";
  return "low";
};
