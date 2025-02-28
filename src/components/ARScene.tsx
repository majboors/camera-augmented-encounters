
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, PerspectiveCamera, Line } from "@react-three/drei";
import { toast } from "sonner";
import * as THREE from "three";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function TrajectoryLine({ position }: { position: { x: number; y: number; z: number } }) {
  // Create a line from the camera to the target position
  const points = [
    new THREE.Vector3(0, 0, 0), // Origin (near camera)
    new THREE.Vector3(position.x, position.y, position.z) // Target position
  ];
  
  return (
    <Line
      points={points}
      color="red"
      lineWidth={2}
      dashed={true}
      dashSize={0.2}
      dashScale={1}
    />
  );
}

function TargetSphere({ position }: { position: { x: number; y: number; z: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      // Make the sphere pulse for visibility
      ref.current.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      ref.current.scale.y = 1 + Math.sin(Date.now() * 0.005) * 0.2;
      ref.current.scale.z = 1 + Math.sin(Date.now() * 0.005) * 0.2;
    }
  });
  
  return (
    <mesh 
      position={[position.x, position.y, position.z]}
      ref={ref}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="red" transparent opacity={0.7} />
    </mesh>
  );
}

function Model({ url, scale, position }: { url: string; scale: number; position: { x: number; y: number; z: number } }) {
  const [loaded, setLoaded] = useState(false);
  const modelRef = useRef<THREE.Group>(null);
  
  console.log("Loading 3D model:", url);
  try {
    const { scene } = useGLTF(url);
    
    useEffect(() => {
      if (scene) {
        console.log("Model loaded successfully:", scene);
        setLoaded(true);
        toast.success("3D model loaded successfully");
      }
    }, [scene]);
    
    useFrame(() => {
      if (modelRef.current) {
        // Add a gentle floating animation
        modelRef.current.position.y = position.y + Math.sin(Date.now() * 0.001) * 0.1;
        // Add a gentle rotation
        modelRef.current.rotation.y += 0.005;
      }
    });
    
    return (
      <primitive 
        ref={modelRef}
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
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh ref={ref} position={[0, 0, -3]} scale={[1, 1, 1]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" transparent opacity={0.8} />
    </mesh>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTrajectory, setShowTrajectory] = useState(true);

  useEffect(() => {
    // Debug log for initialization
    console.log("ARScene initialized with:", { modelUrl, scale, position });
    
    // Monitor for WebGL context loss
    const handleContextLost = () => {
      console.error("WebGL context lost");
      toast.error("WebGL context lost - please refresh the page");
    };
    
    document.addEventListener("webglcontextlost", handleContextLost, false);
    
    // Show trajectory when position changes
    setShowTrajectory(true);
    const timer = setTimeout(() => {
      setShowTrajectory(false);
    }, 5000); // Hide trajectory after 5 seconds
    
    return () => {
      document.removeEventListener("webglcontextlost", handleContextLost);
      clearTimeout(timer);
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
          position={[0, 1, 0]}
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
          
          {/* Show trajectory indicator if in placement mode */}
          {showTrajectory && (
            <>
              <TrajectoryLine position={position} />
              <TargetSphere position={position} />
            </>
          )}
          
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
