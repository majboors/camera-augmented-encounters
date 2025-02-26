
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, FlipHorizontal } from "lucide-react";

interface CameraControlsProps {
  isFrontCamera: boolean;
  onFlipCamera: () => void;
}

export const CameraControls = ({ isFrontCamera, onFlipCamera }: CameraControlsProps) => {
  return (
    <div className="flex gap-4 rounded-full bg-black/20 p-4 backdrop-blur-lg">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-white/10 hover:bg-white/20"
        onClick={onFlipCamera}
      >
        <FlipHorizontal className="h-6 w-6 text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-white/10 hover:bg-white/20"
      >
        {isFrontCamera ? (
          <CameraOff className="h-6 w-6 text-white" />
        ) : (
          <Camera className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};
