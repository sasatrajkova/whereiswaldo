import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import WaldoOverlay from '@/assets/WaldoOverlay.png';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const drawScreenshot = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement
  ) => {
    ctx.drawImage(img, 0, 0);
  };

  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    if (overlayRef.current) {
      ctx.drawImage(overlayRef.current, 0, 0, canvas.width, canvas.height);
    }
  };

  const convertCanvasToBlob = (
    canvas: HTMLCanvasElement,
    callback: (blob: Blob) => void
  ) => {
    canvas.toBlob((blob) => {
      if (blob) {
        callback(blob);
      }
    }, 'image/png');
  };

  const callOnCapture = (blob: Blob) => {
    onCapture(blob);
    onClose();
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Create a canvas to composite the screenshot and overlay
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        drawScreenshot(ctx, img);
        drawOverlay(ctx, canvas);
        convertCanvasToBlob(canvas, callOnCapture);
      };
      img.src = imageSrc;
    }
  }, [onCapture, onClose]);

  const handleUserMedia = () => {
    setIsCameraReady(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Take a Photo</h2>

          <div className="mb-4 bg-black rounded-md overflow-hidden relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{
                facingMode: 'user',
              }}
              mirrored={true}
              className="w-full"
              onUserMedia={handleUserMedia}
            />
            <img
              ref={overlayRef}
              src={WaldoOverlay}
              alt="Waldo Overlay"
              className="absolute inset-0 w-full h-full pointer-events-none object-cover"
              style={{ display: 'none' }}
            />
            {isCameraReady && (
              <img
                src={WaldoOverlay}
                alt="Waldo Overlay Preview"
                className="absolute inset-0 w-full h-full pointer-events-none object-cover"
              />
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCapture}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
            >
              📸 Capture
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
