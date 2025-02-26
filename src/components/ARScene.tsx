
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

const Model = ({ modelUrl, scale, position }: ARSceneProps) => {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} scale={scale} position={[position.x, position.y, position.z]} />;
};

export const ARScene = ({ modelUrl, scale, position }: ARSceneProps) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Model modelUrl={modelUrl} scale={scale} position={position} />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};
