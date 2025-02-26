
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface PermissionRequestProps {
  onRequestPermission: () => void;
}

export const PermissionRequest = ({ onRequestPermission }: PermissionRequestProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-black p-4 text-center">
      <div className="rounded-full bg-white/10 p-4">
        <Camera className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white">Camera Permission Required</h2>
      <p className="max-w-md text-gray-400">
        This app needs access to your camera to enable the AR experience. Your camera
        feed will only be used within this application.
      </p>
      <Button
        onClick={onRequestPermission}
        className="mt-4 bg-white text-black hover:bg-white/90"
      >
        Enable Camera
      </Button>
    </div>
  );
};
