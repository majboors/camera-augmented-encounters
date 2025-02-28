
import React, { Suspense, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

// Simple loading indicator
function LoadingSpinner() {
  return (
    <Html center>
      <div className="bg-black/80 text-white p-4 rounded-md text-center">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full mb-2"></div>
        <p>Loading model...</p>
      </div>
    </Html>
  );
}

// Error display
function ErrorDisplay({ message }: { message: string }) {
  return (
    <Html center>
      <div className="bg-black/80 text-white p-4 rounded-md text-center max-w-[200px]">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-sm">{message}</p>
      </div>
    </Html>
  );
}

// Simple 3D model component with better error handling
function Model({ url }: { url: string }) {
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset error state when URL changes
    setError(null);
  }, [url]);
  
  try {
    // Using try-catch inside a component can cause issues with React
    // so we'll handle errors in a controlled way
    const { scene } = useGLTF(url);
    
    return (
      <>
        {error ? (
          <ErrorDisplay message={error} />
        ) : (
          <primitive 
            object={scene} 
            scale={1} 
            position={[0, 0, 0]}
            onError={(e: any) => {
              console.error("Model error:", e);
              setError("Failed to render model");
            }}
          />
        )}
      </>
    );
  } catch (err) {
    console.error("Model load error:", err);
    
    // If we hit an error, show a fallback cube and an error message
    return (
      <>
        <ErrorDisplay message="Error loading model. Try a different file." />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      </>
    );
  }
}

// A simple scene with a placeholder cube
function PlaceholderBox() {
  return (
    <mesh rotation={[0, Math.PI * 0.25, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff88ee" />
    </mesh>
  );
}

// A grid to help with orientation
function Grid() {
  return (
    <gridHelper 
      args={[10, 10, "#666666", "#444444"]} 
      position={[0, -1, 0]} 
      rotation={[0, 0, 0]}
    />
  );
}

const Testing = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [hasTestedWebGL, setHasTestedWebGL] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canvasError, setCanvasError] = useState<string | null>(null);
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

    setIsLoading(true);
    setCanvasError(null);
    
    try {
      // Revoke previous URL if it exists
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
      }
      
      const objectUrl = URL.createObjectURL(file);
      setModelUrl(objectUrl);
      toast.success(`Loading model: ${file.name}`);
    } catch (err) {
      console.error("File handling error:", err);
      toast.error("Failed to process the file");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle upload of sample model
  const loadSampleModel = () => {
    setIsLoading(true);
    setCanvasError(null);
    
    // Using a small sample model that should load quickly
    const sampleUrl = "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf";
    setModelUrl(sampleUrl);
    toast.success("Loading sample model...");
  };

  // Reset everything
  const resetView = () => {
    if (modelUrl && modelUrl.startsWith('blob:')) {
      URL.revokeObjectURL(modelUrl);
    }
    
    setModelUrl(null);
    setCanvasError(null);
    toast.info("View reset");
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
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Upload GLB File"}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".glb,.gltf"
                className="hidden"
              />
              
              <div className="text-center text-gray-400 my-2">or</div>
              
              <Button 
                onClick={loadSampleModel}
                variant="secondary"
                className="w-full"
                disabled={isLoading}
              >
                Load Sample Model
              </Button>
              
              {modelUrl && (
                <Button 
                  onClick={resetView}
                  variant="destructive"
                  className="w-full mt-2"
                >
                  Reset View
                </Button>
              )}
            </div>
          </div>
        )}
        
        {(hasTestedWebGL && modelUrl) && (
          <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden mb-6 relative">
            {canvasError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="bg-red-900/50 p-4 rounded-md text-white max-w-[80%] text-center">
                  <h3 className="text-lg font-bold mb-2">Rendering Error</h3>
                  <p>{canvasError}</p>
                </div>
              </div>
            ) : (
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: '#222' }}
                onCreated={({ gl }) => {
                  console.log("Canvas created");
                  gl.setClearColor(new THREE.Color('#222222'));
                }}
                onError={(error) => {
                  console.error("Canvas error:", error);
                  setCanvasError("Failed to initialize 3D canvas. Try a different browser.");
                }}
              >
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <Grid />
                
                <Suspense fallback={<>
                  <LoadingSpinner />
                  <PlaceholderBox />
                </>}>
                  {modelUrl && <Model url={modelUrl} />}
                </Suspense>
                
                <OrbitControls 
                  makeDefault 
                  enableDamping={false}
                  enableZoom={true}
                />
              </Canvas>
            )}
          </div>
        )}
        
        <div className="text-center text-gray-400 text-sm max-w-md">
          <p className="mb-2">This testing page helps determine if your device can support the AR experience.</p>
          <p>If you're having trouble, try a different browser like Chrome or Firefox, or a different device.</p>
        </div>
      </div>
    </div>
  );
};

export default Testing;
