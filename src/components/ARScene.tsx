
import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera } from "@react-three/drei";
import { toast } from "sonner";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Model({ url, scale, position }: { url: string; scale: number; position: { x: number; y: number; z: number } }) {
  console.log("Loading 3D model:", url);
  try {
    const { scene } = useGLTF(url);
    console.log("Model loaded successfully:", scene);
    return (
      <primitive 
        object={scene} 
        scale={scale} 
        position={[position.x, position.y, position.z]}
        castShadow
        receiveShadow
      />
    );
  } catch (error) {
    console.error("Error loading model:", error);
    toast.error("Failed to load 3D model");
    return null;
  }
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debug log for initialization
    console.log("ARScene initialized with:", { modelUrl, scale, position });
    
    // Monitor for WebGL context loss
    const handleContextLost = () => {
      console.error("WebGL context lost");
      toast.error("WebGL context lost - please refresh the page");
    };
    
    document.addEventListener("webglcontextlost", handleContextLost, false);
    
    return () => {
      document.removeEventListener("webglcontextlost", handleContextLost);
      console.log("ARScene cleanup");
    };
  }, [modelUrl, scale, position]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: "100vw", 
        height: "100vh", 
        position: "fixed", 
        top: 0, 
        left: 0,
        zIndex: 2,
        pointerEvents: "auto",
        touchAction: "none",
        background: "transparent", // Ensure the container has a transparent background
      }}
    >
      <Canvas
        shadows
        gl={{ 
          alpha: true, // Required for transparent background
          antialias: true,
          powerPreference: "default",
          depth: true,
          stencil: false,
          preserveDrawingBuffer: false,
        }}
        style={{ 
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        onCreated={({ gl, scene }) => {
          console.log("Canvas created successfully");
          gl.setClearColor(0x000000, 0); // Set clear color with 0 alpha (transparent)
          gl.setPixelRatio(window.devicePixelRatio);
          scene.background = null; // Ensure scene background is null for transparency
        }}
        onError={(error) => {
          console.error('Canvas error:', error);
          toast.error("Failed to initialize AR scene");
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={[0, 1, 5]}
          fov={60}
          near={0.1}
          far={1000}
        />
        
        <Suspense fallback={null}>
          {/* Simplified lighting setup */}
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.8} 
            castShadow
          />
          
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
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
