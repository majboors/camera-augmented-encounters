
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Single model for now, as requested
const AVAILABLE_MODELS = [
  { 
    id: "custom", 
    name: "3D Object", 
    url: "https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb",
    thumbnail: "https://via.placeholder.com/100?text=3D+Object"
  }
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
      <h2 className="text-xl font-bold mb-4">Place 3D Model in AR</h2>
      
      <div className="grid grid-cols-1 gap-2 mb-4">
        {AVAILABLE_MODELS.map((model) => (
          <div 
            key={model.id}
            onClick={() => {
              onSelectModel(model.url);
              toast.success(`Selected ${model.name}`);
            }}
            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
              selectedModel === model.url ? 'bg-primary/80 ring-2 ring-primary' : 'bg-black/40 hover:bg-black/60'
            }`}
          >
            <div className="aspect-square w-16 h-16 overflow-hidden rounded-md bg-black/20 mr-3">
              <img 
                src={model.thumbnail} 
                alt={model.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="font-medium">{model.name}</p>
              <p className="text-xs text-gray-300">Tap to select, then position using trajectory line</p>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        className="w-full" 
        onClick={onPlaceModel}
        disabled={!selectedModel}
      >
        Place Model At Trajectory Point
      </Button>
      
      <p className="text-xs text-center mt-2 text-gray-300">
        Move your device to adjust the placement trajectory
      </p>
    </Card>
  );
};
