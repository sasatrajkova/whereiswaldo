import { useState, useCallback, useEffect, useRef } from 'react';
import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage,
  Processor,
  PreTrainedModel,
} from '@huggingface/transformers';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { createUser, myNameKey } from '@/database/database';
import { CameraCapture } from '@/components/CameraCapture';
import WaldoBackground from '@/assets/WaldoBackground.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/createAvatar')({
  component: RouteComponent,
});

function RouteComponent() {
  const [image, setImage] = useState<string>('');
  const [username, setUsername] = useState<string>(
    localStorage.getItem(myNameKey) ?? ''
  );
  const [processedImage, setProcessedImage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUserCreated, setIsUserCreated] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const modelRef = useRef<PreTrainedModel>(null);
  const processorRef = useRef<Processor>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        if (!('gpu' in navigator) || !env.backends.onnx.wasm) {
          throw new Error('WebGPU is not supported in this browser.');
        }
        const model_id = 'Xenova/modnet';
        env.backends.onnx.wasm.proxy = false;
        modelRef.current ??= await AutoModel.from_pretrained(model_id, {
          device: 'webgpu',
        });
        processorRef.current ??= await AutoProcessor.from_pretrained(model_id);
      } catch (err) {
        setError(err);
      }
      setIsLoading(false);
    })();
  }, []);

  const handleCameraCapture = useCallback((blob: Blob) => {
    const imageUrl = URL.createObjectURL(blob);
    setImage(imageUrl);
    setShowCamera(false);
    processImages(imageUrl);
  }, []);

  async function processImages(imageUrl: string) {
    setIsProcessing(true);
    setProcessedImage('');

    const model = modelRef.current as PreTrainedModel;
    const processor = processorRef.current as Processor;

    // Load image
    const img = await RawImage.fromURL(imageUrl);

    // Pre-process image
    const { pixel_values } = await processor(img);

    // Predict alpha matte
    const { output } = await model({ input: pixel_values });

    const maskData = (
      await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(
        img.width,
        img.height
      )
    ).data;

    // Create new canvas
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Draw background image
    const bgImg = new Image();
    bgImg.src = WaldoBackground;
    await new Promise((resolve) => {
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        resolve(null);
      };
    });

    // Draw original image on top with mask
    const originalCanvas = img.toCanvas();
    const originalData = originalCanvas
      .getContext('2d')
      ?.getImageData(0, 0, img.width, img.height);

    if (originalData) {
      for (let j = 0; j < maskData.length; ++j) {
        originalData.data[4 * j + 3] = maskData[j];
      }
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
      tempCtx.putImageData(originalData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);
    }

    setProcessedImage(canvas.toDataURL('image/png'));
    setIsProcessing(false);
    tryCreatingUser();
  }

  async function tryCreatingUser() {
    if (!username || !processedImage) {
      setIsUserCreated(false);
      return;
    }

    await createUser(username, processedImage);
    setIsUserCreated(true);
  }

  async function tryCreatingUserAndContinue() {
    await tryCreatingUser();
    navigate({ to: '/chooseWaldo' });
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-4xl mb-2">ERROR</h2>
        <p className="text-xl max-w-[500px]">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="text-lg">Thinking...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-2 text-center">Create your Waldo</h1>
      <div className="flex flex-col items-center gap-4 mb-8">
        <Input
          className="bg-white text-black"
          placeholder="Enter your name"
          value={username}
          onChange={(value) => setUsername(value.target.value)}
        />
        {image && (
          <div>
            <img
              src={processedImage || image}
              alt={`A wonderful Waldo`}
              className="rounded-xl object-cover"
            />
          </div>
        )}
        <Button
          variant="outline"
          onClick={() => setShowCamera(true)}
          disabled={isProcessing}
        >
          {image ? 'Retake Picture' : 'Take a picture'}
        </Button>
        {isUserCreated && (
          <Link to="/chooseWaldo">
            <Button>Continue</Button>
          </Link>
        )}
        {!isUserCreated && (
          <Button
            disabled={!username || !processedImage}
            onClick={() => tryCreatingUserAndContinue()}
          >
            Create Waldo
          </Button>
        )}
      </div>
      {showCamera && (
        <CameraCapture
          onCapture={(c) => handleCameraCapture(c)}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
