
import { useEffect, useRef } from "react";

interface CameraProps {
  isFrontCamera: boolean;
}

export const Camera = ({ isFrontCamera }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
          },
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error starting camera:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isFrontCamera]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="h-full w-full object-cover"
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }}
    />
  );
};
