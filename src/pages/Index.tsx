
import { useEffect, useState } from "react";
import { Camera } from "@/components/Camera";
import { ARScene } from "@/components/ARScene";
import { CameraControls } from "@/components/CameraControls";
import { ModelControls } from "@/components/ModelControls";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon } from "lucide-react";
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

  if (hasPermission === null || hasPermission === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-6 bg-black p-4 text-center">
        <div className="rounded-full bg-white/10 p-4">
          <CameraIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome to AR Camera</h2>
        <p className="max-w-md text-gray-400">
          This app needs access to your camera to enable the AR experience. Your camera
          feed will only be used within this application.
        </p>
        <Button
          onClick={requestPermission}
          className="mt-4 bg-white text-black hover:bg-white/90"
          size="lg"
        >
          Start AR Experience
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <Camera isFrontCamera={isFrontCamera} />
      <ARScene
        modelUrl="https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dog/model.gltf"
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
