
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from 'three';

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Model({ modelUrl, scale, position }: ARSceneProps) {
  const gltf = useGLTF(modelUrl);
  return (
    <primitive 
      object={gltf.scene} 
      scale={scale} 
      position={[position.x, position.y, position.z]}
    />
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  return (
    <div className="absolute inset-0 z-10">
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Model modelUrl={modelUrl} scale={scale} position={position} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dog/model.gltf");
