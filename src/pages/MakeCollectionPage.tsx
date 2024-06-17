import { useEffect, useState, useRef } from 'react';
import { IconButton } from '@mui/material';
import Button from '../components/Button';
import './style/MakeCollection.scss';
import { fabric } from 'fabric';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GestureIcon from '@mui/icons-material/Gesture';
import GradientIcon from '@mui/icons-material/Gradient';

function MakeCollection() {
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("data.json");
            const data = await response.json();
            setImages(data);
        };
        fetchData();

        const canvas = new fabric.Canvas('canvas', {
            selection: true,
        });
        canvasRef.current = canvas;

        return () => {
            canvas.dispose();
        };
    }, []);

    const addToCanvas = async (image: { src: string }) => {
        try {
            const formData = new FormData();
            const response = await fetch(image.src);

            console.log("response", response);

            const blob = await response.blob();
            formData.append('image', blob, 'image.png');
            console.log("formData", formData);
            const uploadResponse = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                console.log("error", uploadResponse);
                throw new Error('Failed to upload image');
            }

            // Crear un objeto URL a partir de los datos de la imagen
            const blobresponse = await uploadResponse.blob();
            const processedImageSrc = URL.createObjectURL(blobresponse);

            console.log("processedImageSrc", processedImageSrc);
            fabric.Image.fromURL(processedImageSrc, (img) => {
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

                // Define la ruta de recorte
                const clipPath = new fabric.Circle({
                    radius: img.width ? img.width / 2 : 0,
                    left: img.left,
                    top: img.top,
                    absolutePositioned: true
                });

                img.clipPath = clipPath;

                if (canvasRef.current) {
                    canvasRef.current.add(img);
                    canvasRef.current.setActiveObject(img); // Hacer la imagen activa para facilitar su manipulación
                    canvasRef.current.renderAll();
                }
            });
        } catch (error) {
            console.log('Error uploading image:', error);
        }
    };

    return (
        <>
        <main className="bg-color mt-h">
            <h2 className='title pt-8 text-center'>Crea tu colecciòn</h2>
            <section className="container">
                    <div className="content-canvas">
                        <div className="action-canvas">
                            <div className="color-picker-container">
                                {/* <label htmlFor="silhouette-type">Tipo de Silueta:</label> */}
                                {/* <select id="silhouette-type" className="color-picker">
                                <option value="solid">Sólido</option>
                                <option value="gradient">Degradado</option>
                            </select> */}
                                <IconButton>
                                    <ColorLensIcon />
                                </IconButton>
                                <IconButton>
                                    <GestureIcon />
                                </IconButton>
                                <IconButton>
                                    <GradientIcon />
                                </IconButton>
                                {/* <input type="color" id="color-picker" className="color-picker" defaultValue="#ffffff" />
                            <input type="color" id="gradient-color-picker" className="color-picker" defaultValue="#000000" style={{ display: "none" }} />
                            <button id="update-silhouette-thickness-btn">Actualizar Grosor de Silueta</button> */}
                            </div>
                        </div>
                        <canvas id="canvas" width="467" height="750"></canvas>
                    </div>

                    <div className="catalog-container text-center">
                        <div className="catalog-categories"></div>
                        <div id="catalog" className="container_catalog-img m-b">
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
                        <Button className="m-t" text="Descargar" onClick={() => { }} variant='outlined' />
                    </div>
                </section>
            </main>
        </>
    );
}

export default MakeCollection;
