"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Text } from "@react-three/drei";

interface OrderBarProps {
  position: [number, number, number];
  height: number;
  color: string;
  type: "bid" | "ask";
  price: number;
  quantity: number;
  venue?: string;
}

export function OrderBar({
  position,
  height,
  color,
  type,
  price,
  quantity,
  venue,
}: OrderBarProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulse animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      meshRef.current.scale.setScalar(hovered ? 1.1 : scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Price label */}
      {hovered && (
        <group position={[0, height + 0.5, 0]}>
          <Text fontSize={0.3} color="white" anchorX="center" anchorY="bottom">
            ${price.toFixed(2)}
          </Text>
          <Text
            fontSize={0.25}
            color="#888888"
            anchorX="center"
            anchorY="top"
            position={[0, -0.1, 0]}
          >
            {quantity.toFixed(4)} {venue && `(${venue})`}
          </Text>
        </group>
      )}

      {/* Glow effect */}
      <mesh>
        <boxGeometry args={[0.6, height + 0.2, 0.6]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
