import { useEffect, useState, useRef } from "react";
import Button from "./Button";
import "./style/MakeCollection.scss";
import { fabric } from "fabric";


class Dilate extends fabric.Image.filters.BaseFilter{
    type = "Dilate";
    radius: number = 8;

    fragmentSource = `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uRadius;
    varying vec2 vTexCoord;

    void main() {
      vec4 color = vec4(0.0);
      float radius = uRadius;
      for (float y = -radius; y <= radius; y++) {
        for (float x = -radius; x <= radius; x++) {
          vec4 sample = texture2D(uTexture, vTexCoord + vec2(x, y) / vec2(textureSize(uTexture, 0)));
          color = max(color, sample);
        }
      }
      gl_FragColor = color;
    }
  `;

    applyTo2d = function (this: Dilate, options: { imageData: ImageData }) {
      // Fallback for non-WebGL environments
      const imageData = options.imageData;
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      const radius = this.radius;
    
      const copy = new Uint8ClampedArray(data);
    
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let maxR = 0,
            maxG = 0,
            maxB = 0,
            maxA = 0;
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const index = (ny * width + nx) * 4;
                maxR = Math.max(maxR, copy[index]);
                maxG = Math.max(maxG, copy[index + 1]);
                maxB = Math.max(maxB, copy[index + 2]);
                maxA = Math.max(maxA, copy[index + 3]);
              }
            }
          }
          const index = (y * width + x) * 4;

          // Only apply the filter to transparent pixels
          if (data[index + 3] === 0) {
            data[index] = maxR;
            data[index + 1] = maxG;
            data[index + 2] = maxB;
            data[index + 3] = maxA;
          }
        }
      }
    };
    
    isNeutralState = function (this: Dilate) {
      return this.radius === 0;
    };
    
    getUniformLocations = function (this: Dilate, gl: WebGLRenderingContext, program: WebGLProgram) {
      return {
        uTexture: gl.getUniformLocation(program, "uTexture"),
        uRadius: gl.getUniformLocation(program, "uRadius"),
      };
    };
    
    sendUniformData = function (this: Dilate, gl: WebGLRenderingContext, uniformLocations: any) {
      gl.uniform1f(uniformLocations.uRadius, this.radius);
    };
  }

function MakeCollection() {
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    // Fetch de datos y carga de imágenes
    const fetchData = async () => {
      const response = await fetch("data.json");
      const data = await response.json();
      setImages(data);
    };
    fetchData();

    // Inicialización del canvas
    const canvas = new fabric.Canvas("canvas", {
      selection: true, // Habilitar selección múltiple
    });
    canvasRef.current = canvas;

    // Limpieza al desmontar el componente
    return () => {
      canvas.dispose();
    };
  }, []);

  const addToCanvas = (image: { src: string }) => {
    fabric.Image.fromURL(image.src, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
        hasBorders: true,
        borderColor: "red",
        cornerColor: "green",
        cornerSize: 6,
        transparentCorners: false,
        hasControls: true,
      });

      img.filters = [];

      // Apply the SVG filter
      img.filters.push(new Dilate());

      img.applyFilters();

      if (canvasRef.current) {
        canvasRef.current.add(img);
        canvasRef.current.setActiveObject(img); // Hacer la imagen activa para facilitar su manipulación
        canvasRef.current.renderAll();
      }
    });
  };

  return (
    <section className="container">
      <div className="content-canvas">
        <div className="action-canvas">
          <div className="color-picker-container">
            <label htmlFor="silhouette-type">Tipo de Silueta:</label>
            <select id="silhouette-type" className="color-picker">
              <option value="solid">Sólido</option>
              <option value="gradient">Degradado</option>
            </select>
            <input
              type="color"
              id="color-picker"
              className="color-picker"
              defaultValue="#ffffff"
            />
            <input
              type="color"
              id="gradient-color-picker"
              className="color-picker"
              defaultValue="#000000"
              style={{ display: "none" }}
            />
            <button id="update-silhouette-thickness-btn">
              Actualizar Grosor de Silueta
            </button>
          </div>
        </div>
        <canvas id="canvas" width="567" height="794"></canvas>
      </div>

      <div className="catalog-container">
        <div className="catalog-categories"></div>
        <div id="catalog" className="container_catalog-img">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Imagen de ${image.categoria}`}
              className="catalog-img"
              onClick={() => addToCanvas(image)}
            />
          ))}
        </div>
        <Button
          text="Descargar"
          onClick={() => {
            /* Lógica para eliminar imagen */
          }}
        />
      </div>
    </section>
  );
}

export default MakeCollection;
