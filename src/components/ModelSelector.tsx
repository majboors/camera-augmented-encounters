
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Single model with the specified GLB URL
const MODEL_URL = "https://replicate.delivery/yhqm/5xOmxKPXDTpnIdxRRvs91WKWHTYNGmdBjuE7DbBEigZf0WCKA/output.glb";

interface ModelSelectorProps {
  onPlaceModel: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  onPlaceModel,
}) => {
  return (
    <Card className="bg-black/60 p-4 backdrop-blur-lg text-white w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Place 3D Model in AR</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-300 mb-2">
          Move your device to adjust the placement trajectory
        </p>
      </div>
      
      <Button 
        className="w-full" 
        onClick={onPlaceModel}
      >
        Put
      </Button>
    </Card>
  );
};
