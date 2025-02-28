
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Testing = () => {
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
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        toast.success(`WebGL supported: ${vendor} - ${renderer}`);
      } else {
        toast.success("WebGL is supported in your browser");
      }
      
      return true;
    } catch (e) {
      console.error("WebGL test error:", e);
      toast.error("Error testing WebGL support");
      return false;
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
        <h1 className="text-3xl font-bold mb-8 text-center">3D Testing Page</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
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
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
              <li>Make sure your browser is up to date</li>
              <li>Try a different browser (Chrome or Firefox recommended)</li>
              <li>Enable hardware acceleration in browser settings</li>
              <li>Update your graphics drivers</li>
              <li>Disable browser extensions that might interfere</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>This test helps determine if your device can support the AR experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Testing;
