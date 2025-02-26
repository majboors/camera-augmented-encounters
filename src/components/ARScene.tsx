
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Three.js Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function Box() {
  return (
    <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="royalblue" opacity={0.8} transparent />
    </mesh>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted before rendering Three.js content
    setMounted(true);
    
    // Clean up Three.js resources
    return () => {
      setMounted(false);
      // Force clean up of WebGL context
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl');
        if (gl) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      }
    };
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
      zIndex: 1 
    }}>
      <ErrorBoundary>
        <Canvas
          style={{ 
            background: "transparent",
            pointerEvents: "auto" 
          }}
          gl={{
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: "default",
            failIfMajorPerformanceCaveat: false
          }}
          camera={{
            fov: 75,
            position: [0, 0, 5],
            near: 0.1,
            far: 1000
          }}
          frameloop="demand"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Box />
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              enableRotate={true}
              makeDefault
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
