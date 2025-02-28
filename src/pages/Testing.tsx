
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as THREE from "three";

// Basic ThreeJS viewer component
const ThreeJSViewer = ({ modelUrl }: { modelUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Reset states
    setIsLoading(true);
    setError(null);
    
    // Declare scene variables
    let scene: any;
    let camera: any;
    let renderer: any;
    let controls: any;
    let mixer: any = null;
    let clock = new THREE.Clock();
    let animationFrameId: number;
    
    // Initialize the scene
    const init = async () => {
      try {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x222222);
        
        // Add lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambient);
        
        const light = new THREE.SpotLight(0xFFFFFF, 2, 100, Math.PI / 4, 0.5);
        light.position.set(10, 25, 45);
        light.castShadow = true;
        scene.add(light);
        
        // Add grid helper for orientation
        const gridHelper = new THREE.GridHelper(10, 10, 0x666666, 0x444444);
        gridHelper.position.y = -1;
        scene.add(gridHelper);
        
        // Set up camera
        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || 400;
        camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 10000);
        camera.position.set(0, 0, 5);
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
          powerPreference: 'default'
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Clear container and append renderer
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(renderer.domElement);
        }
        
        // Import OrbitControls from Three.js examples
        const OrbitControls = (window as any).THREE?.OrbitControls || 
                             (THREE as any).OrbitControls;
        
        // Load the model using GLTFLoader
        // First check if GLTFLoader is available
        const GLTFLoader = (window as any).THREE?.GLTFLoader || 
                          (THREE as any).GLTFLoader;
        
        if (!GLTFLoader) {
          // If GLTFLoader is not available, we need to dynamically import it
          console.error("GLTFLoader not found. Trying to use default import.");
          setError("GLTFLoader not available. Please try a different browser.");
          setIsLoading(false);
          return;
        }
        
        const loader = new GLTFLoader();
        
        // Load the model with a Promise wrapper for better error handling
        try {
          loader.load(
            modelUrl,
            (gltf: any) => {
              // Add model to scene
              const model = gltf.scene;
              const scale = 1;
              model.scale.set(scale, scale, scale);
              model.position.set(0, 0, 0);
              model.castShadow = true;
              model.receiveShadow = true;
              
              // Handle animations if present
              const animations = gltf.animations;
              if (animations && animations.length) {
                mixer = new THREE.AnimationMixer(model);
                animations.forEach((animation: any) => {
                  mixer?.clipAction(animation).play();
                });
              }
              
              scene.add(model);
              setIsLoading(false);
              
              // Add orbit controls
              if (OrbitControls) {
                controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = false;
                controls.dampingFactor = 0.05;
                controls.screenSpacePanning = false;
                controls.minDistance = 1;
                controls.maxDistance = 50;
                controls.maxPolarAngle = Math.PI / 2;
              } else {
                console.warn("OrbitControls not available");
              }
            },
            (xhr: any) => {
              const progress = Math.floor((xhr.loaded / xhr.total) * 100);
              console.log(`Loading model: ${progress}%`);
            },
            (error: any) => {
              console.error('Error loading model:', error);
              setError("Failed to load 3D model. Please try a different file.");
              setIsLoading(false);
            }
          );
        } catch (err) {
          console.error("Failed to load model:", err);
          setError("Failed to load 3D model. Please try a different file.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Scene initialization error:", err);
        setError("Failed to initialize 3D viewer. Please try a different browser.");
        setIsLoading(false);
      }
    };
    
    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      
      if (controls) {
        controls.update();
      }
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    // Initialize
    init().then(() => {
      animate();
      window.addEventListener('resize', handleResize);
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      if (controls) {
        controls.dispose();
      }
      
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [modelUrl]);
  
  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-black/80 text-white p-4 rounded-md text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full mb-2"></div>
            <p>Loading model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-black/80 text-white p-4 rounded-md text-center max-w-[80%]">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

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

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      toast.error("Please select a GLB or GLTF file");
      return;
    }

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
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Load sample model
  const loadSampleModel = () => {
    // Using the URL from your example
    const sampleUrl = "https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb";
    setModelUrl(sampleUrl);
    toast.success("Loading sample model...");
  };

  // Reset the view
  const resetView = () => {
    if (modelUrl && modelUrl.startsWith('blob:')) {
      URL.revokeObjectURL(modelUrl);
    }
    
    setModelUrl(null);
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
              >
                Upload GLB/GLTF File
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
          <div className="w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden mb-6">
            <ThreeJSViewer modelUrl={modelUrl} />
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

// Add declaration to let TypeScript know OrbitControls and GLTFLoader can be added to THREE
declare global {
  interface Window {
    THREE: typeof THREE & {
      OrbitControls?: any;
      GLTFLoader?: any;
    };
  }
}

export default Testing;
