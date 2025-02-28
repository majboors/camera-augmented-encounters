
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Model({ url }: { url: string }) {
  console.log("Loading model from URL:", url);
  const { scene } = useGLTF(url);
  console.log("Model loaded successfully:", scene);
  return (
    <primitive 
      object={scene} 
      scale={1} 
      position={[0, 0, 0]}
      castShadow
      receiveShadow
    />
  );
}

const Testing = () => {
  const modelUrl = "https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb";

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="outline">Back to AR</Button>
        </Link>
      </div>
      
      <h1 className="text-white text-2xl mb-4 text-center">Testing 3D Model</h1>
      
      <div className="w-full h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
        <Canvas
          shadows
          gl={{ 
            antialias: true,
            powerPreference: "high-performance",
          }}
          style={{ background: '#222' }}
          onCreated={({ gl }) => {
            console.log("Canvas created successfully");
            gl.setPixelRatio(window.devicePixelRatio);
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
            toast.error("Failed to initialize 3D scene");
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.5} />
          
          <React.Suspense fallback={null}>
            <Model url={modelUrl} />
            <OrbitControls />
          </React.Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default Testing;
