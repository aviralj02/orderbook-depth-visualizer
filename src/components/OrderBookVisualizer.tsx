"use client";

import React, { lazy, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import LoadingSpinner from "./LoadingSpinner";
import { useOrderbookStore } from "@/store/orderbookStore";

const OrderbookScene = lazy(() => import("./OrderbookScene"));

export function OrderbookVisualizer() {
  const { isConnected, error } = useOrderbookStore();

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="absolute top-0 left-0 right-0 z-20 p-4 backdrop-blur-sm bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">
              3D Orderbook Visualizer
            </h1>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {isConnected ? "Live" : "Disconnected"}
            </div>
          </div>
          {error && (
            <div className="px-3 py-1 rounded bg-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[15, 10, 25]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={5}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.3}
          color="#4338ca"
        />

        <Suspense fallback={null}>
          <OrderbookScene />
        </Suspense>
      </Canvas>

      {!isConnected && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
