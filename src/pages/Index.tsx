
import { useEffect, useState } from "react";
import { Camera } from "@/components/Camera";
import { ARScene } from "@/components/ARScene";
import { CameraControls } from "@/components/CameraControls";
import { ModelControls } from "@/components/ModelControls";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Bug } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Index = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [modelScale, setModelScale] = useState(1);
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };

  useEffect(() => {
    // Debug browser info
    addDebugInfo(`Browser: ${navigator.userAgent}`);
    addDebugInfo(`Screen: ${window.innerWidth}x${window.innerHeight}`);
    
    // Check WebGL capabilities
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        addDebugInfo('WebGL not supported');
      } else {
        // Type assertion to WebGLRenderingContext
        const webGL = gl as WebGLRenderingContext;
        const debugInfo = webGL.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = webGL.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = webGL.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          addDebugInfo(`WebGL Vendor: ${vendor}`);
          addDebugInfo(`WebGL Renderer: ${renderer}`);
        }
      }
    } catch (e) {
      addDebugInfo(`WebGL check error: ${e}`);
    }
  }, []);

  const requestPermission = async () => {
    try {
      addDebugInfo('Requesting camera permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      addDebugInfo('Camera permission granted');
      toast.success("Camera access granted!");
    } catch (error) {
      console.error("Error accessing camera:", error);
      addDebugInfo(`Camera permission error: ${error}`);
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
      <div className="absolute top-4 left-4 flex gap-2">
        <Link to="/testing">
          <Button variant="outline" size="sm">
            <Bug className="mr-2 h-4 w-4" />
            Test Model
          </Button>
        </Link>
      </div>
      
      {/* Debug panel */}
      <div className="absolute bottom-24 left-0 w-full px-4">
        <details className="bg-black/70 text-white text-xs rounded p-2 max-h-28 overflow-y-auto">
          <summary className="cursor-pointer">Debug Info ({debugInfo.length})</summary>
          {debugInfo.map((info, i) => (
            <div key={i} className="whitespace-nowrap">{info}</div>
          ))}
        </details>
      </div>
    </div>
  );
};

export default Index;
