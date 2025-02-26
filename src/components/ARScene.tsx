
import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Model({ url, scale, position }: { url: string; scale: number; position: { x: number; y: number; z: number } }) {
  const gltf = useGLTF(url);
  return (
    <primitive 
      object={gltf.scene} 
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure WebGL is available
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
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
      zIndex: 2,
      pointerEvents: "all"
    }}>
      <Canvas
        gl={{ 
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
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
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
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
