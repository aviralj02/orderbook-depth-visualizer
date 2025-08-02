"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

interface PressureZoneProps {
  position: [number, number, number];
  intensity: number;
  radius: number;
}

export function PressureZone({
  position,
  intensity,
  radius,
}: PressureZoneProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * intensity) * 0.2;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const color =
    intensity > 0.7 ? "#ff4444" : intensity > 0.4 ? "#ffaa00" : "#44ff44";

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} wireframe />
    </mesh>
  );
}
