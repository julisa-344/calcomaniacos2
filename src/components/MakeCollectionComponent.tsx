import { useEffect, useState, useRef } from 'react';
import Button from './Button';
import './style/MakeCollection.scss';
import { fabric } from 'fabric';

function MakeCollection() {
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const [images, setImages] = useState<any[]>([]); // Tipado correcto para imágenes

    useEffect(() => {
        // Fetch de datos y carga de imágenes
        const fetchData = async () => {
            const response = await fetch("data.json");
            const data = await response.json();
            setImages(data);
        };
        fetchData();

        // Inicialización del canvas
        const canvas = new fabric.Canvas('canvas', {
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
                borderColor: 'red',
                cornerColor: 'green',
                cornerSize: 6,
                transparentCorners: false,
                hasControls: true,
            });

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
                        <input type="color" id="color-picker" className="color-picker" defaultValue="#ffffff" />
                        <input type="color" id="gradient-color-picker" className="color-picker" defaultValue="#000000" style={{ display: "none" }} />
                        <button id="update-silhouette-thickness-btn">Actualizar Grosor de Silueta</button>
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
                    <Button text="Descargar" onClick={() => { /* Lógica para eliminar imagen */ }} />

                </div>    
        </section>
    );
}

export default MakeCollection;
