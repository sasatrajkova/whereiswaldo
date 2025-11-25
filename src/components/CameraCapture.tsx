import { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          onCapture(blob);
          onClose();
        });
    }
  }, [onCapture, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Take a Photo</h2>

          <div className="mb-4 bg-black rounded-md overflow-hidden">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/png"
              videoConstraints={{
                facingMode: 'user',
              }}
              mirrored={true}
              className="w-full"
            />
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
