import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  env,
  AutoModel,
  AutoProcessor,
  RawImage,
  Processor,
  PreTrainedModel,
} from '@huggingface/transformers';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { createFileRoute, Link } from '@tanstack/react-router';
import { createUser } from '@/database/database';
import { CameraCapture } from '@/components/CameraCapture';
import WaldoBackground from '@/assets/WaldoBackground.jpg';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/createAvatar')({
  component: RouteComponent,
});

function RouteComponent() {
  const [images, setImages] = useState<string[]>([]);
  const [username, setUsername] = useState<string>('');
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDownloadReady, setIsDownloadReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const modelRef = useRef<PreTrainedModel>(null);
  const processorRef = useRef<Processor>(null);

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

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    setImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  });

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setProcessedImages((prevProcessed) =>
      prevProcessed.filter((_, i) => i !== index)
    );
  };

  const handleCameraCapture = useCallback((blob: Blob) => {
    const imageUrl = URL.createObjectURL(blob);
    setImages((prevImages) => [...prevImages, imageUrl]);
    setShowCamera(false);
  }, []);

  const processImages = async () => {
    setIsProcessing(true);
    setProcessedImages([]);

    const model = modelRef.current as PreTrainedModel;
    const processor = processorRef.current as Processor;

    for (let i = 0; i < images.length; ++i) {
      // Load image
      const img = await RawImage.fromURL(images[i]);

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

      setProcessedImages((prevProcessed) => [
        ...prevProcessed,
        canvas.toDataURL('image/png'),
      ]);
      if (i === 0) {
        createUser(username, canvas.toDataURL('image/jpeg', 0.5));
      }
    }

    setIsProcessing(false);
    setIsDownloadReady(true);
  };

  const downloadAsZip = async () => {
    const zip = new JSZip();
    const promises = images.map(
      (image, i) =>
        new Promise((resolve) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

          const img = new Image();
          img.src = processedImages[i] || image;

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                zip.file(`image-${i + 1}.png`, blob);
              }
              resolve(null);
            }, 'image/png');
          };
        })
    );

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'images.zip');
  };

  const clearAll = () => {
    setImages([]);
    setProcessedImages([]);
    setIsDownloadReady(false);
  };

  const copyToClipboard = async (url: string) => {
    try {
      // Fetch the image from the URL and convert it to a Blob
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a clipboard item with the image blob
      const clipboardItem = new ClipboardItem({ [blob.type]: blob });

      // Write the clipboard item to the clipboard
      await navigator.clipboard.write([clipboardItem]);

      console.log('Image copied to clipboard');
    } catch (err) {
      console.error('Failed to copy image: ', err);
    }
  };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl mb-2">ERROR</h2>
          <p className="text-xl max-w-[500px]">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Loading background removal model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Remove Background WebGPU
        </h1>
        <h2 className="text-lg font-semibold mb-2 text-center">
          In-browser background removal, powered by{' '}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/xenova/transformers.js"
          >
            🤗 Transformers.js
          </a>
        </h2>
        <div className="flex justify-center mb-8 gap-8">
          <a
            className="underline"
            target="_blank"
            href="https://github.com/huggingface/transformers.js-examples/blob/main/LICENSE"
          >
            License (Apache 2.0)
          </a>
          <a
            className="underline"
            target="_blank"
            href="https://huggingface.co/Xenova/modnet"
          >
            Model (MODNet)
          </a>
          <a
            className="underline"
            target="_blank"
            href="https://github.com/huggingface/transformers.js-examples/tree/main/remove-background-webgpu/"
          >
            Code (GitHub)
          </a>
        </div>
        <div
          {...getRootProps()}
          className={`p-8 mb-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ease-in-out
            ${isDragAccept ? 'border-green-500 bg-green-900/20' : ''}
            ${isDragReject ? 'border-red-500 bg-red-900/20' : ''}
            ${isDragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 hover:border-blue-500 hover:bg-blue-900/10'}
          `}
        >
          <input {...getInputProps()} className="hidden" />
          <p className="text-lg mb-2">
            {isDragActive
              ? 'Drop the images here...'
              : 'Drag and drop some images here'}
          </p>
          <p className="text-sm text-gray-400">or click to select files</p>
        </div>
        <div className="flex flex-col items-center gap-4 mb-8">
          <input
            className="bg-white text-black"
            onChange={(value) => setUsername(value.target.value)}
          />
          <button
            onClick={() => setShowCamera(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200 text-lg font-semibold"
          >
            📷 Take a Picture
          </button>
          <button
            onClick={processImages}
            disabled={isProcessing || images.length === 0}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-semibold"
          >
            {isProcessing ? 'Processing...' : 'Process'}
          </button>
          <div className="flex gap-4">
            <button
              onClick={downloadAsZip}
              disabled={!isDownloadReady}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              Download as ZIP
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200 text-sm"
            >
              Clear All
            </button>
            <Link to="/chooseWaldo">
              <Button variant="secondary">Choose Waldo</Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={processedImages[index] || src}
                alt={`Image ${index + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
              {processedImages[index] && (
                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() =>
                      copyToClipboard(processedImages[index] || src)
                    }
                    className="mx-2 px-3 py-1 bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm"
                    aria-label={`Copy image ${index + 1} to clipboard`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadImage(processedImages[index] || src)}
                    className="mx-2 px-3 py-1 bg-white text-gray-900 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm"
                    aria-label={`Download image ${index + 1}`}
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </div>
    </div>
  );
}
