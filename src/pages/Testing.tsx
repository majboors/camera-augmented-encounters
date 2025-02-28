
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Basic AR.js viewer component that uses string literals to render HTML
const ARJSViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if scripts are properly loaded
    if (!window.AFRAME) {
      setError("A-Frame library failed to load. Please refresh the page and try again.");
      setIsLoading(false);
      return;
    }
    
    // Simulate loading completion after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Set up error handling for WebGL context loss
    const handleWebGLContextLost = () => {
      console.error("WebGL context lost");
      setError("WebGL context lost. Please refresh the page and try again.");
    };
    
    window.addEventListener('webglcontextlost', handleWebGLContextLost, false);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('webglcontextlost', handleWebGLContextLost);
      // Clean up any resources if needed
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className="w-full h-full relative">
      {/* Since we're using custom A-Frame elements, we'll render them as-is using dangerouslySetInnerHTML */}
      <div className="absolute inset-0" dangerouslySetInnerHTML={{
        __html: `
          <a-scene 
            embedded
            vr-mode-ui="enabled: false"
            arjs="sourceType: webcam; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960; debugUIEnabled: false;"
          >
            <a-camera gps-camera rotation-reader></a-camera>
            
            <!-- For testing purposes, we'll add a static box that should appear in AR -->
            <a-box
              material="color: red"
              scale="1 1 1"
              position="0 1 -5"
              gps-entity-place="latitude: 0; longitude: 0;"
            ></a-box>
            
            <!-- This entity will be dynamically positioned based on user's location -->
            <a-sphere
              material="color: yellow"
              scale="1 1 1"
              gps-entity-place="latitude: 0; longitude: 0;"
            ></a-sphere>
          </a-scene>
        `
      }} />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="bg-black/80 text-white p-4 rounded-md text-center">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full mb-2"></div>
            <p>Initializing AR...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="bg-black/80 text-white p-4 rounded-md text-center max-w-[80%]">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4 text-white border-white hover:bg-white hover:text-black"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Testing = () => {
  const [hasTestedWebGL, setHasTestedWebGL] = useState(false);
  const [arEnabled, setArEnabled] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Helper function to add debug information
  const addDebugInfo = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, `${new Date().toISOString().slice(11, 19)}: ${message}`]);
  };
  
  // Basic WebGL test function
  const testWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        toast.error("WebGL is not supported in your browser");
        addDebugInfo("WebGL is not supported");
        return false;
      }
      
      // Try to get renderer info
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        toast.success(`WebGL supported: ${vendor} - ${renderer}`);
        addDebugInfo(`WebGL supported: ${vendor} - ${renderer}`);
      } else {
        toast.success("WebGL is supported in your browser");
        addDebugInfo("WebGL is supported but couldn't get detailed info");
      }
      
      setHasTestedWebGL(true);
      return true;
    } catch (e) {
      console.error("WebGL test error:", e);
      toast.error("Error testing WebGL support");
      addDebugInfo(`WebGL test error: ${e}`);
      return false;
    }
  };

  // Function to request location permission and enable AR
  const enableAR = async () => {
    try {
      toast.info("Requesting location permission...");
      addDebugInfo("Requesting location permission");
      
      // Request location permission
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });
      
      toast.success(`Location permission granted: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
      addDebugInfo(`Location permission granted: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
      
      // Add AR.js and A-Frame scripts to the document
      const addScript = (src: string) => {
        addDebugInfo(`Loading script: ${src}`);
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            addDebugInfo(`Script loaded: ${src}`);
            resolve();
          };
          script.onerror = (error) => {
            addDebugInfo(`Error loading script ${src}: ${error}`);
            reject(error);
          };
          document.head.appendChild(script);
        });
      };
      
      // Load required scripts
      try {
        await Promise.all([
          addScript('https://aframe.io/releases/1.3.0/aframe.min.js'),
          addScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js')
        ]);
        
        setArEnabled(true);
        toast.success("AR.js initialized successfully!");
        addDebugInfo("AR.js initialized successfully");
      } catch (scriptError) {
        console.error("Error loading AR scripts:", scriptError);
        toast.error("Failed to load AR.js scripts. Please check your internet connection.");
        addDebugInfo(`Error loading AR scripts: ${scriptError}`);
        throw new Error("Failed to load AR.js scripts");
      }
    } catch (error) {
      console.error("Error enabling AR:", error);
      toast.error("Failed to enable AR. Please ensure location permissions are granted.");
      addDebugInfo(`Error enabling AR: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Link to="/">
          <Button variant="outline">Back to AR</Button>
        </Link>
      </div>
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Location-Based AR Testing</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mb-6">
          <h2 className="text-xl font-semibold mb-4">WebGL & AR.js Compatibility Test</h2>
          <p className="text-gray-300 mb-6">
            AR.js requires WebGL and location permissions to work properly. Test your device compatibility below.
          </p>
          
          <Button 
            className="w-full mb-4" 
            onClick={testWebGL}
          >
            Test WebGL Support
          </Button>
        </div>
        
        {hasTestedWebGL && !arEnabled && (
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mb-6">
            <h2 className="text-xl font-semibold mb-4">Enable Location-Based AR</h2>
            <p className="text-gray-300 mb-6">
              Now that WebGL is confirmed working, you can enable location-based AR. This requires location permissions.
            </p>
            
            <Button 
              onClick={enableAR}
              className="w-full"
            >
              Enable AR.js
            </Button>
          </div>
        )}
        
        {arEnabled && (
          <div className="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden mb-6 relative">
            <ARJSViewer />
          </div>
        )}
        
        <div className="text-center text-gray-400 text-sm max-w-md">
          <p className="mb-2">
            AR.js allows you to create location-based AR experiences that run in web browsers without any app installation.
          </p>
          <p>
            For best results, use this page outdoors where GPS signal is stronger. The AR experience will place virtual objects in real-world coordinates.
          </p>
        </div>
      </div>
      
      {/* Debug panel */}
      <div className="fixed bottom-4 left-0 w-full px-4 z-20">
        <details className="bg-black/70 text-white text-xs rounded p-2 max-h-32 overflow-y-auto">
          <summary className="cursor-pointer">Debug Info ({debugInfo.length})</summary>
          {debugInfo.map((info, i) => (
            <div key={i} className="whitespace-nowrap">{info}</div>
          ))}
        </details>
      </div>
    </div>
  );
};

export default Testing;
