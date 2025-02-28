
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
    <Card className="bg-black/80 p-4 backdrop-blur-lg text-white absolute top-4 right-4 w-auto max-w-[200px] border border-white/20">
      <h2 className="text-lg font-bold mb-2">Place 3D Model</h2>
      
      <div className="mb-3">
        <p className="text-xs text-gray-300">
          Move device to adjust position
        </p>
      </div>
      
      <Button 
        className="w-full bg-white text-black hover:bg-gray-200" 
        onClick={onPlaceModel}
      >
        Put
      </Button>
    </Card>
  );
};
