
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

export const ARScene = ({ modelUrl, scale, position }: ARSceneProps) => {
  const Model = () => {
    const { scene } = useGLTF(modelUrl);
    return <primitive object={scene} scale={scale} position={[position.x, position.y, position.z]} />;
  };

  return (
    <div className="absolute inset-0 z-10">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};
