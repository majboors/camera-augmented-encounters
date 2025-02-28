
import React, { Suspense, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Simple 3D model component
function Model({ url }: { url: string }) {
  try {
    const { scene } = useGLTF(url);
    return (
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, 0, 0]}
      />
    );
  } catch (error) {
    console.error("Error loading model:", error);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    );
  }
}

// A simple scene with a placeholder cube
function PlaceholderBox() {
  return (
    <mesh rotation={[0, Math.PI * 0.25, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

const Testing = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [hasTestedWebGL, setHasTestedWebGL] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Basic WebGL test function
  const testWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        toast.error("WebGL is not supported in your browser");
        return false;
      }
      
      // Try to get renderer info
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        toast.success(`WebGL supported: ${vendor} - ${renderer}`);
      } else {
        toast.success("WebGL is supported in your browser");
      }
      
      setHasTestedWebGL(true);
      return true;
    } catch (e) {
      console.error("WebGL test error:", e);
      toast.error("Error testing WebGL support");
      return false;
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    if (!file.name.toLowerCase().endsWith('.glb')) {
      toast.error("Please select a GLB file");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setModelUrl(objectUrl);
    toast.success(`Loading model: ${file.name}`);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle upload of sample model
  const loadSampleModel = () => {
    const sampleUrl = "https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb";
    setModelUrl(sampleUrl);
    toast.success("Loading sample model...");
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Link to="/">
          <Button variant="outline">Back to AR</Button>
        </Link>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">3D Testing Page</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mb-6">
          <h2 className="text-xl font-semibold mb-4">WebGL Compatibility Test</h2>
          <p className="text-gray-300 mb-6">
            The 3D models require WebGL to render properly. Test if your device supports WebGL below.
          </p>
          
          <Button 
            className="w-full mb-4" 
            onClick={testWebGL}
          >
            Test WebGL Support
          </Button>
        </div>
        
        {hasTestedWebGL && (
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mb-6">
            <h2 className="text-xl font-semibold mb-4">Test 3D Model Rendering</h2>
            <p className="text-gray-300 mb-6">
              Now that WebGL is confirmed working, you can test rendering a 3D model.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleUploadClick}
                className="w-full"
              >
                Upload GLB File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".glb"
                className="hidden"
              />
              
              <div className="text-center text-gray-400 my-2">or</div>
              
              <Button 
                onClick={loadSampleModel}
                variant="secondary"
                className="w-full"
              >
                Load Sample Model
              </Button>
            </div>
          </div>
        )}
        
        {(hasTestedWebGL && modelUrl) && (
          <div className="w-full h-[300px] bg-gray-900 rounded-lg overflow-hidden mb-6">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ background: '#222' }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              
              <Suspense fallback={<PlaceholderBox />}>
                {modelUrl && <Model url={modelUrl} />}
              </Suspense>
              
              <OrbitControls />
            </Canvas>
          </div>
        )}
        
        <div className="text-center text-gray-400 text-sm">
          <p>This testing page helps determine if your device can support the AR experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Testing;
