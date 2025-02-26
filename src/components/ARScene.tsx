
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
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
      castShadow
      receiveShadow
    />
  );
}

function Box() {
  return (
    <mesh position={[0, 0, 0]} scale={[1, 1, 1]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" transparent opacity={0.8} />
    </mesh>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  return (
    <div style={{ 
      width: "100vw", 
      height: "100vh", 
      position: "fixed", 
      top: 0, 
      left: 0,
      zIndex: 2,
      pointerEvents: "auto",
      touchAction: "none",
      backgroundColor: 'transparent'
    }}>
      <Canvas
        shadows
        gl={{ 
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          depth: true,
          stencil: true,
          logarithmicDepthBuffer: true
        }}
        style={{ 
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          mixBlendMode: 'screen'
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          gl.setPixelRatio(window.devicePixelRatio);
          scene.background = null;
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          toast.error("Failed to initialize AR scene");
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 2, 5]}
          fov={75}
          near={0.1}
          far={1000}
        />
        
        <Suspense fallback={null}>
          {/* Lighting setup for better 3D appearance */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight 
            position={[-5, 5, -5]} 
            intensity={0.5}
          />
          
          {/* Environment lighting for better material rendering */}
          <hemisphereLight
            intensity={0.3}
            groundColor="black"
            color="white"
          />

          {modelUrl ? (
            <Model url={modelUrl} scale={scale} position={position} />
          ) : (
            <Box />
          )}

          <OrbitControls 
            makeDefault
            enableDamping={true}
            dampingFactor={0.05}
            enableZoom={true}
            enablePan={true}
            rotateSpeed={0.8}
            minDistance={1}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
