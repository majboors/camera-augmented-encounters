
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { toast } from "sonner";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Model({ url, scale, position }: { url: string; scale: number; position: { x: number; y: number; z: number } }) {
  const { scene } = useGLTF(url);
  return (
    <primitive 
      object={scene} 
      scale={scale} 
      position={[position.x, position.y, position.z]}
    />
  );
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure camera is initialized first
    const timer = setTimeout(() => {
      setReady(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      setReady(false);
    };
  }, []);

  if (!ready) return null;

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      position: "fixed", 
      top: 0, 
      left: 0,
      zIndex: 2,
      pointerEvents: "all"
    }}>
      <Canvas
        gl={{ 
          alpha: true,
          antialias: true,
          powerPreference: "default",
          depth: true,
          stencil: true
        }}
        style={{ 
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        camera={{
          position: [0, 2, 5],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          toast.error("Failed to initialize AR scene");
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          {modelUrl ? (
            <Model url={modelUrl} scale={scale} position={position} />
          ) : (
            <Box />
          )}
          <OrbitControls 
            makeDefault
            enableDamping={false}
            enableZoom={true}
            enablePan={true}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
