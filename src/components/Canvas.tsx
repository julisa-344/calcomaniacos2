import React, { useContext, useEffect, useRef, useCallback } from "react";
import { fabric } from "fabric";
import { CartContext, CartContextType } from "../CartContext";
import "./style/Canvas.scss";

interface CanvasProps {
  gradientColor1?: string;
  gradientColor2?: string;
  useGradient?: boolean;
  imageSrcs: string[];
  width: number | string;
  height: number | string;
  triggerDownload: boolean;
  maxImageWidth?: number;
  acabado: string;
  onAddText?: (fn: () => void) => void;
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
  acabado,
  onAddText,
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
  const previousImageSrcsRef = useRef<string[]>([]);

  const addText = useCallback(() => {
    if (fabricCanvasRef.current) {
      const text = new fabric.IText('Doble click para editar', {
        left: fabricCanvasRef.current.width! / 2,
        top: fabricCanvasRef.current.height! / 2,
        fontSize: 80,
        fill: '#000',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
        textAlign: 'center',
      });
      
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      fabricCanvasRef.current.renderAll();
    }
  }, []);

  useEffect(() => {
    if (onAddText) {
      onAddText(addText);
    }
  }, [addText, onAddText]);

  // Cropping logic
  const cropImage = (image: fabric.Image): Promise<fabric.Image> => {
    return new Promise((resolve, reject) => {
      const canvasElement = document.createElement("canvas");
      const context = canvasElement.getContext("2d");
      if (!context) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      const imgElement = new Image();
      imgElement.src = image.getSrc();
      imgElement.crossOrigin = "anonymous"; // Ensure this line is present

      imgElement.onload = () => {
        canvasElement.width = imgElement.width;
        canvasElement.height = imgElement.height;
        context.drawImage(imgElement, 0, 0);

        try {
          const imageData = context.getImageData(
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          const { data, width, height } = imageData;

          let minX = width,
            minY = height,
            maxX = 0,
            maxY = 0;

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const index = (y * width + x) * 4;
              const alpha = data[index + 3];
              if (alpha > 0) {
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
              }
            }
          }

          const croppedWidth = maxX - minX + 1;
          const croppedHeight = maxY - minY + 1;

          const croppedCanvas = document.createElement("canvas");
          const croppedContext = croppedCanvas.getContext("2d");
          if (!croppedContext) {
            reject(new Error("Failed to get cropped canvas context"));
            return;
          }

          croppedCanvas.width = croppedWidth;
          croppedCanvas.height = croppedHeight;
          croppedContext.drawImage(
            canvasElement,
            minX,
            minY,
            croppedWidth,
            croppedHeight,
            0,
            0,
            croppedWidth,
            croppedHeight
          );

          const croppedImage = new Image();
          croppedImage.src = croppedCanvas.toDataURL();
          croppedImage.onload = () => {
            const fabricCroppedImage = new fabric.Image(croppedImage);
            resolve(fabricCroppedImage);
          };
          croppedImage.onerror = (error) => {
            reject(error);
          };
        } catch (error) {
          reject(error);
        }
      };

      imgElement.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      (e.key === "Backspace" || e.key === "Delete") &&
      selectedImageRef.current
    ) {
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
        const widthInCm = fabricImg.width * fabricImg.scaleX * scaleToCmX;
        const heightInCm = fabricImg.height * fabricImg.scaleY * scaleToCmY;
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
          fabric.Image.fromURL(imgElement.src, async (fabricImg) => {
            fabricImg.set({
              left: fabricCanvas.width! / 2,
              top: fabricCanvas.height! / 2,
              originX: "center",
              originY: "center",
              scaleX: scaleFactor,
              scaleY: scaleFactor,
              selectable: true,
              hasControls: true,
              hasBorders: false,
              hasRotatingPoint: true,
            });

            const croppedImage = await cropImage(fabricImg);

            fabricCanvas.add(croppedImage);
            fabricCanvas.setActiveObject(croppedImage);
            fabricCanvas.renderAll();

            updateImageDimensions(croppedImage);

            croppedImage.on("scaling", () =>
              updateImageDimensions(croppedImage)
            );
            croppedImage.on("scaled", () =>
              updateImageDimensions(croppedImage)
            );
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

      // Customize control points
      fabric.Object.prototype.controls = fabric.Object.prototype.controls || {};
      Object.keys(fabric.Object.prototype.controls).forEach((controlKey) => {
        const control = fabric.Object.prototype.controls[controlKey];
        control.sizeX = 28; // Increase the size of the control points
        control.sizeY = 32; // Increase the size of the control points
        control.render = (ctx, left, top) => {
          // Removed unused parameters
          ctx.save();
          ctx.fillStyle = "white"; // Color of the control points
          ctx.strokeStyle = "red"; // Border color of the control points
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.rect(
            left - (control.sizeX ?? 40) / 2,
            top - (control.sizeY ?? 40) / 2,
            control.sizeX ?? 40,
            control.sizeY ?? 40
          );
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };
      });

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
        tamano: "14x20",
        price: 0,
        acabado: acabado,
      };

      setCart([...cart, productToAdd]);
    }
  }, [cart, setCart, acabado]);

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
    const newImages = imageSrcs;

    if (newImages.length > 0) {
      const newImageSrc = newImages[newImages.length - 1];
      const newImage = {
        id: `${newImageSrc}-${Date.now()}-${Math.random()}`,
        src: newImageSrc,
      };
      addImageToCanvas(newImage);
      previousImageSrcsRef.current = [
        ...previousImageSrcsRef.current,
        newImageSrc,
      ];
    }
  }, [imageSrcs, addImageToCanvas]);

  return (
    <>
    <canvas
      ref={canvasRef}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      style={{
        width: typeof width === "string" ? width : undefined,
        height: typeof height === "string" ? height : undefined,
      }}
    />
    </>
  );
};

export default Canvas;
