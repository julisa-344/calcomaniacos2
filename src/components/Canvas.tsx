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

  // Cropping logic
  const cropImage = (image: fabric.Image): Promise<fabric.Image> => {
    return new Promise((resolve) => {
      const canvasElement = document.createElement("canvas");
      const context = canvasElement.getContext("2d");
      if (!context) return;

      canvasElement.width = image.width!;
      canvasElement.height = image.height!;
      context.drawImage(image.getElement() as HTMLImageElement, 0, 0);

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
      if (!croppedContext) return;

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

              // Personalizar los controladores
              cornerSize: 40, // Tamaño de las esquinas
              borderColor: 'blue', // Color del borde alrededor del objeto
              cornerColor: 'red', // Color de las esquinas
              cornerStrokeColor: 'black', // Color del borde alrededor de la esquina
              transparentCorners: false, // Hacer que las esquinas no sean transparentes

              
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

      // fabric.Object.prototype.set({
      //   cornerSize: 30, // Tamaño de los controladores
      //   cornerStyle: 'circle', // Estilo de las esquinas (puede ser 'circle' o 'rect')
      //   cornerColor: 'red', // Color de las esquinas
      //   borderColor: 'blue', // Color del borde alrededor del objeto seleccionado
      //   cornerStrokeColor: 'black', // Color del borde de las esquinas
      //   transparentCorners: false // Para que las esquinas no sean transparentes
      // });

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
