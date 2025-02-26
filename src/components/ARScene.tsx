
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Loader } from "@react-three/drei";
import { Suspense } from "react";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Scene() {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
        <boxGeometry />
        <meshStandardMaterial color="royalblue" opacity={0.8} transparent />
      </mesh>
    </Suspense>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 1 }}>
      <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: "transparent" }}
          gl={{
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance"
          }}
        >
          <Scene />
          <OrbitControls 
            enableZoom={true} 
            enablePan={true} 
            enableRotate={true}
            makeDefault
          />
        </Canvas>
        <Loader />
      </div>
    </div>
  );
}
