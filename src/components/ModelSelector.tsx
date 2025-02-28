
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Sample 3D models - these URLs should point to actual GLTF models
const AVAILABLE_MODELS = [
  { 
    id: "cube", 
    name: "Cube", 
    url: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Cube/Cube.gltf",
    thumbnail: "https://via.placeholder.com/100?text=Cube"
  },
  { 
    id: "duck", 
    name: "Duck", 
    url: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Duck/Duck.gltf",
    thumbnail: "https://via.placeholder.com/100?text=Duck"
  },
  { 
    id: "flamingo", 
    name: "Flamingo", 
    url: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Flamingo/Flamingo.gltf",
    thumbnail: "https://via.placeholder.com/100?text=Flamingo"
  },
];

interface ModelSelectorProps {
  onSelectModel: (modelUrl: string) => void;
  onPlaceModel: () => void;
  selectedModel: string | null;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  onSelectModel, 
  onPlaceModel,
  selectedModel
}) => {
  return (
    <Card className="bg-black/60 p-4 backdrop-blur-lg text-white w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Select a 3D Model</h2>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {AVAILABLE_MODELS.map((model) => (
          <div 
            key={model.id}
            onClick={() => {
              onSelectModel(model.url);
              toast.success(`Selected ${model.name}`);
            }}
            className={`cursor-pointer p-2 rounded-lg transition-all ${
              selectedModel === model.url ? 'bg-primary/80 ring-2 ring-primary' : 'bg-black/40 hover:bg-black/60'
            }`}
          >
            <div className="aspect-square overflow-hidden rounded-md bg-black/20 mb-1">
              <img 
                src={model.thumbnail} 
                alt={model.name}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-xs text-center">{model.name}</p>
          </div>
        ))}
      </div>
      
      <Button 
        className="w-full" 
        onClick={onPlaceModel}
        disabled={!selectedModel}
      >
        Place Model Here
      </Button>
      
      <p className="text-xs text-center mt-2 text-gray-300">
        This will place the model at your current location for others to see
      </p>
    </Card>
  );
};
