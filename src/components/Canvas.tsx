import React, { useContext, useEffect, useRef, useCallback } from "react";
import { fabric } from "fabric";
import { CartContext, CartContextType } from "../CartContext";
import './style/Canvas.scss';

interface CanvasProps {
  gradientColor1?: string;
  gradientColor2?: string;
  useGradient?: boolean;
  imageSrcs: string[];
  width: number | string;
  height: number | string;
  triggerDownload: boolean;
  maxImageWidth?: number;
  onResize: (width: number, height: number) => void;
  onDownloadComplete: () => void;
}

interface ImageItem {
  id: string;
  src: string;
}

const Canvas: React.FC<CanvasProps> = ({
  gradientColor1 = "",
  gradientColor2 = "",
  useGradient = false,
  imageSrcs,
  width,
  height,
  maxImageWidth = 300,
  triggerDownload,
  onResize,
  onDownloadComplete,
}) => {
  const scaleToCmX = 14 / Number(width);
  const scaleToCmY = 20 / Number(height);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const selectedImageRef = useRef<fabric.Image | null>(null);
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  const imageMapRef = useRef(
    new Map<
      fabric.Image,
      {
        silhouette: fabric.Image;
        gradientColor1: string;
        gradientColor2: string;
        useGradient: boolean;
      }
    >()
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.key === "Backspace" || e.key === "Delete") && selectedImageRef.current) {
      const silhouette = imageMapRef.current.get(
        selectedImageRef.current
      )?.silhouette;
      if (silhouette) {
        fabricCanvasRef.current?.remove(silhouette);
      }
      fabricCanvasRef.current?.remove(selectedImageRef.current);
      imageMapRef.current.delete(selectedImageRef.current);
      selectedImageRef.current = null;
    }
  }, []);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (e.clipboardData && fabricCanvasRef.current) {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const blob = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgElement = new Image();
            imgElement.src = event.target?.result as string;
            imgElement.onload = () =>
              addImageToCanvas({
                id: `${imgElement.src}-${Date.now()}`,
                src: imgElement.src,
              });
          };
          if (blob) reader.readAsDataURL(blob);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateScaleFactor = useCallback(
    (imgElement: HTMLImageElement, maxDimension: number) => {
      const scaleWidth = maxDimension / imgElement.width;
      const scaleHeight = maxDimension / imgElement.height;
      return Math.min(scaleWidth, scaleHeight, 1);
    },
    []
  );

  const updateImageDimensions = useCallback(
    (fabricImg: fabric.Image) => {
      if (
        fabricImg.width &&
        fabricImg.scaleX &&
        fabricImg.height &&
        fabricImg.scaleY
      ) {
        const widthInCm = (fabricImg.width * fabricImg.scaleX) * scaleToCmX;
        const heightInCm = (fabricImg.height * fabricImg.scaleY) * scaleToCmY;
        onResize(widthInCm, heightInCm);
      }
    },
    [onResize, scaleToCmX, scaleToCmY]
  );

  const addImageToCanvas = useCallback(
    (image: ImageItem) => {
      const fabricCanvas = fabricCanvasRef.current;
      if (fabricCanvas) {
        const imgElement = new Image();
        imgElement.src = image.src;
        imgElement.crossOrigin = "anonymous";
        imgElement.onload = () => {
          const scaleFactor = calculateScaleFactor(imgElement, maxImageWidth);
          fabric.Image.fromURL(imgElement.src, (fabricImg) => {
            fabricImg.set({
              left: fabricCanvas.width! / 2,
              top: fabricCanvas.height! / 2,
              originX: "center",
              originY: "center",
              scaleX: scaleFactor,
              scaleY: scaleFactor,
              selectable: true,
              hasControls: true,
              hasBorders: true,
              hasRotatingPoint: true,
            });

            fabricCanvas.add(fabricImg);
            fabricCanvas.setActiveObject(fabricImg);
            fabricCanvas.renderAll();

            updateImageDimensions(fabricImg);

            fabricImg.on("scaling", () => updateImageDimensions(fabricImg));
            fabricImg.on("scaled", () => updateImageDimensions(fabricImg));
          });
        };
      }
    },
    [calculateScaleFactor, maxImageWidth, updateImageDimensions]
  );

  const initializeCanvas = useCallback(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
        selection: true, // Allow selection
      });

      fabricCanvasRef.current.setDimensions(
        { width: "500px", height: "700px" },
        { cssOnly: true }
      );

      fabricCanvasRef.current.on("mouse:down", (options) => {
        selectedImageRef.current = (options.target as fabric.Image) || null;
      });

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("paste", handlePaste);

      return () => {
        fabricCanvasRef.current?.dispose();
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("paste", handlePaste);
      };
    }
  }, [handleKeyDown, handlePaste]);

  const handleDownload = useCallback(() => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1.0,
      });

      const productToAdd = {
        img: dataURL,
        name: "Collection personalizada",
        price: 22,
        tamano: "14x20",
        acabado: "Transferible",
      };

      setCart([...cart, productToAdd]);
    }
  }, [cart, setCart]);

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  useEffect(() => {
    if (selectedImageRef.current) {
      const currentSilhouette = imageMapRef.current.get(
        selectedImageRef.current
      )?.silhouette!;
      imageMapRef.current.set(selectedImageRef.current, {
        silhouette: currentSilhouette,
        gradientColor1: gradientColor1,
        gradientColor2: gradientColor2,
        useGradient: useGradient,
      });
    }
  }, [gradientColor1, gradientColor2, useGradient]);

  useEffect(() => {
    if (triggerDownload) {
      handleDownload();
      onDownloadComplete();
    }
  }, [triggerDownload, handleDownload, onDownloadComplete]);

  useEffect(() => {
    if (imageSrcs.length > 0) {
      const newImageSrc = imageSrcs[imageSrcs.length - 1];
      const newImage = {
        id: `${newImageSrc}-${Date.now()}-${Math.random()}`,
        src: newImageSrc,
      };
      addImageToCanvas(newImage);
    }
  }, [imageSrcs, addImageToCanvas]);

  return (
    <div>

        <div className="cuadricula-canvas">
        <canvas
          ref={canvasRef}
          width={typeof width === "number" ? width : undefined}
          height={typeof height === "number" ? height : undefined}
          style={{
            width: typeof width === "string" ? width : undefined,
            height: typeof height === "string" ? height : undefined,
          }}
        />
    </div>
    </div>
  );
};

export default Canvas;
