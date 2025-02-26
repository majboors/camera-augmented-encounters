
import { useEffect, useState } from "react";
import { Camera } from "@/components/Camera";
import { ARScene } from "@/components/ARScene";
import { CameraControls } from "@/components/CameraControls";
import { ModelControls } from "@/components/ModelControls";
import { PermissionRequest } from "@/components/PermissionRequest";
import { toast } from "sonner";

const Index = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [modelScale, setModelScale] = useState(1);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      toast.success("Camera access granted!");
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasPermission(false);
      toast.error("Camera access denied. Please enable camera permissions.");
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  if (hasPermission === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (hasPermission === false) {
    return <PermissionRequest onRequestPermission={requestPermission} />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Camera isFrontCamera={isFrontCamera} />
      <ARScene
        modelUrl="https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb"
        scale={modelScale}
        position={modelPosition}
      />
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <CameraControls
          isFrontCamera={isFrontCamera}
          onFlipCamera={() => setIsFrontCamera(!isFrontCamera)}
        />
      </div>
      <div className="absolute right-4 top-4">
        <ModelControls
          scale={modelScale}
          onScaleChange={setModelScale}
          position={modelPosition}
          onPositionChange={setModelPosition}
        />
      </div>
    </div>
  );
};

export default Index;
