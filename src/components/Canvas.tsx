import React, { useContext, useEffect, useRef, useCallback, useState } from "react";
import { fabric } from "fabric";
import { CartContext, CartContextType } from "../CartContext";

interface CanvasProps {
  color: string;
  gradientColor1?: string;
  gradientColor2?: string;
  useGradient?: boolean;
  imageSrcs: string[];
  width: number | string;
  height: number | string;
  triggerDownload: boolean;
  maxImageWidth?: number;
  onResize: (width: number, height: number) => void;
  onDownloadComplete: () => void; // Callback to reset trigger
}

interface ImageItem {
  id: string;
  src: string;
}

const Canvas: React.FC<CanvasProps> = ({
  color,
  gradientColor1 = "",
  gradientColor2 = "",
  useGradient = false,
  imageSrcs,
  width,
  height,
  maxImageWidth = 300,
  triggerDownload,
  onResize,
  onDownloadComplete, // Callback to reset trigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const selectedImageRef = useRef<fabric.Image | null>(null);
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  const imageMapRef = useRef(
    new Map<
      fabric.Image,
      {
        silhouette: fabric.Image;
        color: string;
        gradientColor1: string;
        gradientColor2: string;
        useGradient: boolean;
      }
    >()
  );
  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
        selection: false,
      });
      // Escala visualmente usando Fabric.js
      fabricCanvasRef.current.setDimensions(
        {
          width: 500 + "px", // Tamaño visible en pantalla
          height: 700 + "px",
        },
        {
          cssOnly: true, // Importante: solo afecta la visualización en CSS, no la resolución interna
        }
      );

      fabricCanvasRef.current.on("mouse:down", (options) => {
        if (options.target && options.target.type === "image") {
          selectedImageRef.current = options.target as fabric.Image;
        } else {
          selectedImageRef.current = null;
        }
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && selectedImageRef.current) {
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
      };
      
      const handlePaste = (e: ClipboardEvent) => {
        if (e.clipboardData && fabricCanvasRef.current) {
          const items = e.clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              const blob = items[i].getAsFile();
              const reader = new FileReader();
              reader.onload = (event) => {
                const imgElement = new Image();
                imgElement.src = event.target?.result as string;
                imgElement.onload = () => {
                  const canvasWidthPx = 1653; // 14 cm en píxeles a 300 DPI
                  const canvasHeightPx = 2362; // 20 cm en píxeles a 300 DPI
      
                  const scaleWidth = canvasWidthPx / imgElement.width;
                  const scaleHeight = canvasHeightPx / imgElement.height;
                  const scaleFactor = Math.min(scaleWidth, scaleHeight, 1); // Escala proporcional sin exceder el tamaño del canvas
      
                  fabric.Image.fromURL(imgElement.src, (fabricImg) => {
                    fabricImg.set({
                      left: fabricCanvasRef.current!.width! / 2,
                      top: fabricCanvasRef.current!.height! / 2,
                      originX: "center",
                      originY: "center",
                      scaleX: scaleFactor,
                      scaleY: scaleFactor,
                    });
                    const scaleX = 12 / 600;
                      const scaleY = 24 / 920;
      
                    fabricCanvasRef.current?.add(fabricImg);
                    fabricCanvasRef.current?.setActiveObject(fabricImg);
                    fabricCanvasRef.current?.renderAll();

                    // Actualizar tamaño usando onResize
                    if (fabricImg.width && fabricImg.scaleX && fabricImg.height && fabricImg.scaleY) {
                      const widthInCm = (fabricImg.width * fabricImg.scaleX);
                      const heightInCm = (fabricImg.height * fabricImg.scaleY);
                      // console.log("Width1: ", widthInCm, "Height: ", heightInCm);
                      onResize(widthInCm + scaleX, heightInCm + scaleY);  // Llama a onResize con tamaño en cm
                    }
                    // console.log("FabricImg.width: ", fabricImg.width, fabricImg.scaleX, fabricImg.height, fabricImg.scaleY);

                    // Añadir eventos para el escalado interactivo
                    fabricImg.on("scaling", () => {
                     
                      
                      // console.log("ScaleX: ", scaleX, "ScaleY: ", scaleY, "Width: ", fabricImg.width, "Height: ", fabricImg.height);
                      // const widthInCm = fabricImg.width && fabricImg.scaleX ? (fabricImg.width * fabricImg.scaleX) / 2.54 : 0;
                      // const heightInCm = fabricImg.height ? (fabricImg.height * fabricImg.scaleY!) / 2.54 : 0;
                      const widthInCm = fabricImg.width && fabricImg.scaleX ? (fabricImg.width * fabricImg.scaleX) / 2.54 : 0;
                      const heightInCm = fabricImg.height ? (fabricImg.height * fabricImg.scaleY!) / 2.54 : 0;
                      onResize(widthInCm, heightInCm); // Se actualiza el tamaño en cm
                    });

                    fabricImg.on("scaled", () => {
                      const widthInCm = (fabricImg.width! * fabricImg.scaleX!) / 2.54
                      const heightInCm = (fabricImg.height! * fabricImg.scaleY!) / 37.795;
                      // console.log("Width2: ", widthInCm, "Height: ", heightInCm);
                      onResize(widthInCm, heightInCm);  // Se actualiza después del escalado
                    });
                  });
                };
              };
              if (blob) reader.readAsDataURL(blob);
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("paste", handlePaste);

      return () => {
        fabricCanvasRef.current?.dispose();
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("paste", handlePaste);
      };
    }
  }, [maxImageWidth]);

  useEffect(() => {
    if (selectedImageRef.current) {
      const currentSilhouette = imageMapRef.current.get(
        selectedImageRef.current
      )?.silhouette!;
      imageMapRef.current.set(selectedImageRef.current, {
        silhouette: currentSilhouette,
        color: color,
        gradientColor1: gradientColor1,
        gradientColor2: gradientColor2,
        useGradient: useGradient,
      });
    }
  }, [color, gradientColor1, gradientColor2, useGradient]);

  const handleDownload = () => {
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
  }

  useEffect(() => {
    if (triggerDownload) {
      handleDownload();
      onDownloadComplete(); // Reset the trigger
    }
  }, [triggerDownload, onDownloadComplete]);

  const addImageToCanvas = useCallback((image: ImageItem) => {
    const fabricCanvas = fabricCanvasRef.current;
  
    if (fabricCanvas) {
      const imgElement = new Image();
      imgElement.src = image.src;
      imgElement.crossOrigin = "anonymous";
      imgElement.onload = () => {
        const maxDimension = maxImageWidth;
        const scaleWidth = maxDimension / imgElement.width;
        const scaleHeight = maxDimension / imgElement.height;
        const scaleFactor = Math.min(scaleWidth, scaleHeight, 1);
  
        fabric.Image.fromURL(image.src, (fabricImg) => {
          fabricImg.set({
            left: fabricCanvas.width! / 2,
            top: fabricCanvas.height! / 2,
            originX: "center",
            originY: "center",
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            selectable: true, // Permitir que la imagen sea escalable
          });
  
          fabricCanvas.add(fabricImg);
          fabricCanvas.setActiveObject(fabricImg);
          fabricCanvas.renderAll();
  
          // Detectar cambio de escala y actualizar las dimensiones
          fabricImg.on("scaling", () => {
            if (fabricImg.width && fabricImg.scaleX && fabricImg.height && fabricImg.scaleY) {
              const widthInCm = (fabricImg.width * fabricImg.scaleX) / 37.795;
              const heightInCm = (fabricImg.height * fabricImg.scaleY) / 37.795;
              onResize(widthInCm, heightInCm);
            }
          });
  
          // Actualizar dimensiones al soltar el ratón después de escalar
          fabricImg.on("scaled", () => {
            if (fabricImg.width && fabricImg.scaleX && fabricImg.height && fabricImg.scaleY) {
              const widthInCm = (fabricImg.width * fabricImg.scaleX) / 37.795;
              const heightInCm = (fabricImg.height * fabricImg.scaleY) / 37.795;
              onResize(widthInCm, heightInCm);
            }
          });
  
          if (fabricImg.width && fabricImg.scaleX && fabricImg.height && fabricImg.scaleY) {
            const widthInCm = (fabricImg.width * fabricImg.scaleX) / 37.795;
            const heightInCm = (fabricImg.height * fabricImg.scaleY) / 37.795;
            onResize(widthInCm, heightInCm);
          }
        });
      };
    }
  }, [maxImageWidth, onResize]);
  
  // Ahora el useEffect que usa addImageToCanvas
  useEffect(() => {
    if (imageSrcs.length > 0) {
      const newImageSrc = imageSrcs[imageSrcs.length - 1];
      const newImage = {
        id: `${newImageSrc}-${Date.now()}-${Math.random()}`,
        src: newImageSrc,
      };
      addImageToCanvas(newImage);
    }
  }, [imageSrcs, addImageToCanvas]); // Añade addImageToCanvas como dependencia

  return (
    <canvas
      ref={canvasRef}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      style={{
        width: typeof width === "string" ? width : undefined,
        height: typeof height === "string" ? height : undefined,
      }}
    />
  );
};

export default Canvas;
