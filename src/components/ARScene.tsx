
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Box() {
  const mesh = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: "royalblue",
    opacity: 0.8,
    transparent: true,
  });

  return (
    <mesh geometry={mesh} material={material} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </mesh>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure WebGL context is available
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    
    if (gl) {
      setIsReady(true);
    }

    return () => {
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, []);

  if (!isReady) return null;

  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      position: "fixed", 
      top: 0, 
      left: 0, 
      pointerEvents: "none", 
      zIndex: 1 
    }}>
      <Canvas
        style={{ 
          background: "transparent",
          pointerEvents: "auto" 
        }}
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "default"
        }}
        camera={{
          fov: 75,
          position: [0, 0, 5],
          near: 0.1,
          far: 1000
        }}
      >
        <Box />
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
