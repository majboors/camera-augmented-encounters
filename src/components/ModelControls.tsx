
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface ModelControlsProps {
  scale: number;
  onScaleChange: (value: number) => void;
  position: { x: number; y: number; z: number };
  onPositionChange: (position: { x: number; y: number; z: number }) => void;
}

export const ModelControls = ({
  scale,
  onScaleChange,
  position,
  onPositionChange,
}: ModelControlsProps) => {
  return (
    <Card className="w-64 space-y-4 bg-black/20 p-4 backdrop-blur-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Scale</label>
        <Slider
          value={[scale]}
          onValueChange={([value]) => onScaleChange(value)}
          min={0.1}
          max={5}
          step={0.1}
          className="z-50"
        />
      </div>
      {["x", "y", "z"].map((axis) => (
        <div key={axis} className="space-y-2">
          <label className="text-sm font-medium text-white">
            Position {axis.toUpperCase()}
          </label>
          <Slider
            value={[position[axis as keyof typeof position]]}
            onValueChange={([value]) =>
              onPositionChange({ ...position, [axis]: value })
            }
            min={-5}
            max={5}
            step={0.1}
            className="z-50"
          />
        </div>
      ))}
    </Card>
  );
};
