
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ModelSelector } from "./ModelSelector";
import { ModelControls } from "./ModelControls";
import { Button } from "@/components/ui/button";

interface ModelPlacementProps {
  onPlaceModel: (modelData: PlacedModelData) => void;
}

export interface PlacedModelData {
  modelUrl: string;
  latitude: number;
  longitude: number;
  scale: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

// Set the model URL directly
const MODEL_URL = "https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb";

export const ModelPlacement: React.FC<ModelPlacementProps> = ({ onPlaceModel }) => {
  const [isPlacing, setIsPlacing] = useState(true); // Start in placing mode
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0, z: -3 }); // Start with model in front of user
  const [trajectory, setTrajectory] = useState({ x: 0, y: 0, z: -3 });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log("Current location:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          toast.error("Failed to get your location. Location-based features may not work properly.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }

    // Set up device orientation tracking for trajectory adjustment
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (isPlacing && event.beta && event.gamma) {
      // Convert device orientation to trajectory position
      // This is a simple mapping - beta controls y axis, gamma controls x axis
      const betaNormalized = (event.beta - 45) / 90; // Normalize beta to a -0.5 to 0.5 range
      const gammaNormalized = event.gamma / 90; // Normalize gamma to a -1 to 1 range
      
      // Update trajectory position based on device orientation
      setTrajectory({
        x: gammaNormalized * 3, // Scale for reasonable movement range
        y: betaNormalized * 2,  // Scale for reasonable movement range
        z: -3 + (Math.abs(betaNormalized) + Math.abs(gammaNormalized)), // Adjust depth based on tilt
      });
    }
  };

  const handlePlaceModel = () => {
    if (!currentLocation) {
      toast.error("Cannot place model: missing location data");
      return;
    }

    // Use the trajectory position for final placement
    const modelData: PlacedModelData = {
      modelUrl: MODEL_URL,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      scale: scale,
      position: trajectory
    };

    onPlaceModel(modelData);
    toast.success("Model placed successfully!");
    
    // Reset trajectory and position
    setTrajectory({ x: 0, y: 0, z: -3 });
    setPosition({ x: 0, y: 0, z: -3 });
  };

  return (
    <div className="fixed z-10">
      <ModelSelector onPlaceModel={handlePlaceModel} />
    </div>
  );
};
