
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
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

// Simple fallback box that we know will render
function SimpleBox() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

// A simple scene with a spinning cube
function SimpleScene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      <SimpleBox />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      
      <OrbitControls 
        enableDamping={false}
        enableZoom={true}
        enablePan={true}
      />
    </>
  );
}

const Testing = () => {
  const [showFallback, setShowFallback] = useState(false);

  const toggleFallback = () => {
    setShowFallback(!showFallback);
    toast.info(showFallback ? "Attempting to load 3D model..." : "Showing fallback box");
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Link to="/">
          <Button variant="outline">Back to AR</Button>
        </Link>
        <Button variant="secondary" onClick={toggleFallback}>
          {showFallback ? "Try Model" : "Show Fallback"}
        </Button>
      </div>
      
      <h1 className="text-white text-2xl mb-4 text-center">Testing 3D Scene</h1>
      
      <div className="w-full h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
        <Canvas
          gl={{ 
            antialias: true,
            powerPreference: "default",
            alpha: true,
          }}
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: '#222' }}
          onCreated={({ gl }) => {
            console.log("Canvas created successfully");
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
            toast.error("Error initializing 3D scene");
          }}
        >
          <Suspense fallback={<LoadingMessage />}>
            <SimpleScene />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="mt-4 text-white/70 text-sm text-center">
        <p>This is a basic 3D scene to test if Three.js is working on your device.</p>
      </div>
    </div>
  );
};

export default Testing;
