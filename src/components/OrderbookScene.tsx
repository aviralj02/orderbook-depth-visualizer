"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Color } from "three";
import { Text } from "@react-three/drei";
import { useOrderbookStore } from "@/store/orderbookStore";
import { OrderBar } from "./OrderBar";
import { PressureZone } from "./PressureZone";

const OrderbookScene = () => {
  const groupRef = useRef<Group>(null);
  const { orderbook, settings, pressureZones } = useOrderbookStore();

  // Auto-rotate
  useFrame((state, delta) => {
    if (groupRef.current && settings.autoRotate) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const visualData = useMemo(() => {
    if (!orderbook.bids.length || !orderbook.asks.length) return null;

    const maxPrice = Math.max(...orderbook.asks.map((ask) => ask.price));
    const minPrice = Math.min(...orderbook.bids.map((bid) => bid.price));
    const priceRange = maxPrice - minPrice;
    const maxQuantity = Math.max(
      ...orderbook.bids.map((bid) => bid.quantity),
      ...orderbook.asks.map((ask) => ask.quantity)
    );

    const bids = orderbook.bids.slice(0, 20).map((bid, index) => ({
      ...bid,
      x: ((bid.price - minPrice) / priceRange) * 20 - 10,
      y: (bid.quantity / maxQuantity) * 8,
      z: -index * 0.3,
      type: "bid" as const,
    }));

    const asks = orderbook.asks.slice(0, 20).map((ask, index) => ({
      ...ask,
      x: ((ask.price - minPrice) / priceRange) * 20 - 10,
      y: (ask.quantity / maxQuantity) * 8,
      z: index * 0.3,
      type: "ask" as const,
    }));

    return { bids, asks, priceRange, minPrice, maxPrice, maxQuantity };
  }, [orderbook]);

  if (!visualData) {
    return (
      <Text
        position={[0, 0, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Loading orderbook data...
      </Text>
    );
  }

  return (
    <group ref={groupRef}>
      <gridHelper
        args={[20, 20, new Color(0x444444), new Color(0x222222)]}
        position={[0, 0, 0]}
      />

      {/* Price axis (X) */}
      <Text
        position={[12, 0, 0]}
        fontSize={0.8}
        color="#888888"
        anchorX="center"
        rotation={[0, Math.PI / 2, 0]}
      >
        Price ➡️
      </Text>

      {/* Quantity axis (Y) */}
      <Text
        position={[0, 10, 0]}
        fontSize={0.8}
        color="#888888"
        anchorX="center"
      >
        Quantity ⬆️
      </Text>

      {/* Time axis (Z) */}
      <Text
        position={[0, 0, 12]}
        fontSize={0.8}
        color="#888888"
        anchorX="center"
      >
        Time ➡️
      </Text>

      {visualData.bids.map((bid, index) => (
        <OrderBar
          key={`bid-${index}`}
          position={[bid.x, bid.y / 2, bid.z]}
          height={bid.y}
          color="#22c55e"
          type="bid"
          price={bid.price}
          quantity={bid.quantity}
          venue={bid.venue}
        />
      ))}

      {visualData.asks.map((ask, index) => (
        <OrderBar
          key={`ask-${index}`}
          position={[ask.x, ask.y / 2, ask.z]}
          height={ask.y}
          color="#ef4444"
          type="ask"
          price={ask.price}
          quantity={ask.quantity}
          venue={ask.venue}
        />
      ))}

      {pressureZones.map((zone, index) => (
        <PressureZone
          key={`pressure-${index}`}
          position={[zone.x, zone.y, zone.z]}
          intensity={zone.intensity}
          radius={zone.radius}
        />
      ))}

      {visualData.bids.length > 0 && visualData.asks.length > 0 && (
        <mesh
          position={[(visualData.asks[0].x + visualData.bids[0].x) / 2, 0.1, 0]}
        >
          <planeGeometry
            args={[Math.abs(visualData.asks[0].x - visualData.bids[0].x), 0.2]}
          />
          <meshBasicMaterial color="#fbbf24" opacity={0.3} transparent />
        </mesh>
      )}
    </group>
  );
};

export default OrderbookScene;
