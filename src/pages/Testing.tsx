
import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import * as THREE from "three";

function LoadingMessage() {
  return (
    <Html center>
      <div className="bg-black/80 text-white p-3 rounded-lg text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mx-auto mb-2"></div>
        <p>Loading 3D model...</p>
      </div>
    </Html>
  );
}

function Fallback() {
  return (
    <>
      <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <Html center>
        <div className="bg-black/80 text-white p-3 rounded-lg">
          <p>Failed to load 3D model - showing fallback</p>
        </div>
      </Html>
    </>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const handleError = () => {
      setHasError(true);
      toast.error("Error rendering 3D content");
    };
    
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);
  
  if (hasError) {
    return <Fallback />;
  }
  
  return <>{children}</>;
}

function Model({ url }: { url: string }) {
  const [error, setError] = useState<Error | null>(null);
  
  try {
    // Using draco decoder may cause issues, so explicitly disable it
    const { scene } = useGLTF(url, undefined, undefined, 
      (e) => {
        console.error("GLB loading error:", e);
        setError(e);
        toast.error("Failed to load 3D model");
      }
    );
    
    useEffect(() => {
      if (scene) {
        console.log("Model loaded successfully:", scene);
        // Center the model
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        scene.position.sub(center);
        
        // Optimize the scene
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });
      }
    }, [scene]);
    
    if (error) throw error;
    
    return scene ? (
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    ) : null;
  } catch (err) {
    console.error("Error in Model component:", err);
    return <Fallback />;
  }
}

const Testing = () => {
  const [showModel, setShowModel] = useState(true);
  const modelUrl = "https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb";

  const reloadModel = () => {
    setShowModel(false);
    setTimeout(() => setShowModel(true), 100);
    toast.info("Reloading 3D model...");
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Link to="/">
          <Button variant="outline">Back to AR</Button>
        </Link>
        <Button variant="secondary" onClick={reloadModel}>
          Reload Model
        </Button>
      </div>
      
      <h1 className="text-white text-2xl mb-4 text-center">Testing 3D Model</h1>
      
      <div className="w-full h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
        <Canvas
          shadows
          gl={{ 
            antialias: true,
            powerPreference: "default", // Changed from high-performance for better compatibility
            alpha: true,
            preserveDrawingBuffer: true,
          }}
          dpr={[1, 2]} // Limit pixel ratio for better performance
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: '#222' }}
          onCreated={({ gl }) => {
            console.log("Canvas created successfully");
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            // Set less demanding shadow map size
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
            toast.error("Error initializing 3D scene");
          }}
        >
          {/* Simple lighting setup */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.4} />
          
          <Suspense fallback={<LoadingMessage />}>
            <ErrorBoundary>
              {showModel && <Model url={modelUrl} />}
            </ErrorBoundary>
            <OrbitControls 
              makeDefault
              enableDamping={false}
              enableZoom={true}
              enablePan={true}
            />
          </Suspense>
          
          {/* Coordinate helper */}
          <axesHelper args={[2]} />
          
          {/* Simple floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        </Canvas>
      </div>
      
      <div className="mt-4 text-white/70 text-sm text-center">
        <p>If the model doesn't load, try the reload button or check the console for errors.</p>
      </div>
    </div>
  );
};

export default Testing;
