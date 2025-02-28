
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

export const ModelPlacement: React.FC<ModelPlacementProps> = ({ onPlaceModel }) => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

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
  }, []);

  const handleSelectModel = (modelUrl: string) => {
    setSelectedModel(modelUrl);
    setIsPlacing(true);
  };

  const handlePlaceModel = () => {
    if (!selectedModel || !currentLocation) {
      toast.error("Cannot place model: missing model or location data");
      return;
    }

    const modelData: PlacedModelData = {
      modelUrl: selectedModel,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      scale: scale,
      position: position
    };

    onPlaceModel(modelData);
    toast.success("Model placed successfully!");
    setIsPlacing(false);
    setSelectedModel(null);
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-10 px-4">
      {isPlacing ? (
        <div className="flex flex-col space-y-4">
          <ModelControls 
            scale={scale}
            onScaleChange={setScale}
            position={position}
            onPositionChange={setPosition}
          />
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={() => setIsPlacing(false)} 
              variant="outline" 
              className="bg-black/50 text-white border-white/50 hover:bg-black/80"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceModel}
            >
              Confirm Placement
            </Button>
          </div>
        </div>
      ) : (
        <ModelSelector 
          onSelectModel={handleSelectModel}
          onPlaceModel={() => setIsPlacing(true)}
          selectedModel={selectedModel}
        />
      )}
    </div>
  );
};
