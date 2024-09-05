import React, { useContext, useEffect, useRef, useCallback } from "react";
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
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const selectedImageRef = useRef<fabric.Image | null>(null);
  const { cart, setCart } = useContext<CartContextType>(CartContext);
  const imageMapRef = useRef(
    new Map<fabric.Image, { silhouette: fabric.Image; color: string; gradientColor1: string; gradientColor2: string; useGradient: boolean }>()
  );
  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        preserveObjectStacking: true,
        selection: false,

      });

            // Escala visualmente usando Fabric.js
            fabricCanvasRef.current.setDimensions({
              width: 500 + 'px',  // Tamaño visible en pantalla
              height: 700 + 'px',
            }, {
              cssOnly: true  // Importante: solo afecta la visualización en CSS, no la resolución interna
            });

      fabricCanvasRef.current.on("mouse:down", (options) => {
        if (options.target && options.target.type === "image") {
          selectedImageRef.current = options.target as fabric.Image;
        } else {
          selectedImageRef.current = null;
        }
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Backspace' && selectedImageRef.current) {
          const silhouette = imageMapRef.current.get(selectedImageRef.current)?.silhouette;
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
            if (items[i].type.startsWith('image/')) {
              const blob = items[i].getAsFile();
              const reader = new FileReader();
              reader.onload = (event) => {
                const imgElement = new Image();
                imgElement.src = event.target?.result as string;
                imgElement.onload = () => {
                  const maxDimension = maxImageWidth;
                  const scaleWidth = maxDimension / imgElement.width;
                  const scaleHeight = maxDimension / imgElement.height;
                  const scaleFactor = Math.min(scaleWidth, scaleHeight, 1);

                  fabric.Image.fromURL(imgElement.src, (fabricImg) => {
                    fabricImg.set({
                      left: fabricCanvasRef.current!.width! / 2,
                      top: fabricCanvasRef.current!.height! / 2,
                      originX: "center",
                      originY: "center",
                      scaleX: scaleFactor,
                      scaleY: scaleFactor,
                    });

                    fabricCanvasRef.current?.add(fabricImg);
                    fabricCanvasRef.current?.setActiveObject(fabricImg);
                    fabricCanvasRef.current?.renderAll();
                  });
                };
              };
              if (blob) reader.readAsDataURL(blob);
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('paste', handlePaste);

      return () => {
        fabricCanvasRef.current?.dispose();
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('paste', handlePaste);
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

  useEffect(() => {
    if (triggerDownload) {
      if (fabricCanvasRef.current) {
        const dataURL = fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1.0,
        });

        const productToAdd = {
          img: dataURL,
          name: 'Collection personalizada',
          price: 22,
          tamano: '14x20',
          acabado: 'Transferible',
        };

        setCart([...cart, productToAdd]);
      }
    }
  }, [triggerDownload, cart, setCart]);

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
          });
  
          fabricCanvas.add(fabricImg);
          fabricCanvas.setActiveObject(fabricImg);
          fabricCanvas.renderAll();
  
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
  }, [imageSrcs, addImageToCanvas]);  // Añade addImageToCanvas como dependencia
  

  return (
    <canvas
      ref={canvasRef}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      style={{ width: typeof width === "string" ? width : undefined, height: typeof height === "string" ? height : undefined }}
    />
  );
};

export default Canvas;
