
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Box() {
  return (
    <mesh>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
      <Canvas>
        <Box />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
