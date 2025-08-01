"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Color } from "three";
import { Text } from "@react-three/drei";
import { useOrderbookStore } from "@/store/orderbookStore";

const OrderbookScene = () => {
  const groupRef = useRef<Group>(null);
  const { settings } = useOrderbookStore();

  // Auto-rotate
  useFrame((state, delta) => {
    if (groupRef.current && settings.autoRotate) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

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
        position={[0, 8, 0]}
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
    </group>
  );
};

export default OrderbookScene;
