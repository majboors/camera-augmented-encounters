
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Box() {
  return (
    <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" transparent opacity={0.8} />
    </mesh>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      position: "fixed", 
      top: 0, 
      left: 0, 
      pointerEvents: "none",
      zIndex: 10 // Increased z-index to appear above camera
    }}>
      <Canvas
        style={{ 
          background: "transparent",
          pointerEvents: "auto",
          position: "absolute",
          top: 0,
          left: 0
        }}
        camera={{
          position: [0, 0, 5],
          fov: 75
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          <Box />
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}
