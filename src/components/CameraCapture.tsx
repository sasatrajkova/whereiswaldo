import { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import WaldoOverlay from '@/assets/WaldoOverlay.webp';
import SantaOverlay from '@/assets/SantaOverlay.webp';
import PizzaOverlay from '@/assets/PizzaOverlay.webp';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  overlayType: string;
}

const getOverlay = (overlayType: string) => {
  switch (overlayType) {
    case 'santa':
      return SantaOverlay;
    case 'pizza':
      return PizzaOverlay;
    case 'waldo':
    default:
      return WaldoOverlay;
  }
};

const calculateOverlayCrop = (
  overlayImg: HTMLImageElement,
  canvas: HTMLCanvasElement
) => {
  const overlayAspect = overlayImg.naturalWidth / overlayImg.naturalHeight;
  const canvasAspect = canvas.width / canvas.height;

  let srcX = 0,
    srcY = 0,
    srcWidth = overlayImg.naturalWidth,
    srcHeight = overlayImg.naturalHeight;

  if (overlayAspect > canvasAspect) {
    const newWidth = overlayImg.naturalHeight * canvasAspect;
    srcX = (overlayImg.naturalWidth - newWidth) / 2;
    srcWidth = newWidth;
  } else {
    const newHeight = overlayImg.naturalWidth / canvasAspect;
    srcY = (overlayImg.naturalHeight - newHeight) / 2;
    srcHeight = newHeight;
  }

  return { srcX, srcY, srcWidth, srcHeight };
};

const drawImageWithOverlay = (
  ctx: CanvasRenderingContext2D,
  baseImg: HTMLImageElement,
  overlayImg: HTMLImageElement,
  canvas: HTMLCanvasElement
) => {
  ctx.drawImage(baseImg, 0, 0);

  const { srcX, srcY, srcWidth, srcHeight } = calculateOverlayCrop(
    overlayImg,
    canvas
  );

  ctx.drawImage(
    overlayImg,
    srcX,
    srcY,
    srcWidth,
    srcHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
};

export function CameraCapture({ onCapture, overlayType }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImg = new Image();
    baseImg.src = imageSrc;

    baseImg.onload = () => {
      canvas.width = baseImg.width;
      canvas.height = baseImg.height;

      const overlayImg = new Image();
      overlayImg.src = getOverlay(overlayType);

      overlayImg.onload = () => {
        drawImageWithOverlay(ctx, baseImg, overlayImg, canvas);

        canvas.toBlob((blob) => {
          if (blob) {
            onCapture(blob);
          }
        }, 'image/png');
      };
    };
  }, [onCapture, overlayType]);

  return (
    <>
      <div className="relative w-full max-w-xl aspect-3/4 bg-black rounded-md overflow-hidden">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode: 'user' }}
          mirrored
          className="absolute inset-0 w-full h-full object-cover"
          onUserMedia={() => setIsCameraReady(true)}
        />
        {isCameraReady && (
          <img
            src={getOverlay(overlayType)}
            alt="Overlay Preview"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <Button onClick={handleCapture}>📸 Cheese</Button>
      </div>
    </>
  );
}
