
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface ARSceneProps {
  modelUrl: string;
  scale: number;
  position: { x: number; y: number; z: number };
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="royalblue" opacity={0.8} transparent={true} />
      </mesh>
    </>
  );
}

export function ARScene({ modelUrl, scale, position }: ARSceneProps) {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, pointerEvents: "none" }}>
      <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: "transparent" }}
          gl={{
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
          }}
        >
          <Scene />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  );
}
